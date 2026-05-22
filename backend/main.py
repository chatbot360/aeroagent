import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from groq import Groq
from pydantic import BaseModel
from typing import List, Dict, Any
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

AQICN_API_KEY = os.getenv("AQICN_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    city: str

class AnalyzeGeoRequest(BaseModel):
    lat: float
    lng: float

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

def get_aqi_color_and_label(aqi_val):
    if aqi_val <= 50: return "#00E5FF", "Good"
    elif aqi_val <= 100: return "#FDE047", "Moderate"
    elif aqi_val <= 150: return "#F97316", "Sensitive"
    elif aqi_val <= 200: return "#EF4444", "Unhealthy"
    elif aqi_val <= 300: return "#A855F7", "Very Unhealthy"
    else: return "#9F1239", "Hazardous"

async def process_aqi_response(url: str):
    if not AQICN_API_KEY or not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Server misconfiguration: API keys are missing in the backend .env file.")

    try:
        res = requests.get(url, timeout=10)
        data = res.json()
        if data.get('status') != 'ok':
            raise HTTPException(status_code=400, detail="Could not find AQI data for this location.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch AQI data.")
        
    aqi_data = data['data']
    try: aqi_val = int(aqi_data.get('aqi', 0))
    except: aqi_val = 0
    
    city_name = aqi_data.get('city', {}).get('name', 'Unknown')
    geo = aqi_data.get('city', {}).get('geo', [0, 0])
    color, label = get_aqi_color_and_label(aqi_val)

    forecast_raw = aqi_data.get('forecast', {}).get('daily', {}).get('pm25', [])
    forecast = [{"day": f.get('day'), "avg": f.get('avg')} for f in forecast_raw]

    advice = ""
    try:
        client = Groq(api_key=GROQ_API_KEY)
        prompt = f"You are a health advisor. Location: {city_name}. AQI: {aqi_val} ({label}). Give 3 practical tips for someone going outdoors today. Keep it under 100 words. Format with emojis."
        ai_response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=300,
            messages=[{"role": "user", "content": prompt}]
        )
        advice = ai_response.choices[0].message.content
    except Exception as e:
        print(f"GROQ API ERROR: {e}", flush=True)
        advice = "Could not fetch AI advice. Please check your Groq API key in the .env file."

    return {
        "city": city_name,
        "aqi": aqi_val,
        "label": label,
        "color": color,
        "advice": advice,
        "geo": geo,
        "forecast": forecast
    }

@app.post("/api/analyze")
async def analyze_aqi(req: AnalyzeRequest):
    url = f"https://api.waqi.info/feed/{req.city}/?token={AQICN_API_KEY}"
    return await process_aqi_response(url)

@app.post("/api/analyze-geo")
async def analyze_aqi_geo(req: AnalyzeGeoRequest):
    url = f"https://api.waqi.info/feed/geo:{req.lat};{req.lng}/?token={AQICN_API_KEY}"
    return await process_aqi_response(url)


# ==========================================
# AGENTIC SYSTEM: TOOL CALLING LOGIC
# ==========================================

agent_tools = [
    {
        "type": "function",
        "function": {
            "name": "search_wikipedia",
            "description": "Search Wikipedia for general information about a city, health guidelines, or historical facts. Use this when the user asks for factual information.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query (e.g., 'New York City history' or 'Air Quality Index')"
                    }
                },
                "required": ["query"]
            }
        }
    }
]

def search_wikipedia(query):
    try:
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{query.replace(' ', '_')}"
        res = requests.get(url, timeout=5)
        if res.status_code == 200:
            return res.json().get('extract', 'No summary found.')
        return "No Wikipedia entry found for this query."
    except:
        return "Failed to search Wikipedia."

@app.post("/api/chat")
async def chat_with_agent(req: ChatRequest):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Server misconfiguration: Groq API key missing in .env file.")

    try:
        client = Groq(api_key=GROQ_API_KEY)
        messages_dict = [{"role": msg.role, "content": msg.content} for msg in req.messages]
        
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages_dict,
            tools=agent_tools,
            tool_choice="auto",
            max_tokens=500
        )
        
        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls
        
        if tool_calls:
            tool_calls_dict = []
            for tc in tool_calls:
                tool_calls_dict.append({
                    "id": tc.id,
                    "type": tc.type,
                    "function": {
                        "name": tc.function.name,
                        "arguments": tc.function.arguments
                    }
                })
                
            messages_dict.append({
                "role": "assistant",
                "content": response_message.content,
                "tool_calls": tool_calls_dict
            })
            
            for tool_call in tool_calls:
                if tool_call.function.name == "search_wikipedia":
                    function_args = json.loads(tool_call.function.arguments)
                    function_response = search_wikipedia(function_args.get("query"))
                    
                    messages_dict.append({
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": "search_wikipedia",
                        "content": function_response
                    })
            
            second_response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages_dict,
                max_tokens=500
            )
            return {"reply": second_response.choices[0].message.content}
            
        return {"reply": response_message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent orchestration failed: {str(e)}")
