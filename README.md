# 🌍 AeroAgent: Autonomous Spatial & Air Quality LLM System

### 🟢 [CLICK HERE TO VIEW LIVE PROJECT](https://aeroagent.vercel.app/)

## Project Overview
AeroAgent is an enterprise-grade, full-stack application built to seamlessly fuse real-time environmental telemetry (Air Quality Index) with an **Agentic Generative AI backend**. This system not only provides spatial visualization and 7-day health forecasting, but it also features a native LLM Orchestration layer using Llama 3.3. 

The AI does not just answer questions—it acts as an autonomous agent with **Tool-Calling capabilities**, accessing live internet data to inform its health advisories.

## 🚀 Key Features
- **Agentic Orchestration (Backend):** Built with FastAPI and Groq API. The LLM is armed with custom Python tools (like live Wikipedia extraction) and runs an autonomous decision loop to resolve user queries.
- **Voice AI Interface (Frontend):** True JARVIS-like multimodal interaction. Features Web Speech API transcription (Voice-to-Text) and Speech Synthesis (Text-to-Voice).
- **Spatial Mapping:** Zoomable, high-contrast dark-mode geospatial mapping via `react-leaflet` and CARTO tile layers.
- **Bento-Box UI:** Ultra-premium glassmorphism design with responsive grid layouts and SVG neon gauge animations.
- **One-Click Telemetry Export:** Instant PDF report generation of the entire dashboard using `html2canvas` and `jsPDF`.
- **Geolocation Targeter:** Browser-native coordinate extraction to auto-load local telemetry.

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Recharts, Leaflet, Lucide-React
- **Backend:** Python, FastAPI, Groq (Llama 3.3)
- **External APIs:** WAQI (World Air Quality Index), Groq

## 💻 How to Run Locally

### 1. Start the Agentic Backend
Open a terminal in the `backend/` directory:
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Start the React Frontend
Open a new terminal in the `frontend/` directory:
```bash
npm install
npm run dev
```

### 3. Initialize the Engine
Open `http://localhost:5173` in your browser. You will need:
1. A free [Groq API Key](https://console.groq.com/)
2. A free [AQICN API Key](https://aqicn.org/data-platform/token/)

---

*Architected by Chaitanya Chopra.*
