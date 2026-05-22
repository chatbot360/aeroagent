import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Send, MessageSquare, Map as MapIcon, Activity, Layers, Crosshair, DownloadCloud, Mic, MicOff } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './index.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Deployment Environment Variable for API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function MapUpdater({ geo }) {
  const map = useMap();
  useEffect(() => {
    if (geo) map.flyTo(geo, 11);
  }, [geo, map]);
  return null;
}

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Dashboard State
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [aqiData, setAqiData] = useState(null);
  const [advice, setAdvice] = useState("");
  
  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Compare State
  const [compareLoc1, setCompareLoc1] = useState("");
  const [compareLoc2, setCompareLoc2] = useState("");
  const [compareData1, setCompareData1] = useState(null);
  const [compareData2, setCompareData2] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);

  const dashboardRef = useRef(null);

  const getAqiConfig = (aqi) => {
    if (aqi <= 50) return { color: "#00E5FF", glow: "rgba(0, 229, 255, 0.6)", label: "GOOD" };
    if (aqi <= 100) return { color: "#FDE047", glow: "rgba(253, 224, 71, 0.6)", label: "MODERATE" };
    if (aqi <= 150) return { color: "#F97316", glow: "rgba(249, 115, 22, 0.6)", label: "SENSITIVE" };
    if (aqi <= 200) return { color: "#EF4444", glow: "rgba(239, 68, 68, 0.6)", label: "UNHEALTHY" };
    if (aqi <= 300) return { color: "#A855F7", glow: "rgba(168, 85, 247, 0.6)", label: "VERY UNHEALTHY" };
    return { color: "#9F1239", glow: "rgba(159, 18, 57, 0.6)", label: "HAZARDOUS" };
  };

  const fetchAqi = async (e) => {
    if(e) e.preventDefault();
    if(!location) return;
    setLoading(true);
    setAqiData(null);
    setAdvice("");
    setChatLog([]);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: location })
      });
      const data = await res.json();
      if(res.ok) {
        setAqiData(data);
        setAdvice(data.advice);
      } else {
        setAdvice(data.detail || "Error finding city.");
      }
    } catch (err) {
      setAdvice("Error connecting to Python backend.");
    }
    setLoading(false);
  };

  const fetchGeoAqi = async (e) => {
    if(e) e.preventDefault();
    if (!navigator.geolocation) {
        setAdvice("Geolocation is not supported by your browser.");
        return;
    }
    setLoading(true);
    setAqiData(null);
    setAdvice("");
    setChatLog([]);
    
    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/analyze-geo`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    lat: position.coords.latitude, 
                    lng: position.coords.longitude
                })
            });
            const data = await res.json();
            if(res.ok) {
                setAqiData(data);
                setAdvice(data.advice);
                setLocation(data.city); // Auto-fill search box
            } else {
                setAdvice(data.detail || "Error finding location.");
            }
        } catch (err) {
            setAdvice("Error connecting to Python backend.");
        }
        setLoading(false);
    }, (err) => {
        setAdvice("Geolocation access denied or failed.");
        setLoading(false);
    });
  };

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    try {
        const canvas = await html2canvas(dashboardRef.current, { backgroundColor: '#000000', scale: 2 });
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`AQI_Report_${aqiData.city.replace(/ /g, '_')}.pdf`);
    } catch (e) {
        console.error("Failed to export PDF", e);
    }
  };

  const fetchCompare = async (e) => {
    e.preventDefault();
    if(!compareLoc1 || !compareLoc2) return;
    setCompareLoading(true);
    
    try {
      const p1 = fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: compareLoc1 })
      }).then(res => res.json());

      const p2 = fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: compareLoc2 })
      }).then(res => res.json());

      const [data1, data2] = await Promise.all([p1, p2]);
      setCompareData1(data1);
      setCompareData2(data2);
    } catch (err) {
      console.error(err);
    }
    setCompareLoading(false);
  };

  // VOICE AI METHODS
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Voice AI transcription.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setChatInput(speechToText);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if(!chatInput || !aqiData) return;
    
    const newLog = [...chatLog, { role: "user", content: chatInput }];
    setChatLog(newLog);
    setChatInput("");
    setChatLoading(true);
  
    const systemPrompt = `You are an Autonomous Health Agent. Context: City: ${aqiData.city}, AQI: ${aqiData.aqi} (${aqiData.label}). Original advice given: ${advice}. You have access to a Wikipedia search tool. If the user asks for historical or general knowledge, use the tool. If not, answer directly and concisely.`;
  
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [{ role: "system", content: systemPrompt }, ...newLog] 
        })
      });
      const data = await res.json();
      setChatLog([...newLog, { role: "assistant", content: data.reply }]);
      
      // Voice Output
      speak(data.reply);
    } catch (e) {
      setChatLog([...newLog, { role: "assistant", content: "Error connecting to Agent." }]);
    }
    setChatLoading(false);
  };

  const renderGauge = (city, aqi, config) => {
    const percentage = Math.min(aqi / 500, 1);
    const circumference = 125.66;
    const offset = circumference * (1 - percentage);
    return (
      <div style={{ position: 'relative', width: '280px', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg viewBox="0 0 100 55" style={{ width: '100%', overflow: 'visible' }}>
          <defs>
            <filter id={`neonGlow-${city}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" strokeLinecap="round" />
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={config.color} strokeWidth="8" strokeLinecap="round" 
                strokeDasharray={circumference} strokeDashoffset={offset} filter={`url(#neonGlow-${city})`}
                style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)" }} />
        </svg>
        <div style={{ position: 'absolute', bottom: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '4.5rem', fontWeight: '900', lineHeight: '1', color: '#ffffff' }}>{aqi}</div>
          <div style={{ fontSize: '1.2rem', fontWeight: '800', color: config.color, textShadow: `0 0 15px ${config.glow}`, letterSpacing: '2px', marginTop: '10px' }}>{config.label}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 20px' }}>
        
        {/* Navigation Tabs */}
        <div className="fade-up" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '60px' }}>
          <button onClick={() => setActiveTab('dashboard')} className="action-btn" style={{ width: 'auto', background: activeTab === 'dashboard' ? '#00E5FF' : 'rgba(255,255,255,0.05)', color: activeTab === 'dashboard' ? '#000' : '#fff' }}>
            <Activity size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }}/> Dashboard
          </button>
          <button onClick={() => setActiveTab('compare')} className="action-btn" style={{ width: 'auto', background: activeTab === 'compare' ? '#00E5FF' : 'rgba(255,255,255,0.05)', color: activeTab === 'compare' ? '#000' : '#fff' }}>
            <Layers size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }}/> Compare Cities
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <>
            {/* Search Bar & Action Buttons */}
            <div className="bento-card fade-up delay-1" style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', marginBottom: '40px' }}>
              <div style={{ flex: 1 }}>
                <label className="neon-label">Target Location</label>
                <input className="input-field" type="text" placeholder="e.g. Tokyo, New York, London..." 
                       value={location} onChange={e => setLocation(e.target.value)} 
                       onKeyDown={e => e.key === 'Enter' && fetchAqi(e)} />
              </div>
              <button className="action-btn" style={{ width: 'auto', padding: '18px 24px', background: 'rgba(255,255,255,0.1)', color: '#fff' }} onClick={fetchGeoAqi} title="Auto-Detect My Location">
                <Crosshair size={20} />
              </button>
              <button className="action-btn" style={{ width: 'auto', padding: '18px 50px' }} onClick={fetchAqi}>
                {loading ? "Scanning..." : "Analyze"}
              </button>
              {aqiData && !loading && (
                <button className="action-btn" style={{ width: 'auto', padding: '18px 24px', marginLeft: '10px', background: '#00E5FF', color: '#000' }} onClick={handleExportPDF} title="Download Dashboard as PDF">
                  <DownloadCloud size={20} />
                </button>
              )}
            </div>

            {aqiData && !loading && (
              <div ref={dashboardRef} style={{ padding: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                  
                  {/* 1. Gauge Bento */}
                  <div className="bento-card fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="neon-label" style={{ alignSelf: 'flex-start', marginBottom: '20px' }}>Live Telemetry</div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 30px 0', textAlign: 'center' }}>{aqiData.city}</h2>
                    {renderGauge(aqiData.city, aqiData.aqi, getAqiConfig(aqiData.aqi))}
                  </div>

                  {/* 2. Map Bento */}
                  <div className="bento-card fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
                    <div className="neon-label" style={{ marginBottom: '10px' }}><MapIcon size={16} style={{display:'inline', marginRight:'5px'}}/> Spatial Mapping</div>
                    <div style={{ flex: 1, borderRadius: '16px', overflow: 'hidden', zIndex: 0 }}>
                      {aqiData.geo && (
                        <MapContainer center={aqiData.geo} zoom={11} style={{ height: "100%", width: "100%" }}>
                          <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; CARTO'
                          />
                          <MapUpdater geo={aqiData.geo} />
                          <Marker position={aqiData.geo}>
                            <Popup>
                              <strong style={{color: '#000'}}>{aqiData.city}</strong><br />
                              <span style={{color: '#000'}}>AQI: {aqiData.aqi}</span>
                            </Popup>
                          </Marker>
                        </MapContainer>
                      )}
                    </div>
                  </div>

                  {/* 3. AI Advice & Chat Bento */}
                  <div className="bento-card fade-up delay-2" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="neon-label" style={{ marginBottom: '20px' }}><MessageSquare size={16} style={{display:'inline', marginRight:'5px'}}/> Agentic Assistant</div>
                    <div style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#a1a1aa', fontWeight: '400', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      {advice}
                    </div>
                    
                    {/* Chat interface */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto', marginBottom: '15px' }}>
                      {chatLog.map((msg, i) => (
                        <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', background: msg.role === 'user' ? 'rgba(0,229,255,0.1)' : 'rgba(255,255,255,0.05)', padding: '10px 15px', borderRadius: '12px', color: msg.role === 'user' ? '#00E5FF' : '#fff', maxWidth: '80%', fontSize: '0.95rem' }}>
                          {msg.content}
                        </div>
                      ))}
                      {chatLoading && <div style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Agent is Orchestrating...</div>}
                    </div>

                    <form onSubmit={handleChat} style={{ display: 'flex', gap: '10px' }}>
                      <button type="button" onClick={startListening} className="action-btn" style={{ width: '50px', height: '50px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isListening ? '#EF4444' : 'rgba(255,255,255,0.05)', color: isListening ? '#fff' : '#a1a1aa' }}>
                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                      </button>
                      <input className="input-field" style={{ marginTop: '0', padding: '12px' }} type="text" placeholder="Type or Speak a prompt..." value={chatInput} onChange={e => setChatInput(e.target.value)} />
                      <button type="submit" className="action-btn" style={{ width: '50px', height: '50px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Send size={18} />
                      </button>
                    </form>
                  </div>

                  {/* 4. Forecast Chart Bento */}
                  <div className="bento-card fade-up delay-3" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="neon-label" style={{ marginBottom: '20px' }}>7-Day Trajectory (PM2.5)</div>
                    {aqiData.forecast && aqiData.forecast.length > 0 ? (
                      <div style={{ flex: 1, minHeight: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={aqiData.forecast}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="day" stroke="#a1a1aa" fontSize={12} />
                            <YAxis stroke="#a1a1aa" fontSize={12} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }} />
                            <Line type="monotone" dataKey="avg" stroke={aqiData.color} strokeWidth={3} dot={{ fill: '#000', stroke: aqiData.color, strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: aqiData.color }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div style={{ color: '#a1a1aa', textAlign: 'center', marginTop: '50px' }}>No forecast data available for this city.</div>
                    )}
                  </div>

                </div>
              </div>
            )}
          </>
        )}

        {/* COMPARISON TAB */}
        {activeTab === 'compare' && (
          <div className="fade-up">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
              <div className="bento-card" style={{ padding: '24px' }}>
                <label className="neon-label">City 1</label>
                <input className="input-field" type="text" placeholder="e.g. New York" value={compareLoc1} onChange={e => setCompareLoc1(e.target.value)} />
              </div>
              <div className="bento-card" style={{ padding: '24px' }}>
                <label className="neon-label">City 2</label>
                <input className="input-field" type="text" placeholder="e.g. London" value={compareLoc2} onChange={e => setCompareLoc2(e.target.value)} />
              </div>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <button className="action-btn" style={{ width: '300px' }} onClick={fetchCompare}>
                {compareLoading ? "Computing Differences..." : "Launch Comparison"}
              </button>
            </div>

            {compareData1 && compareData2 && !compareLoading && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div className="bento-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '2rem', margin: '0 0 20px 0' }}>{compareData1.city || "Error"}</h2>
                  {compareData1.aqi !== undefined && renderGauge("c1", compareData1.aqi, getAqiConfig(compareData1.aqi))}
                  <div style={{ marginTop: '30px', color: '#a1a1aa', lineHeight: '1.6' }}>{compareData1.advice}</div>
                </div>
                
                <div className="bento-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '2rem', margin: '0 0 20px 0' }}>{compareData2.city || "Error"}</h2>
                  {compareData2.aqi !== undefined && renderGauge("c2", compareData2.aqi, getAqiConfig(compareData2.aqi))}
                  <div style={{ marginTop: '30px', color: '#a1a1aa', lineHeight: '1.6' }}>{compareData2.advice}</div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </>
  );
}

export default App;
