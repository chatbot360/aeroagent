import { useState, useEffect } from "react";

const PHASES = [
  {
    id: "p0",
    label: "Phase 0",
    title: "Stop the bleeding",
    period: "Now → May 20, 2026",
    color: "#7F77DD",
    lightColor: "#EEEDFE",
    textColor: "#3C3489",
    milestones: [
      { id: "p0_1", text: "GitHub account set up with profile README" },
      { id: "p0_2", text: "VSCode + Python + Jupyter installed, Hello World committed" },
      { id: "p0_3", text: "Striver's A2Z: Arrays (easy) started" },
      { id: "p0_4", text: "CampusX Python basics completed (Week 1–2)" },
      { id: "p0_5", text: "NumPy + Pandas completed" },
      { id: "p0_6", text: "Matplotlib / Seaborn completed" },
      { id: "p0_7", text: "First EDA notebook pushed to GitHub (Titanic/any dataset)" },
      { id: "p0_8", text: "Kaggle profile created, 2 micro-courses done" },
      { id: "p0_9", text: "40–50 DSA problems solved" },
      { id: "p0_10", text: "Notion/Obsidian tracker set up with daily log system" },
    ],
  },
  {
    id: "p1",
    label: "Phase 1",
    title: "Summer grind",
    period: "May 20 → Aug 1, 2026",
    color: "#1D9E75",
    lightColor: "#E1F5EE",
    textColor: "#085041",
    milestones: [
      { id: "p1_1", text: "Supervised ML completed (Regression, Classification, SVM, RF, KNN)" },
      { id: "p1_2", text: "Unsupervised ML completed (K-Means, PCA, Clustering)" },
      { id: "p1_3", text: "Model Evaluation & Pipelines in sklearn completed" },
      { id: "p1_4", text: "Andrew Ng ML Specialization (audit) — in progress" },
      { id: "p1_5", text: "Project 1: House Price Prediction pushed to GitHub" },
      { id: "p1_6", text: "Project 2: Disease Prediction (biotech angle) pushed to GitHub" },
      { id: "p1_7", text: "Kaggle competition participated (Titanic or House Prices)" },
      { id: "p1_8", text: "3Blue1Brown Neural Networks series watched" },
      { id: "p1_9", text: "Deep Learning intro (ANN with Keras) completed" },
      { id: "p1_10", text: "Project 3: Diabetes Prediction (DL) pushed to GitHub" },
      { id: "p1_11", text: "n8n installed and first automation workflow built" },
      { id: "p1_12", text: "LangChain basics learned (RAG chatbot built)" },
      { id: "p1_13", text: "Claude / OpenAI API basics explored" },
      { id: "p1_14", text: "Portfolio website live on GitHub Pages" },
      { id: "p1_15", text: "Fiverr / Upwork profile created with first gig listed" },
      { id: "p1_16", text: "Striver A2Z: Sorting, Binary Search, Linked Lists done" },
      { id: "p1_17", text: "150+ DSA problems solved" },
      { id: "p1_18", text: "Leetcode Weekly Contest — started (every Sunday)" },
    ],
  },
  {
    id: "p2",
    label: "Phase 2",
    title: "Build & earn",
    period: "Aug 2026 → Dec 2026",
    color: "#BA7517",
    lightColor: "#FAEEDA",
    textColor: "#633806",
    milestones: [
      { id: "p2_1", text: "Moved to flat near DTU (commute eliminated)" },
      { id: "p2_2", text: "Advanced ML track chosen (NLP or CV) and started" },
      { id: "p2_3", text: "Hugging Face NLP course OR Fast.ai CV course completed" },
      { id: "p2_4", text: "Biotech + AI signature project built and deployed" },
      { id: "p2_5", text: "HTML + CSS + JavaScript fundamentals completed (3 weeks)" },
      { id: "p2_6", text: "React basics completed, ML model deployed with React UI on Vercel" },
      { id: "p2_7", text: "First freelance income received ($50–100)" },
      { id: "p2_8", text: "Freelance income: $200–500/month by December" },
      { id: "p2_9", text: "LinkedIn: weekly project posts started" },
      { id: "p2_10", text: "Hackathon 1 participated (Devfolio / SIH / MLH)" },
      { id: "p2_11", text: "Hackathon 2 participated" },
      { id: "p2_12", text: "GSoC target orgs identified (OBF, NumFOCUS, Biopython, INCF)" },
      { id: "p2_13", text: "First open source contribution (PR/issue) submitted" },
      { id: "p2_14", text: "3–5 merged contributions to target GSoC org" },
      { id: "p2_15", text: "Active on org's Discord / mailing list" },
      { id: "p2_16", text: "Striver A2Z: Trees, Heaps, Graphs completed" },
      { id: "p2_17", text: "Striver DP playlist started" },
      { id: "p2_18", text: "300+ DSA problems solved" },
      { id: "p2_19", text: "Codeforces Div. 3 rounds started (monthly)" },
    ],
  },
  {
    id: "p3",
    label: "Phase 3",
    title: "GSoC + scale",
    period: "Jan 2027 → May 2027",
    color: "#D85A30",
    lightColor: "#FAECE7",
    textColor: "#4A1B0C",
    milestones: [
      { id: "p3_1", text: "GSoC 2027 orgs announced — target orgs confirmed" },
      { id: "p3_2", text: "GSoC proposal drafted and reviewed by org mentor" },
      { id: "p3_3", text: "GSoC 2027 contributor application submitted (March–April 2027)" },
      { id: "p3_4", text: "Striver DP playlist fully completed (all 56 videos)" },
      { id: "p3_5", text: "Tries, Segment Trees, KMP/Z-algorithm covered" },
      { id: "p3_6", text: "Mock interviews started (Pramp / peer partner — weekly)" },
      { id: "p3_7", text: "400–450 DSA problems solved" },
      { id: "p3_8", text: "Full MERN stack completed (Node, Express, MongoDB, Auth)" },
      { id: "p3_9", text: "Full-stack AI project deployed (biomarker risk tool or similar)" },
      { id: "p3_10", text: "System Design basics covered (Grokking / Alex Xu)" },
      { id: "p3_11", text: "Freelance income $500–1000/month" },
      { id: "p3_12", text: "Article published on Medium / Towards Data Science" },
      { id: "p3_13", text: "Summer internship / research internship applications sent" },
    ],
  },
  {
    id: "p4",
    label: "Phase 4",
    title: "GSoC + placements",
    period: "Aug 2027 onwards",
    color: "#378ADD",
    lightColor: "#E6F1FB",
    textColor: "#042C53",
    milestones: [
      { id: "p4_1", text: "GSoC 2027 result received" },
      { id: "p4_2", text: "GSoC coding period completed (if selected)" },
      { id: "p4_3", text: "Off-campus internship applications sent (AngelList / Wellfound / LinkedIn)" },
      { id: "p4_4", text: "Research internship at IIT/IISc applied" },
      { id: "p4_5", text: "Resume finalised: GitHub + Projects + Freelance + GSoC + Hackathons" },
      { id: "p4_6", text: "Company-specific placement prep started" },
      { id: "p4_7", text: "HR round prep completed" },
      { id: "p4_8", text: "Campus placement season — registered and appearing" },
    ],
  },
];

const HABITS = [
  { id: "h_dsa", label: "DSA (1–2 problems)", color: "#7F77DD" },
  { id: "h_ml", label: "AI/ML study block", color: "#1D9E75" },
  { id: "h_project", label: "Project / coding work", color: "#BA7517" },
  { id: "h_github", label: "GitHub commit pushed", color: "#D85A30" },
  { id: "h_tools", label: "AI tools / freelance", color: "#378ADD" },
];

const KEY_MILESTONES = [
  { date: "Apr 20, 2026", text: "GitHub live + first EDA pushed" },
  { date: "May 20, 2026", text: "50 DSA problems + Phase 0 complete" },
  { date: "Aug 1, 2026", text: "5 projects + RAG chatbot + Fiverr live + 150 DSA" },
  { date: "Oct 2026", text: "First freelance income ($50–100)" },
  { date: "Nov 2026", text: "First GSoC PR merged" },
  { date: "Dec 2026", text: "300 DSA + $300–500/month + 5 GSoC contributions" },
  { date: "Apr 2027", text: "GSoC 2027 application submitted" },
  { date: "May 2027", text: "400+ DSA + Full MERN project deployed" },
];

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function Tracker() {
  const [checks, setChecks] = useState({});
  const [habits, setHabits] = useState({});
  const [activeTab, setActiveTab] = useState("milestones");
  const [expandedPhase, setExpandedPhase] = useState("p0");
  const [dsaCount, setDsaCount] = useState(0);
  const [dsaInput, setDsaInput] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [streaks, setStreaks] = useState({});
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const r1 = await window.storage.get("tracker_checks");
        if (r1) setChecks(JSON.parse(r1.value));
      } catch {}
      try {
        const r2 = await window.storage.get("tracker_habits");
        if (r2) setHabits(JSON.parse(r2.value));
      } catch {}
      try {
        const r3 = await window.storage.get("tracker_dsa");
        if (r3) setDsaCount(parseInt(r3.value) || 0);
      } catch {}
      try {
        const r4 = await window.storage.get("tracker_streaks");
        if (r4) setStreaks(JSON.parse(r4.value));
      } catch {}
      try {
        const r5 = await window.storage.get("tracker_note");
        if (r5) setSavedNote(r5.value);
      } catch {}
      setLoaded(true);
    }
    load();
  }, []);

  async function toggleCheck(id) {
    const next = { ...checks, [id]: !checks[id] };
    setChecks(next);
    try { await window.storage.set("tracker_checks", JSON.stringify(next)); } catch {}
  }

  async function toggleHabit(hid) {
    const today = getTodayKey();
    const key = `${today}_${hid}`;
    const next = { ...habits, [key]: !habits[key] };
    setHabits(next);
    try { await window.storage.set("tracker_habits", JSON.stringify(next)); } catch {}
  }

  async function saveDsa() {
    const val = parseInt(dsaInput);
    if (!isNaN(val) && val >= 0) {
      setDsaCount(val);
      setDsaInput("");
      try { await window.storage.set("tracker_dsa", String(val)); } catch {}
    }
  }

  async function saveNote() {
    setSavedNote(note);
    try { await window.storage.set("tracker_note", note); } catch {}
    setNote("");
  }

  function getPhaseProgress(phase) {
    const total = phase.milestones.length;
    const done = phase.milestones.filter(m => checks[m.id]).length;
    return { done, total, pct: Math.round((done / total) * 100) };
  }

  function getTotalProgress() {
    const all = PHASES.flatMap(p => p.milestones);
    const done = all.filter(m => checks[m.id]).length;
    return { done, total: all.length, pct: Math.round((done / all.length) * 100) };
  }

  function getTodayHabits() {
    const today = getTodayKey();
    return HABITS.filter(h => habits[`${today}_${h.id}`]).length;
  }

  const total = getTotalProgress();
  const todayDone = getTodayHabits();

  const dsaTarget = dsaCount < 50 ? 50 : dsaCount < 150 ? 150 : dsaCount < 300 ? 300 : dsaCount < 450 ? 450 : 500;
  const dsaLabel = dsaCount < 50 ? "Phase 0 target" : dsaCount < 150 ? "Phase 1 target" : dsaCount < 300 ? "Phase 2 target" : dsaCount < 450 ? "Phase 3 target" : "FAANG ready";

  if (!loaded) return <div style={{ padding: "2rem", color: "var(--color-text-secondary)", fontSize: 14 }}>Loading your tracker...</div>;

  return (
    <div style={{ 
      "--color-background-primary": "#0B1121",
      "--color-background-secondary": "#1E2A3B",
      "--color-text-primary": "#F1F5F9",
      "--color-text-secondary": "#94A3B8",
      "--color-border-secondary": "#334155",
      "--color-border-tertiary": "#1E2A3B",
      fontFamily: "var(--font-sans, -apple-system, sans-serif)", 
      color: "var(--color-text-primary)", 
      backgroundColor: "var(--color-background-primary)",
      minHeight: "100vh",
      padding: "0 0 2rem" 
    }}>

      <div style={{ padding: "1.5rem 1rem 0" }}>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 1rem" }}>DTU Biotech → Tech Placement Roadmap</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10, marginBottom: "1.25rem" }}>
          {[
            { label: "Overall done", value: `${total.done}/${total.total}`, sub: `${total.pct}% complete` },
            { label: "DSA solved", value: dsaCount, sub: dsaLabel },
            { label: "Today's habits", value: `${todayDone}/${HABITS.length}`, sub: todayDone === HABITS.length ? "Full streak!" : "Keep going" },
            { label: "Phases", value: `${PHASES.filter(p => getPhaseProgress(p).pct === 100).length}/${PHASES.length}`, sub: "completed" },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 500 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, height: 8, overflow: "hidden", marginBottom: "1.5rem" }}>
          <div style={{ height: "100%", width: `${total.pct}%`, background: "#7F77DD", borderRadius: 8, transition: "width 0.4s ease" }} />
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 0 }}>
          {["milestones", "habits", "dsa", "timeline"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: activeTab === tab ? 500 : 400,
              border: activeTab === tab ? "1.5px solid #7F77DD" : "0.5px solid var(--color-border-tertiary)",
              background: activeTab === tab ? "#EEEDFE" : "transparent",
              color: activeTab === tab ? "#3C3489" : "var(--color-text-secondary)",
              cursor: "pointer"
            }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", marginTop: "1rem" }} />

      {activeTab === "milestones" && (
        <div style={{ padding: "1rem" }}>
          {PHASES.map(phase => {
            const prog = getPhaseProgress(phase);
            const open = expandedPhase === phase.id;
            return (
              <div key={phase.id} style={{ border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
                <div onClick={() => setExpandedPhase(open ? null : phase.id)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer", background: open ? "var(--color-background-secondary)" : "transparent" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: phase.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: phase.color }}>{phase.label}</span>
                      <span style={{ fontSize: 13, color: "var(--color-text-primary)" }}>{phase.title}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>{phase.period}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{prog.done}/{prog.total}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{prog.pct}%</div>
                  </div>
                  <div style={{ fontSize: 16, color: "var(--color-text-secondary)", marginLeft: 4 }}>{open ? "▲" : "▼"}</div>
                </div>
                <div style={{ padding: "0 16px", background: "var(--color-background-secondary)", height: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${prog.pct}%`, background: phase.color, transition: "width 0.4s" }} />
                </div>
                {open && (
                  <div style={{ padding: "12px 16px 16px" }}>
                    {phase.milestones.map(m => (
                      <div key={m.id} onClick={() => toggleCheck(m.id)}
                        style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: "0.5px solid var(--color-border-tertiary)", cursor: "pointer" }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: 5, border: checks[m.id] ? "none" : `1.5px solid ${phase.color}`,
                          background: checks[m.id] ? phase.color : "transparent",
                          flexShrink: 0, marginTop: 1,
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          {checks[m.id] && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <span style={{ fontSize: 13, color: checks[m.id] ? "var(--color-text-secondary)" : "var(--color-text-primary)", textDecoration: checks[m.id] ? "line-through" : "none", lineHeight: 1.5 }}>{m.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "habits" && (
        <div style={{ padding: "1rem" }}>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
            Mark habits done for today — {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </div>
          {HABITS.map(h => {
            const today = getTodayKey();
            const done = habits[`${today}_${h.id}`];
            return (
              <div key={h.id} onClick={() => toggleHabit(h.id)}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 10, marginBottom: 8, cursor: "pointer", background: done ? "var(--color-background-secondary)" : "transparent" }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, border: done ? "none" : `1.5px solid ${h.color}`, background: done ? h.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {done && <svg width="12" height="10" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{ fontSize: 14, fontWeight: done ? 500 : 400, color: done ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>{h.label}</span>
                {done && <span style={{ marginLeft: "auto", fontSize: 12, color: h.color, fontWeight: 500 }}>Done</span>}
              </div>
            );
          })}

          <div style={{ marginTop: "1.5rem", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 10, padding: "16px" }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Today's progress</div>
            <div style={{ display: "flex", gap: 6 }}>
              {HABITS.map((h, i) => {
                const done = habits[`${getTodayKey()}_${h.id}`];
                return <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: done ? h.color : "var(--color-background-secondary)" }} />;
              })}
            </div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 8 }}>{todayDone} of {HABITS.length} habits completed today</div>
          </div>

          <div style={{ marginTop: "1rem", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 10, padding: "16px" }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Daily note</div>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Log today's wins, blockers, learnings..."
              style={{ width: "100%", minHeight: 80, fontSize: 13, borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", padding: "10px 12px", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", resize: "vertical", boxSizing: "border-box" }} />
            <button onClick={saveNote} style={{ marginTop: 8, padding: "7px 18px", borderRadius: 7, fontSize: 13, border: "0.5px solid var(--color-border-secondary)", background: "transparent", color: "var(--color-text-primary)", cursor: "pointer" }}>Save note</button>
            {savedNote && <div style={{ marginTop: 10, fontSize: 12, color: "var(--color-text-secondary)", background: "var(--color-background-secondary)", borderRadius: 7, padding: "8px 12px" }}>Last saved: {savedNote}</div>}
          </div>
        </div>
      )}

      {activeTab === "dsa" && (
        <div style={{ padding: "1rem" }}>
          <div style={{ border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "20px 20px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 6 }}>Problems solved on Leetcode / GFG</div>
            <div style={{ fontSize: 40, fontWeight: 500, color: "#7F77DD" }}>{dsaCount}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>Next target: {dsaTarget} ({dsaLabel})</div>
            <div style={{ marginTop: 12, background: "var(--color-background-secondary)", borderRadius: 6, height: 8, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(100, Math.round((dsaCount / dsaTarget) * 100))}%`, background: "#7F77DD", borderRadius: 6, transition: "width 0.4s" }} />
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <input type="number" value={dsaInput} onChange={e => setDsaInput(e.target.value)} placeholder="Update count"
                style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", fontSize: 13 }} />
              <button onClick={saveDsa} style={{ padding: "8px 18px", borderRadius: 8, fontSize: 13, border: "0.5px solid #7F77DD", background: "#EEEDFE", color: "#3C3489", cursor: "pointer", fontWeight: 500 }}>Update</button>
            </div>
          </div>

          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", fontSize: 11 }}>Target checkpoints</div>
          {[
            { target: 50, label: "Phase 0 complete", phase: "p0" },
            { target: 150, label: "Phase 1 complete (Summer)", phase: "p1" },
            { target: 300, label: "Phase 2 complete (3rd sem)", phase: "p2" },
            { target: 450, label: "Phase 3 complete — FAANG ready", phase: "p3" },
          ].map((row, i) => {
            const done = dsaCount >= row.target;
            const phaseColor = PHASES.find(p => p.id === row.phase)?.color || "#7F77DD";
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: done ? phaseColor : "var(--color-background-secondary)", border: done ? "none" : `1.5px solid ${phaseColor}`, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: done ? "var(--color-text-secondary)" : "var(--color-text-primary)", textDecoration: done ? "line-through" : "none" }}>{row.label}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: phaseColor }}>{row.target}</div>
              </div>
            );
          })}

          <div style={{ marginTop: "1.5rem", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 10, padding: "16px" }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Striver A2Z — topic tracker</div>
            {[
              { id: "dsa_t1", label: "Basics of C++ + Complexity" },
              { id: "dsa_t2", label: "Arrays — Easy + Medium" },
              { id: "dsa_t3", label: "Strings" },
              { id: "dsa_t4", label: "Basic Math for DSA" },
              { id: "dsa_t5", label: "Sorting algorithms (all 5)" },
              { id: "dsa_t6", label: "Binary Search (complete step)" },
              { id: "dsa_t7", label: "Linked Lists (complete step)" },
              { id: "dsa_t8", label: "Recursion + Backtracking basics" },
              { id: "dsa_t9", label: "Binary Trees + BST" },
              { id: "dsa_t10", label: "Heaps + Priority Queues" },
              { id: "dsa_t11", label: "Graphs (BFS, DFS, Dijkstra, Topo Sort)" },
              { id: "dsa_t12", label: "Dynamic Programming (Striver DP — all 56)" },
              { id: "dsa_t13", label: "Tries + Segment Trees" },
              { id: "dsa_t14", label: "String algorithms (KMP, Z-algo)" },
            ].map(t => (
              <div key={t.id} onClick={() => toggleCheck(t.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "0.5px solid var(--color-border-tertiary)", cursor: "pointer" }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, border: checks[t.id] ? "none" : "1.5px solid #7F77DD", background: checks[t.id] ? "#7F77DD" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {checks[t.id] && <svg width="9" height="7" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{ fontSize: 13, color: checks[t.id] ? "var(--color-text-secondary)" : "var(--color-text-primary)", textDecoration: checks[t.id] ? "line-through" : "none" }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "timeline" && (
        <div style={{ padding: "1rem" }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 14 }}>Key milestone dates</div>
          {KEY_MILESTONES.map((km, i) => {
            const kmId = `km_${i}`;
            const done = checks[kmId];
            return (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20, flexShrink: 0 }}>
                  <div onClick={() => toggleCheck(kmId)} style={{ width: 18, height: 18, borderRadius: "50%", background: done ? "#7F77DD" : "var(--color-background-secondary)", border: done ? "none" : "1.5px solid #7F77DD", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                    {done && <svg width="9" height="7" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  {i < KEY_MILESTONES.length - 1 && <div style={{ width: 1.5, flex: 1, minHeight: 32, background: "var(--color-border-tertiary)" }} />}
                </div>
                <div style={{ paddingBottom: 24, paddingTop: 0 }}>
                  <div style={{ fontSize: 11, color: "#7F77DD", fontWeight: 500, marginBottom: 2 }}>{km.date}</div>
                  <div style={{ fontSize: 13, color: done ? "var(--color-text-secondary)" : "var(--color-text-primary)", textDecoration: done ? "line-through" : "none" }}>{km.text}</div>
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: "0.5rem", borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: "1.25rem" }}>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 14 }}>Phase overview</div>
            {PHASES.map(p => {
              const prog = getPhaseProgress(p);
              return (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 500 }}>{p.label} — {p.title}</span>
                      <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{prog.done}/{prog.total}</span>
                    </div>
                    <div style={{ background: "var(--color-background-secondary)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${prog.pct}%`, background: p.color, borderRadius: 4, transition: "width 0.4s" }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
