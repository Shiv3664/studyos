import { useState, useEffect, useMemo } from "react";

// ─── THEME ───────────────────────────────────────────────────────
const T = {
  bg:      "#f1f5f9",
  panel:   "#ffffff",
  border:  "#e2e8f0",
  track:   "#e2e8f0",
  inputBg: "#f8fafc",
  text:    "#1e293b",
  sub:     "#475569",
  muted:   "#94a3b8",
  faint:   "#cbd5e1",
  green:   "#059669",
  blue:    "#3b82f6",
  purple:  "#7c3aed",
  amber:   "#d97706",
  red:     "#ef4444",
  teal:    "#0d9488",
};

// ─── DATE HELPERS ────────────────────────────────────────────────
const START_DATE = new Date("2026-04-14");
const TODAY      = new Date(); // ← always today's real date

const dayToCalDate = (dayNum) => {
  const d = new Date(START_DATE);
  d.setDate(START_DATE.getDate() + dayNum - 1);
  return d;
};

const fmtDate = (d) => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d.getDate()} ${months[d.getMonth()]}`;
};

const todayDayNum = () => {
  const diff = Math.floor((TODAY - START_DATE) / (1000*60*60*24));
  return Math.max(1, Math.min(35, diff + 1));
};

// ─── LOCALSTORAGE HELPERS (replaces window.storage) ─────────────
const lsGet = (key) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
  catch(e) { return null; }
};
const lsSet = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
};

// ─── COURSE 1 DATA ───────────────────────────────────────────────
// sn = actual Udemy section number(s). Some entries combine 2 sections shown as "X-Y"
const C1 = [
  {id:"c1_01",sn:"1",    n:"Getting Started / Setup",              m:27, cat:"Setup",             d:"must_do"},
  {id:"c1_02",sn:"2-3",  n:"Python Fundamentals + Control Flow",   m:133,cat:"Python",            d:"must_do"},
  {id:"c1_03",sn:"4",    n:"Data Structures",                      m:129,cat:"Python",            d:"must_do"},
  {id:"c1_04",sn:"5",    n:"Functions",                            m:82, cat:"Python",            d:"must_do"},
  {id:"c1_05",sn:"6-7",  n:"Practice Questions (Functions + DS)",  m:0,  cat:"Practice",          d:"must_do"},
  {id:"c1_06",sn:"8",    n:"Modules & Packages",                   m:35, cat:"Python",            d:"must_do"},
  {id:"c1_07",sn:"9",    n:"File Handling",                        m:26, cat:"Python",            d:"must_do"},
  {id:"c1_08",sn:"10",   n:"Exception Handling",                   m:25, cat:"Python",            d:"must_do"},
  {id:"c1_09",sn:"11",   n:"OOP — Classes & Objects",              m:116,cat:"Python",            d:"must_do"},
  {id:"c1_10",sn:"12",   n:"Advanced Python",                      m:39, cat:"Python",            d:"must_do"},
  {id:"c1_11",sn:"13",   n:"Data Analysis (NumPy / Pandas / Viz)", m:147,cat:"Data Analysis",     d:"must_do"},
  {id:"c1_12",sn:"14",   n:"SQLite3",                              m:17, cat:"Database",          d:"optional"},
  {id:"c1_13",sn:"15",   n:"Logging in Python",                    m:27, cat:"Python Advanced",   d:"optional"},
  {id:"c1_14",sn:"16",   n:"Multi-Threading & Processing",         m:56, cat:"Python Advanced",   d:"optional"},
  {id:"c1_15",sn:"17",   n:"Memory Management",                    m:21, cat:"Python Advanced",   d:"optional"},
  {id:"c1_16",sn:"18",   n:"Flask Framework",                      m:106,cat:"Web",               d:"optional"},
  {id:"c1_17",sn:"19",   n:"Streamlit",                            m:26, cat:"Web",               d:"must_do"},
  {id:"c1_18",sn:"20",   n:"Statistics Fundamentals",              m:144,cat:"Statistics",         d:"must_do"},
  {id:"c1_19",sn:"21",   n:"Probability",                          m:22, cat:"Statistics",         d:"must_do"},
  {id:"c1_20",sn:"22",   n:"Probability Distributions",            m:180,cat:"Statistics",         d:"must_do"},
  {id:"c1_21",sn:"23",   n:"Inferential Statistics",               m:151,cat:"Statistics",         d:"must_do"},
  {id:"c1_22",sn:"24",   n:"Feature Engineering",                  m:84, cat:"EDA / FE",           d:"must_do"},
  {id:"c1_23",sn:"25",   n:"EDA + Feature Engineering",            m:99, cat:"EDA / FE",           d:"must_do"},
  {id:"c1_24",sn:"26",   n:"ML Introduction",                      m:61, cat:"ML Foundations",     d:"must_do"},
  {id:"c1_25",sn:"27",   n:"Linear Regression (In-depth)",         m:255,cat:"Supervised ML",      d:"must_do"},
  {id:"c1_26",sn:"28",   n:"Ridge / Lasso / ElasticNet",           m:130,cat:"Supervised ML",      d:"must_do"},
  {id:"c1_27",sn:"29",   n:"ML Lifecycle Project",                 m:164,cat:"ML Projects",        d:"must_do"},
  {id:"c1_28",sn:"30",   n:"Logistic Regression",                  m:127,cat:"Supervised ML",      d:"must_do"},
  {id:"c1_29",sn:"31",   n:"Support Vector Machines",              m:104,cat:"Supervised ML",      d:"must_do"},
  {id:"c1_30",sn:"32",   n:"Naive Bayes",                          m:56, cat:"Supervised ML",      d:"must_do"},
  {id:"c1_31",sn:"33",   n:"KNN",                                  m:37, cat:"Supervised ML",      d:"must_do"},
  {id:"c1_32",sn:"34",   n:"Decision Tree",                        m:107,cat:"Supervised ML",      d:"must_do"},
  {id:"c1_33",sn:"35",   n:"Random Forest",                        m:85, cat:"Supervised ML",      d:"must_do"},
  {id:"c1_34",sn:"36",   n:"AdaBoost",                             m:70, cat:"Supervised ML",      d:"must_do"},
  {id:"c1_35",sn:"37",   n:"Gradient Boosting",                    m:34, cat:"Supervised ML",      d:"must_do"},
  {id:"c1_36",sn:"38",   n:"XGBoost",                              m:64, cat:"Supervised ML",      d:"must_do"},
  {id:"c1_37",sn:"39",   n:"Unsupervised ML Intro",                m:8,  cat:"Unsupervised ML",    d:"must_do"},
  {id:"c1_38",sn:"40",   n:"PCA",                                  m:89, cat:"Unsupervised ML",    d:"must_do"},
  {id:"c1_39",sn:"41",   n:"KMeans Clustering",                    m:49, cat:"Unsupervised ML",    d:"must_do"},
  {id:"c1_40",sn:"42",   n:"Hierarchical Clustering",              m:33, cat:"Unsupervised ML",    d:"must_do"},
  {id:"c1_41",sn:"43",   n:"DBSCAN",                               m:25, cat:"Unsupervised ML",    d:"must_do"},
  {id:"c1_42",sn:"44",   n:"Silhouette / Cluster Eval",            m:9,  cat:"Unsupervised ML",    d:"must_do"},
  {id:"c1_43",sn:"45",   n:"Anomaly Detection",                    m:38, cat:"Unsupervised ML",    d:"must_do"},
  {id:"c1_44",sn:"46",   n:"Docker",                               m:99, cat:"MLOps",              d:"must_do"},
  {id:"c1_45",sn:"47",   n:"Git",                                  m:51, cat:"MLOps",              d:"must_do"},
  {id:"c1_46",sn:"48",   n:"ML Deployment Project (AWS/Azure)",    m:315,cat:"MLOps",              d:"must_do"},
  {id:"c1_47",sn:"49",   n:"Advanced MLOps + ETL Pipeline",        m:461,cat:"MLOps",              d:"optional"},
  {id:"c1_48",sn:"50",   n:"MLFlow, Dagshub & BentoML",            m:94, cat:"MLOps",              d:"must_do"},
  {id:"c1_49",sn:"51",   n:"Classical NLP",                        m:385,cat:"NLP",               d:"must_do"},
  {id:"c1_50",sn:"52",   n:"Deep Learning Theory",                 m:404,cat:"Deep Learning",      d:"must_do"},
  {id:"c1_51",sn:"53",   n:"ANN End-to-End Project",               m:137,cat:"Deep Learning",      d:"must_do"},
  {id:"c1_52",sn:"54",   n:"NLP + Deep Learning Intro",            m:18, cat:"NLP Deep Learning",  d:"must_do"},
  {id:"c1_53",sn:"55",   n:"Simple RNN",                           m:103,cat:"NLP Deep Learning",  d:"must_do"},
  {id:"c1_54",sn:"56",   n:"RNN End-to-End Project",               m:79, cat:"NLP Deep Learning",  d:"must_do"},
  {id:"c1_55",sn:"57",   n:"LSTM & GRU (In-depth)",                m:126,cat:"NLP Deep Learning",  d:"must_do"},
  {id:"c1_56",sn:"58",   n:"LSTM / GRU Project",                   m:46, cat:"NLP Deep Learning",  d:"must_do"},
  {id:"c1_57",sn:"59",   n:"Bidirectional RNN",                    m:23, cat:"NLP Deep Learning",  d:"must_do"},
  {id:"c1_58",sn:"60",   n:"Encoder-Decoder / Seq2Seq",            m:41, cat:"NLP Deep Learning",  d:"must_do"},
  {id:"c1_59",sn:"61",   n:"Attention Mechanism",                  m:29, cat:"NLP Deep Learning",  d:"must_do"},
  {id:"c1_60",sn:"62",   n:"Transformers (In-depth)",              m:302,cat:"NLP Deep Learning",  d:"must_do"},
  {id:"c1_61",sn:"63",   n:"Role Play / Interview Mock",           m:0,  cat:"Extra",              d:"optional"},
];

// ─── COURSE 2 DATA ───────────────────────────────────────────────
const C2 = [
  {id:"c2_01",sn:1, n:"Introduction & Setup",                m:99, cat:"Setup",              d:"skip"},
  {id:"c2_02",sn:2, n:"Python Control Flow",                 m:49, cat:"Python Recap",       d:"skip"},
  {id:"c2_03",sn:3, n:"Data Structures",                     m:108,cat:"Python Recap",       d:"skip"},
  {id:"c2_04",sn:4, n:"Functions",                           m:82, cat:"Python Recap",       d:"skip"},
  {id:"c2_05",sn:5, n:"Modules & Packages",                  m:35, cat:"Python Recap",       d:"skip"},
  {id:"c2_06",sn:6, n:"File Handling",                       m:26, cat:"Python Recap",       d:"skip"},
  {id:"c2_07",sn:7, n:"Exception Handling",                  m:25, cat:"Python Recap",       d:"skip"},
  {id:"c2_08",sn:8, n:"OOP",                                 m:109,cat:"Python Recap",       d:"skip"},
  {id:"c2_09",sn:9, n:"Streamlit",                           m:26, cat:"Web",                d:"skip"},
  {id:"c2_10",sn:10,n:"ML for NLP (Prerequisites)",          m:294,cat:"ML/DL Prereq",       d:"skip"},
  {id:"c2_11",sn:11,n:"Deep Learning for NLP Prereq",        m:39, cat:"ML/DL Prereq",       d:"skip"},
  {id:"c2_12",sn:12,n:"Simple RNN Prereq",                   m:81, cat:"ML/DL Prereq",       d:"skip"},
  {id:"c2_13",sn:13,n:"ANN Project Prereq",                  m:137,cat:"ML/DL Prereq",       d:"skip"},
  {id:"c2_14",sn:14,n:"RNN Project Prereq",                  m:79, cat:"ML/DL Prereq",       d:"skip"},
  {id:"c2_15",sn:15,n:"LSTM RNN Prereq",                     m:126,cat:"ML/DL Prereq",       d:"skip"},
  {id:"c2_16",sn:16,n:"LSTM/GRU Project Prereq",             m:46, cat:"ML/DL Prereq",       d:"skip"},
  {id:"c2_17",sn:17,n:"Bidirectional RNN Prereq",            m:23, cat:"ML/DL Prereq",       d:"skip"},
  {id:"c2_18",sn:18,n:"Seq2Seq Prereq",                      m:41, cat:"ML/DL Prereq",       d:"skip"},
  {id:"c2_19",sn:19,n:"Attention Mechanism Prereq",          m:29, cat:"ML/DL Prereq",       d:"skip"},
  {id:"c2_20",sn:20,n:"Transformers Prereq",                 m:302,cat:"ML/DL Prereq",       d:"skip"},
  {id:"c2_21",sn:21,n:"GenAI & LLM Introduction",            m:43, cat:"GenAI Foundations",  d:"must_do"},
  {id:"c2_22",sn:22,n:"LangChain Introduction",              m:17, cat:"LangChain Core",     d:"must_do"},
  {id:"c2_23",sn:23,n:"LangChain Setup (OpenAI)",            m:12, cat:"LangChain Core",     d:"must_do"},
  {id:"c2_24",sn:24,n:"Core Components & Modules",           m:142,cat:"LangChain Core",     d:"must_do"},
  {id:"c2_25",sn:25,n:"OpenAI & Ollama Setup",               m:84, cat:"LangChain Core",     d:"must_do"},
  {id:"c2_26",sn:26,n:"LCEL Basics",                         m:49, cat:"LangChain Core",     d:"must_do"},
  {id:"c2_27",sn:27,n:"Chatbots with Message History",       m:76, cat:"Chatbots",           d:"must_do"},
  {id:"c2_28",sn:28,n:"Conversational Q&A Bot",              m:29, cat:"Chatbots",           d:"must_do"},
  {id:"c2_29",sn:29,n:"LangChain V1 Updates",                m:151,cat:"LangChain Core",     d:"must_do"},
  {id:"c2_30",sn:30,n:"End-to-End Q&A Chatbot App",          m:44, cat:"Chatbots",           d:"must_do"},
  {id:"c2_31",sn:31,n:"RAG with GROQ & LLama3",              m:31, cat:"RAG",               d:"must_do"},
  {id:"c2_32",sn:32,n:"Conversational PDF RAG",              m:36, cat:"RAG",               d:"must_do"},
  {id:"c2_33",sn:33,n:"Search Engine Agents",                m:60, cat:"Agents",             d:"must_do"},
  {id:"c2_34",sn:34,n:"SQL Agent Project",                   m:52, cat:"Agents",             d:"must_do"},
  {id:"c2_35",sn:35,n:"Text Summarization",                  m:55, cat:"GenAI Apps",         d:"must_do"},
  {id:"c2_36",sn:36,n:"URL / YouTube Summarization",         m:26, cat:"GenAI Apps",         d:"must_do"},
  {id:"c2_37",sn:37,n:"Text to Math Solver (Gemma 2)",       m:34, cat:"GenAI Apps",         d:"must_do"},
  {id:"c2_38",sn:38,n:"HuggingFace + LangChain",             m:31, cat:"HuggingFace",        d:"must_do"},
  {id:"c2_39",sn:39,n:"PDF Query RAG + AstraDB",             m:23, cat:"RAG",               d:"must_do"},
  {id:"c2_40",sn:40,n:"MultiLanguage Code Assistant",        m:21, cat:"GenAI Apps",         d:"must_do"},
  {id:"c2_41",sn:41,n:"Deployment (Streamlit + HF Spaces)",  m:28, cat:"Deployment",         d:"must_do"},
  {id:"c2_42",sn:42,n:"AWS GenAI (Bonus)",                   m:162,cat:"Deployment",         d:"optional"},
  {id:"c2_43",sn:43,n:"Nvidia NIM + LangChain",              m:26, cat:"Deployment",         d:"optional"},
  {id:"c2_44",sn:44,n:"Multi AI Agents (CrewAI)",            m:32, cat:"Agents",             d:"must_do"},
  {id:"c2_45",sn:45,n:"Hybrid Search RAG + Pinecone",        m:41, cat:"RAG",               d:"must_do"},
  {id:"c2_46",sn:46,n:"Graph DB + Cypher Query",             m:92, cat:"Graph",              d:"must_do"},
  {id:"c2_47",sn:47,n:"GraphDB + LangChain Practical",       m:50, cat:"Graph",              d:"must_do"},
  {id:"c2_48",sn:48,n:"Fine-Tuning Theory (LoRA / QLoRA)",   m:70, cat:"Fine Tuning",        d:"must_do"},
  {id:"c2_49",sn:49,n:"Fine-Tuning Project (Lamini)",        m:15, cat:"Fine Tuning",        d:"must_do"},
  {id:"c2_50",sn:50,n:"LangGraph",                           m:116,cat:"LangGraph",          d:"must_do"},
  {id:"c2_51",sn:51,n:"MCP",                                 m:53, cat:"Emerging",           d:"must_do"},
  {id:"c2_52",sn:52,n:"Role Play / Interview Mock",          m:0,  cat:"Extra",              d:"optional"},
];

const STATUS_CFG = {
  must_do:    {label:"Must Do",  c:T.teal},
  optional:   {label:"Optional", c:T.amber},
  skip:       {label:"Skip",     c:T.muted},
  must_later: {label:"Later",    c:T.red},
};
const PROG_CFG = {
  0:{label:"Not Started", c:T.muted},
  1:{label:"Watching",    c:T.blue},
  2:{label:"Done ✓",      c:T.green},
};
const PROJ_STATUS = {
  not_started:{label:"Not Started", c:T.muted, bg:"#f8fafc"},
  in_progress: {label:"In Progress",c:T.amber, bg:"#fffbeb"},
  done:        {label:"Done ✓",     c:T.green, bg:"#f0fdf4"},
};
const PROJ_COLORS=[T.blue,T.purple,T.amber,T.red];

const fmtH = m => {
  if(!m) return "0m";
  const h=Math.floor(m/60), mn=Math.round(m%60);
  if(!h) return `${mn}m`;
  if(!mn) return `${h}h`;
  return `${h}h ${mn}m`;
};
const pct=(a,b)=>b>0?Math.round(a/b*100):0;

const calcStats=(defs,secs)=>{
  let total=0,done=0,skipped=0;
  defs.forEach(s=>{
    const st=secs[s.id]||{status:s.d,progress:0};
    if(st.status==="skip"){skipped+=s.m;return;}
    total+=s.m;
    if(st.progress===2) done+=s.m;
    else if(st.progress===1) done+=s.m*0.5;
  });
  return{total,done,remaining:total-done,skipped};
};

const groupBy=(arr,key)=>{
  const m={};
  arr.forEach(x=>{(m[x[key]]=m[x[key]]||[]).push(x);});
  return m;
};

const computePace=(days,totalM,doneM)=>{
  const currentDay=todayDayNum();
  const totalActiveDays=days.filter(d=>!d.isOff).length;
  const elapsedActive=days.filter(d=>!d.isOff&&d.day<=currentDay).length;
  const expectedPct=totalActiveDays>0?Math.round(elapsedActive/totalActiveDays*100):0;
  const actualPct=pct(doneM,totalM);
  return{expectedPct,actualPct,diff:actualPct-expectedPct};
};

const mkSections=()=>{
  const s={};
  [...C1,...C2].forEach(x=>{s[x.id]={status:x.d,progress:0};});
  return s;
};
const mkDays=()=>Array.from({length:35},(_,i)=>({
  day:i+1, isOff:false,
  log:{video:0,practical:0,other:0},
  plan:"", notes:"",
}));
const DEFAULT_PROJS=[
  {id:"p1",name:"ML Classification App",  course:"C1",day:14,status:"not_started",notes:""},
  {id:"p2",name:"NLP Text Analysis App",  course:"C1",day:22,status:"not_started",notes:""},
  {id:"p3",name:"RAG Chatbot",            course:"C2",day:28,status:"not_started",notes:""},
  {id:"p4",name:"LangGraph Agent App",    course:"C2",day:34,status:"not_started",notes:""},
];

// ─── SHARED UI ───────────────────────────────────────────────────
function Bar({value,color=T.teal,h=5}){
  return(
    <div style={{background:T.track,borderRadius:99,height:h,overflow:"hidden"}}>
      <div style={{width:`${Math.min(Math.max(value,0),100)}%`,height:"100%",
        background:color,borderRadius:99,transition:"width 0.4s ease"}}/>
    </div>
  );
}
function Toggle({on,onChange,color=T.teal}){
  return(
    <button onClick={onChange} style={{width:40,height:22,borderRadius:99,border:"none",
      cursor:"pointer",background:on?color:T.track,position:"relative",flexShrink:0,transition:"background 0.2s"}}>
      <div style={{width:16,height:16,borderRadius:"50%",background:on?"#fff":T.muted,
        position:"absolute",top:3,left:on?21:3,transition:"left 0.2s"}}/>
    </button>
  );
}
function MetricCard({v,l,sub,c,warn}){
  return(
    <div style={{background:warn?"#fffbeb":T.panel,borderRadius:8,padding:"12px 14px",
      border:`1px solid ${warn?T.amber:T.border}`}}>
      <div style={{fontSize:10,color:T.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{l}</div>
      <div style={{fontSize:20,fontWeight:900,color:c,fontFamily:"monospace",lineHeight:1}}>{v}</div>
      {sub&&<div style={{fontSize:10,color:T.sub,marginTop:4}}>{sub}</div>}
    </div>
  );
}
const P={
  panel:{background:T.panel,borderRadius:10,padding:16,border:`1px solid ${T.border}`,marginBottom:12},
  secHdr:{fontSize:10,color:T.muted,letterSpacing:2,fontFamily:"monospace",marginBottom:10,marginTop:4},
  btn:{padding:"8px 16px",background:"transparent",border:`1px solid ${T.teal}`,color:T.teal,
    fontSize:11,fontWeight:700,borderRadius:6,cursor:"pointer",letterSpacing:1,fontFamily:"monospace"},
  input:{width:"100%",padding:"8px 11px",background:T.inputBg,border:`1px solid ${T.border}`,
    borderRadius:7,color:T.text,fontSize:12,boxSizing:"border-box",outline:"none"},
  label:{fontSize:10,color:T.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:5,display:"block"},
  select:{padding:"5px 8px",background:T.inputBg,border:`1px solid ${T.border}`,
    borderRadius:6,color:T.text,fontSize:11,cursor:"pointer",outline:"none"},
};
function Ring({p:pv,color,label,size=44}){
  const r=size/2-4,circ=2*Math.PI*r,dash=circ*(pv/100);
  return(
    <div style={{textAlign:"center"}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.track} strokeWidth={3}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}/>
        <text x={size/2} y={size/2+4} textAnchor="middle" fill={color}
          fontSize={10} fontWeight={700} fontFamily="monospace">{pv}%</text>
      </svg>
      <div style={{fontSize:9,color:T.muted,letterSpacing:1,marginTop:-2}}>{label}</div>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────
export default function App(){
  const [loading,setLoading]=useState(true);
  const [tab,setTab]=useState("dashboard");
  const [sections,setSections]=useState(mkSections);
  const [days,setDays]=useState(mkDays);
  const [projects,setProjects]=useState(DEFAULT_PROJS);

  useEffect(()=>{
    const s=lsGet("sp3_secs");
    const d=lsGet("sp3_days");
    const p=lsGet("sp3_proj");
    if(s) setSections(s);
    if(d) setDays(d);
    if(p) setProjects(p);
    setLoading(false);
  },[]);

  const updateSection=(id,patch)=>{
    setSections(prev=>{const n={...prev,[id]:{...prev[id],...patch}};lsSet("sp3_secs",n);return n;});
  };
  const updateDays=val=>{setDays(val);lsSet("sp3_days",val);};
  const updateProjects=val=>{setProjects(val);lsSet("sp3_proj",val);};

  const s1=useMemo(()=>calcStats(C1,sections),[sections]);
  const s2=useMemo(()=>calcStats(C2,sections),[sections]);
  const overallPct=pct(s1.done+s2.done,s1.total+s2.total);

  if(loading) return(
    <div style={{background:T.bg,height:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <span style={{color:T.teal,fontFamily:"monospace",fontSize:13}}>Loading StudyOS...</span>
    </div>
  );

  const TABS=[
    {id:"dashboard",label:"◈ Dashboard"},
    {id:"courses",  label:"≡ Courses"},
    {id:"schedule", label:"▦ Schedule"},
    {id:"projects", label:"◆ Projects"},
  ];

  return(
    <div style={{background:T.bg,minHeight:"100vh",color:T.text,fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{background:T.panel,borderBottom:`1px solid ${T.border}`,
        padding:"12px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontFamily:"monospace",fontWeight:900,fontSize:20,letterSpacing:2,color:T.text}}>
            STUDY<span style={{color:T.teal}}>OS</span>
            <span style={{fontSize:11,fontWeight:400,color:T.muted,marginLeft:12}}>
              14 Apr → {fmtDate(dayToCalDate(35))} 2026
            </span>
          </div>
          <div style={{fontSize:10,color:T.faint,marginTop:1}}>
            KRISH NAIK · 2 COURSES · 35 DAYS · 4 PROJECTS
            <span style={{marginLeft:10,color:T.teal,fontWeight:700}}>
              TODAY: Day {todayDayNum()} · {fmtDate(TODAY)}
            </span>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:9,color:T.muted,letterSpacing:1}}>OVERALL</div>
            <div style={{fontSize:28,fontWeight:900,fontFamily:"monospace",lineHeight:1,
              color:overallPct>60?T.green:overallPct>30?T.amber:T.blue}}>{overallPct}%</div>
          </div>
          <Ring p={pct(s1.done,s1.total)} color={T.blue}   label="C1"/>
          <Ring p={pct(s2.done,s2.total)} color={T.purple} label="C2"/>
        </div>
      </div>

      <div style={{background:T.panel,borderBottom:`1px solid ${T.border}`,display:"flex",overflowX:"auto"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:"11px 16px",fontSize:12,fontWeight:700,cursor:"pointer",background:"none",border:"none",
            color:tab===t.id?T.teal:T.muted,whiteSpace:"nowrap",
            borderBottom:tab===t.id?`2px solid ${T.teal}`:"2px solid transparent",transition:"color 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{maxWidth:1000,margin:"0 auto",padding:"16px 14px"}}>
        {tab==="dashboard" && <Dashboard s1={s1} s2={s2} days={days} projects={projects} setTab={setTab}/>}
        {tab==="courses"   && <Courses sections={sections} updateSection={updateSection} s1={s1} s2={s2}/>}
        {tab==="schedule"  && <Schedule days={days} updateDays={updateDays} projects={projects}/>}
        {tab==="projects"  && <Projects projects={projects} updateProjects={updateProjects}/>}
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────
function Dashboard({s1,s2,days,projects,setTab}){
  const totalM=s1.total+s2.total, doneM=s1.done+s2.done, remainM=totalM-doneM;
  const activeDays=days.filter(d=>!d.isOff).length;
  const offDays=days.filter(d=>d.isOff).length;
  const activeRemaining=days.filter(d=>!d.isOff&&d.day>=currentDay).length;
  const hpdNeeded=activeRemaining>0?(remainM/60/activeRemaining).toFixed(1):"—";
  const vLog=days.reduce((s,d)=>s+(d.log?.video||0),0);
  const pLog=days.reduce((s,d)=>s+(d.log?.practical||0),0);
  const oLog=days.reduce((s,d)=>s+(d.log?.other||0),0);
  const daysStudied=days.filter(d=>(d.log?.video||0)+(d.log?.practical||0)+(d.log?.other||0)>0).length;
  const pace=computePace(days,totalM,doneM);
  const isLagging=pace.diff<-10, isAhead=pace.diff>10;
  const currentDay=todayDayNum();
  const calDaysLeft=Math.max(0,35-currentDay+1);
  const activeRemaining=days.filter(d=>!d.isOff&&d.day>=currentDay).length;

  return(
    <div>
      {(isLagging||isAhead)&&(
        <div style={{background:isLagging?"#fef2f2":"#f0fdf4",
          border:`1px solid ${isLagging?T.red:T.green}`,
          borderRadius:8,padding:"10px 14px",marginBottom:12,display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontSize:20}}>{isLagging?"⚠️":"🚀"}</span>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:isLagging?T.red:T.green}}>
              {isLagging?`Lagging by ${Math.abs(pace.diff)}% — pick up pace`:`Ahead by ${pace.diff}% — great work!`}
            </div>
            <div style={{fontSize:11,color:T.sub,marginTop:2}}>
              Expected {pace.expectedPct}% by Day {currentDay} · Actual: {pace.actualPct}%
            </div>
          </div>
        </div>
      )}

      <div style={{...P.panel,display:"flex",gap:16,alignItems:"center",flexWrap:"wrap",
        background:"linear-gradient(135deg,#eff6ff,#f0fdf4)",padding:"12px 16px"}}>
        {[{v:calDaysLeft,l:"Cal. Days Left",c:T.blue},{v:activeRemaining,l:"Study Days Left",c:T.teal},{v:offDays,l:"Off Days",c:T.muted}]
          .map((x,i)=>(
          <div key={i} style={{textAlign:"center",padding:"0 8px"}}>
            <div style={{fontSize:26,fontWeight:900,fontFamily:"monospace",color:x.c}}>{x.v}</div>
            <div style={{fontSize:9,color:T.muted,letterSpacing:1}}>{x.l}</div>
          </div>
        ))}
        <div style={{width:1,background:T.border,alignSelf:"stretch",minHeight:40}}/>
        <div style={{flex:1,minWidth:180}}>
          <div style={{fontSize:11,color:T.sub,marginBottom:4}}>
            Day {currentDay}/35 · Ends <b>{fmtDate(dayToCalDate(35))}</b> · Need <b style={{color:parseFloat(hpdNeeded)>5?T.red:T.teal}}>{hpdNeeded}h/day</b> from today
          </div>
          <Bar value={pct(currentDay,35)} color={T.blue} h={6}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:T.faint,marginTop:2}}>
            <span>14 Apr</span><span>{fmtDate(dayToCalDate(35))}</span>
          </div>
        </div>
      </div>

      <div style={P.secHdr}>▸ COURSE CONTENT TRACKER</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,marginBottom:12}}>
        <MetricCard v={fmtH(doneM)}    l="Done"      sub={`${pct(doneM,totalM)}% of active`} c={T.teal}/>
        <MetricCard v={fmtH(remainM)}  l="Remaining" sub={`of ${fmtH(totalM)}`}              c={T.blue}/>
        <MetricCard v={`${hpdNeeded}h`} l="Hrs/Day"  sub="course content needed"             c={T.amber} warn={parseFloat(hpdNeeded)>5}/>
        <MetricCard v={fmtH(s1.skipped+s2.skipped)} l="Skipped" sub="removed"               c={T.muted}/>
      </div>
      <div style={P.panel}>
        {[
          {label:"C1 — Data Science, ML, DL, NLP", s:s1, c:T.blue},
          {label:"C2 — Generative AI + LangChain",  s:s2, c:T.purple},
          {label:"Combined", s:{total:totalM,done:doneM,remaining:remainM,skipped:s1.skipped+s2.skipped}, c:T.teal},
        ].map((row,i)=>(
          <div key={i} style={{marginBottom:i<2?14:0}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:11,color:T.sub}}>{row.label}</span>
              <span style={{fontSize:13,fontWeight:900,color:row.c,fontFamily:"monospace"}}>{pct(row.s.done,row.s.total)}%</span>
            </div>
            <Bar value={pct(row.s.done,row.s.total)} color={row.c} h={6}/>
            <div style={{fontSize:10,color:T.muted,marginTop:3,display:"flex",gap:12}}>
              <span>{fmtH(row.s.done)} done</span><span>{fmtH(row.s.remaining)} left</span>
              {row.s.skipped>0&&<span>{fmtH(row.s.skipped)} skipped</span>}
            </div>
          </div>
        ))}
      </div>

      <div style={P.secHdr}>▸ DAILY STUDY LOG</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,marginBottom:12}}>
        <MetricCard v={`${vLog.toFixed(1)}h`} l="Video"     sub="lectures"      c={T.blue}/>
        <MetricCard v={`${pLog.toFixed(1)}h`} l="Practical" sub="coding"        c={T.purple}/>
        <MetricCard v={`${oLog.toFixed(1)}h`} l="Other"     sub="revision etc"  c={T.amber}/>
        <MetricCard v={daysStudied}            l="Days Logged" sub="of 35"       c={T.teal}/>
      </div>

      <div style={P.secHdr}>▸ PROJECTS</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:14}}>
        {projects.map((p,i)=>{
          const cfg=PROJ_STATUS[p.status];
          return(
            <div key={p.id} style={{...P.panel,borderLeft:`3px solid ${PROJ_COLORS[i]}`,padding:"10px 14px",marginBottom:0}}>
              <div style={{fontSize:12,fontWeight:700,color:PROJ_COLORS[i],marginBottom:2}}>{p.name}</div>
              <div style={{fontSize:10,color:T.sub}}>Day {p.day} · {fmtDate(dayToCalDate(p.day))}</div>
              <div style={{fontSize:10,color:cfg.c,marginTop:3,fontWeight:600}}>{cfg.label}</div>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {[["📅 Log Today","schedule"],["📚 Courses","courses"],["🚀 Projects","projects"]].map(([l,t])=>(
          <button key={t} onClick={()=>setTab(t)} style={P.btn}>{l}</button>
        ))}
      </div>
    </div>
  );
}

// ─── COURSES ─────────────────────────────────────────────────────
function Courses({sections,updateSection,s1,s2}){
  const [activeCourse,setActiveCourse]=useState("C1");
  const [filter,setFilter]=useState("all");
  const [expanded,setExpanded]=useState({});
  const defs=activeCourse==="C1"?C1:C2;
  const stats=activeCourse==="C1"?s1:s2;
  const accent=activeCourse==="C1"?T.blue:T.purple;
  const groups=groupBy(defs,"cat");
  const toggleGroup=cat=>setExpanded(p=>({...p,[cat]:!p[cat]}));
  const filtered=secs=>{
    if(filter==="active") return secs.filter(s=>(sections[s.id]?.status||s.d)!=="skip");
    if(filter==="done")   return secs.filter(s=>(sections[s.id]?.progress||0)===2);
    if(filter==="skip")   return secs.filter(s=>(sections[s.id]?.status||s.d)==="skip");
    return secs;
  };
  const catDone=secs=>secs.every(s=>(sections[s.id]?.status||s.d)==="skip"||(sections[s.id]?.progress||0)===2);
  const catStats=secs=>{
    let total=0,done=0;
    secs.forEach(s=>{
      const st=sections[s.id]||{status:s.d,progress:0};
      if(st.status==="skip") return;
      total+=s.m;
      if(st.progress===2) done+=s.m;
      else if(st.progress===1) done+=s.m*0.5;
    });
    return{total,done};
  };

  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        {[["C1",T.blue,"Course 1 — DS, ML, DL, NLP (61s)"],["C2",T.purple,"Course 2 — GenAI + LangChain (52s)"]].map(([id,c,lbl])=>(
          <button key={id} onClick={()=>setActiveCourse(id)} style={{
            padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer",borderRadius:6,
            background:activeCourse===id?c+"18":"transparent",color:activeCourse===id?c:T.muted,
            border:`1px solid ${activeCourse===id?c:T.border}`,transition:"all 0.15s",
          }}>{lbl}</button>
        ))}
      </div>
      <div style={P.panel}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
          <span style={{fontSize:11,color:T.sub}}>Progress</span>
          <span style={{fontSize:14,fontWeight:900,color:accent,fontFamily:"monospace"}}>{pct(stats.done,stats.total)}%</span>
        </div>
        <Bar value={pct(stats.done,stats.total)} color={accent} h={7}/>
        <div style={{fontSize:10,color:T.muted,marginTop:4,display:"flex",gap:12}}>
          <span>{fmtH(stats.done)} done</span><span>{fmtH(stats.remaining)} left</span><span>{fmtH(stats.skipped)} skipped</span>
        </div>
        <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
          {[["all","All"],["active","Active"],["done","Done"],["skip","Skipped"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)} style={{
              padding:"3px 10px",fontSize:10,borderRadius:4,cursor:"pointer",fontWeight:700,
              background:filter===v?accent+"18":"transparent",color:filter===v?accent:T.muted,
              border:`1px solid ${filter===v?accent:T.border}`,
            }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{fontSize:10,color:T.muted,marginBottom:8}}>
        Status: M=Must Do · O=Optional · S=Skip · L=Later &nbsp; Progress: ○=Not Started · ◑=Watching · ●=Done
      </div>
      {Object.entries(groups).map(([cat,secs])=>{
        const vis=filtered(secs);
        if(vis.length===0) return null;
        const cs=catStats(secs);
        const isExp=expanded[cat]!==false;
        const allDone=catDone(secs);
        const allSkip=secs.every(s=>(sections[s.id]?.status||s.d)==="skip");
        return(
          <div key={cat} style={{...P.panel,padding:0,overflow:"hidden"}}>
            <button onClick={()=>toggleGroup(cat)} style={{
              width:"100%",padding:"10px 14px",background:allDone?"#f0fdf4":allSkip?"#f8fafc":T.panel,
              border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:12,fontWeight:700,color:allSkip?T.faint:allDone?T.green:T.text}}>
                  {allSkip?"⊘ ":allDone?"✓ ":""}{cat}
                </span>
                <span style={{fontSize:10,color:T.muted}}>{secs.length}s</span>
                {!allSkip&&cs.total>0&&<span style={{fontSize:10,color:accent,fontFamily:"monospace"}}>{fmtH(cs.done)}/{fmtH(cs.total)}</span>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                {!allSkip&&cs.total>0&&<div style={{width:70}}><Bar value={pct(cs.done,cs.total)} color={accent} h={3}/></div>}
                <span style={{color:T.muted,fontSize:12}}>{isExp?"▲":"▼"}</span>
              </div>
            </button>
            {isExp&&(
              <div style={{borderTop:`1px solid ${T.border}`}}>
                {vis.map(s=><SectionRow key={s.id} sec={s} st={sections[s.id]||{status:s.d,progress:0}} updateSection={updateSection} accent={accent}/>)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SectionRow({sec,st,updateSection,accent}){
  const isSkip=st.status==="skip";
  const scfg=STATUS_CFG[st.status||sec.d];
  const pcfg=PROG_CFG[st.progress||0];
  return(
    <div style={{padding:"8px 14px",borderBottom:`1px solid ${T.border}`,background:isSkip?"#fafafa":T.panel,opacity:isSkip?0.65:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
        <div style={{flex:1,minWidth:0,display:"flex",alignItems:"baseline",gap:5}}>
          <span style={{fontSize:10,fontWeight:700,color:accent,fontFamily:"monospace",flexShrink:0,minWidth:26}}>S{sec.sn}.</span>
          <span style={{fontSize:12,color:isSkip?T.muted:T.text,textDecoration:isSkip?"line-through":"none",lineHeight:1.4}}>{sec.n}</span>
          {sec.m>0&&<span style={{fontSize:10,color:T.faint,flexShrink:0}}>{fmtH(sec.m)}</span>}
        </div>
        <div style={{display:"flex",gap:5,alignItems:"center",flexShrink:0}}>
          <select value={st.status||sec.d}
            onChange={e=>updateSection(sec.id,{status:e.target.value,progress:e.target.value==="skip"?0:(st.progress||0)})}
            style={{...P.select,color:scfg.c,fontWeight:700,background:scfg.c+"12",border:`1px solid ${scfg.c}44`,fontSize:10}}>
            <option value="must_do">M · Must Do</option>
            <option value="optional">O · Optional</option>
            <option value="skip">S · Skip</option>
            <option value="must_later">L · Later</option>
          </select>
          {!isSkip&&(
            <select value={st.progress||0}
              onChange={e=>updateSection(sec.id,{progress:+e.target.value})}
              style={{...P.select,color:pcfg.c,fontWeight:700,background:pcfg.c+"12",border:`1px solid ${pcfg.c}44`,fontSize:10}}>
              <option value={0}>○ Not Started</option>
              <option value={1}>◑ Watching</option>
              <option value={2}>● Done</option>
            </select>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SCHEDULE ────────────────────────────────────────────────────
function Schedule({days,updateDays,projects}){
  const [sel,setSel]=useState(null);
  const [edit,setEdit]=useState(null);
  const open=d=>{setSel(d.day);setEdit({...d,log:{...(d.log||{video:0,practical:0,other:0})}});};
  const close=()=>{setSel(null);setEdit(null);};
  const saveDay=()=>{updateDays(days.map(d=>d.day===edit.day?edit:d));close();};
  const projsOn=n=>projects.filter(p=>p.day===n);
  const weeks=Array.from({length:5},(_,i)=>days.slice(i*7,i*7+7));
  const currentDay=todayDayNum();
  const activeDays=days.filter(d=>!d.isOff).length;
  const offDays=days.filter(d=>d.isOff).length;
  const vTotal=days.reduce((s,d)=>s+(d.log?.video||0),0);
  const pTotal=days.reduce((s,d)=>s+(d.log?.practical||0),0);

  return(
    <div style={{display:"grid",gridTemplateColumns:sel?"1fr 290px":"1fr",gap:14,alignItems:"start"}}>
      <div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
          <MetricCard v={activeDays}              l="Active Days"  sub={`${offDays} off`}  c={T.teal}/>
          <MetricCard v={`${vTotal.toFixed(1)}h`} l="Video"       sub="logged total"       c={T.blue}/>
          <MetricCard v={`${pTotal.toFixed(1)}h`} l="Practical"   sub="logged total"       c={T.purple}/>
          <MetricCard v="9–10h"                   l="Daily Target" sub="commitment"        c={T.amber}/>
        </div>
        <div style={{fontSize:10,color:T.muted,marginBottom:8}}>
          Tap a day to log · TODAY = Day {currentDay} ({fmtDate(TODAY)}) · 🚀 Project · ✏️ Plan
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:3}}>
          {["M","T","W","T","F","S","S"].map((l,i)=>(
            <div key={i} style={{textAlign:"center",fontSize:9,color:T.faint}}>{l}</div>
          ))}
        </div>
        {weeks.map((wk,wi)=>(
          <div key={wi} style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:3}}>
            {wk.map(d=>{
              const isToday=d.day===currentDay, isPast=d.day<currentDay;
              const projs=projsOn(d.day), isSel=sel===d.day;
              const log=d.log||{video:0,practical:0,other:0};
              const totalL=(log.video||0)+(log.practical||0)+(log.other||0);
              const prog=Math.min(totalL/9,1);
              return(
                <div key={d.day} onClick={()=>open(d)} style={{
                  background:d.isOff?"#f8fafc":isSel?"#eff6ff":isToday?"#f0fdf4":"#fff",
                  border:`1.5px solid ${isSel?T.blue:isToday?T.teal:isPast&&totalL===0&&!d.isOff?T.faint:T.border}`,
                  borderRadius:6,padding:"5px",cursor:"pointer",minHeight:56,transition:"all 0.15s",
                }}>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontSize:11,fontWeight:800,fontFamily:"monospace",
                        color:d.isOff?T.faint:isToday?T.teal:prog>=1?T.green:T.text}}>{d.day}</div>
                      <div style={{fontSize:7,color:T.faint,lineHeight:1}}>{fmtDate(dayToCalDate(d.day))}</div>
                    </div>
                    <div style={{fontSize:8}}>{projs.length>0?"🚀":""}{d.plan?"✏️":""}</div>
                  </div>
                  {d.isOff?<div style={{fontSize:8,color:T.faint}}>OFF</div>:(
                    <>
                      {totalL>0&&<div style={{fontSize:8,color:T.sub,marginTop:1}}>{totalL.toFixed(1)}h</div>}
                      {prog>0&&<div style={{marginTop:2}}><Bar value={prog*100} color={prog>=1?T.green:T.blue} h={2}/></div>}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {sel&&edit&&(
        <div style={{...P.panel,position:"sticky",top:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <span style={{fontSize:17,fontWeight:900,fontFamily:"monospace",color:T.blue}}>Day {edit.day}</span>
              <span style={{fontSize:12,color:T.muted,marginLeft:8}}>{fmtDate(dayToCalDate(edit.day))}</span>
              {edit.day===currentDay&&<span style={{fontSize:10,color:T.teal,marginLeft:6,fontWeight:700}}>TODAY</span>}
            </div>
            <button onClick={close} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:20}}>×</button>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:T.bg,borderRadius:7,padding:"8px 12px",marginBottom:10}}>
            <span style={{fontSize:12,color:T.sub}}>🏖️ Off Day</span>
            <Toggle on={edit.isOff} onChange={()=>setEdit(p=>({...p,isOff:!p.isOff}))} color={T.red}/>
          </div>
          {!edit.isOff&&(
            <>
              <div style={{marginBottom:10}}>
                <label style={P.label}>Study Plan</label>
                <textarea rows={3} value={edit.plan||""} placeholder="e.g. C1: S25 Linear Regression + practice"
                  onChange={e=>setEdit(p=>({...p,plan:e.target.value}))}
                  style={{...P.input,resize:"vertical"}}/>
              </div>
              <label style={{...P.label,marginBottom:6}}>⏱ Log Hours</label>
              <div style={{background:T.bg,borderRadius:7,padding:10,marginBottom:10}}>
                {[{key:"video",label:"📹 Video",c:T.blue},{key:"practical",label:"⚡ Practical",c:T.purple},{key:"other",label:"📝 Other",c:T.amber}].map(f=>(
                  <div key={f.key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{fontSize:11,color:f.c}}>{f.label}</span>
                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      <input type="number" min={0} max={12} step={0.5} value={edit.log?.[f.key]||0}
                        onChange={e=>setEdit(p=>({...p,log:{...p.log,[f.key]:+e.target.value}}))}
                        style={{...P.input,width:60,padding:"5px 8px",fontFamily:"monospace",fontWeight:700,textAlign:"center"}}/>
                      <span style={{fontSize:10,color:T.muted}}>h</span>
                    </div>
                  </div>
                ))}
                {(()=>{
                  const t=(edit.log?.video||0)+(edit.log?.practical||0)+(edit.log?.other||0);
                  return t>0?(
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:3}}>
                        <span style={{color:T.sub}}>{t.toFixed(1)}h / 9h</span>
                        <span style={{color:t>=9?T.green:t>=7?T.amber:T.blue,fontWeight:700}}>
                          {t>=9?"✓ Done!":t>=7?"Almost!":"Go!"}
                        </span>
                      </div>
                      <Bar value={Math.min(t/9*100,100)} color={t>=9?T.green:t>=7?T.amber:T.blue} h={5}/>
                    </div>
                  ):null;
                })()}
              </div>
              <div style={{marginBottom:10}}>
                <label style={P.label}>Notes</label>
                <textarea rows={2} value={edit.notes||""} onChange={e=>setEdit(p=>({...p,notes:e.target.value}))}
                  placeholder="What went well? What to revisit?" style={{...P.input,resize:"vertical"}}/>
              </div>
            </>
          )}
          <button onClick={saveDay} style={{width:"100%",padding:10,background:T.teal,color:"#fff",
            border:"none",borderRadius:7,fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:1}}>
            SAVE DAY
          </button>
        </div>
      )}
    </div>
  );
}

// ─── PROJECTS ────────────────────────────────────────────────────
function Projects({projects,updateProjects}){
  const upd=(id,patch)=>updateProjects(projects.map(p=>p.id===id?{...p,...patch}:p));
  return(
    <div>
      <div style={{fontSize:10,color:T.muted,letterSpacing:1,marginBottom:12}}>4 PROJECTS · ALL FIELDS EDITABLE</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:12}}>
        {projects.map((p,i)=>{
          const cfg=PROJ_STATUS[p.status], acc=PROJ_COLORS[i];
          return(
            <div key={p.id} style={{...P.panel,borderLeft:`3px solid ${acc}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <span style={{fontSize:11,color:acc,fontWeight:900,fontFamily:"monospace"}}>PROJECT {i+1}</span>
                <div style={{padding:"3px 10px",fontSize:10,fontWeight:700,borderRadius:4,background:cfg.bg,color:cfg.c}}>{cfg.label}</div>
              </div>
              <div style={{marginBottom:10}}>
                <label style={P.label}>Name</label>
                <input value={p.name} onChange={e=>upd(p.id,{name:e.target.value})} style={P.input}/>
              </div>
              <div style={{display:"flex",gap:10,marginBottom:10}}>
                <div style={{flex:1}}>
                  <label style={P.label}>Course</label>
                  <select value={p.course} onChange={e=>upd(p.id,{course:e.target.value})} style={{...P.input,width:"100%"}}>
                    <option value="C1">Course 1 — DS/ML</option>
                    <option value="C2">Course 2 — GenAI</option>
                  </select>
                </div>
                <div style={{width:85}}>
                  <label style={P.label}>Day</label>
                  <input type="number" min={1} max={35} value={p.day}
                    onChange={e=>upd(p.id,{day:+e.target.value})}
                    style={{...P.input,textAlign:"center",fontFamily:"monospace",fontWeight:700}}/>
                  <div style={{fontSize:9,color:T.muted,marginTop:2,textAlign:"center"}}>{fmtDate(dayToCalDate(p.day))}</div>
                </div>
              </div>
              <div style={{marginBottom:10}}>
                <label style={P.label}>Status</label>
                <select value={p.status} onChange={e=>upd(p.id,{status:e.target.value})}
                  style={{...P.input,width:"100%",color:cfg.c,fontWeight:700,background:cfg.bg}}>
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done ✓</option>
                </select>
              </div>
              <div>
                <label style={P.label}>Notes / Tech Stack / Link</label>
                <textarea rows={2} value={p.notes} onChange={e=>upd(p.id,{notes:e.target.value})}
                  placeholder="e.g. Scikit-learn + Streamlit + HF Spaces link"
                  style={{...P.input,resize:"vertical"}}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
