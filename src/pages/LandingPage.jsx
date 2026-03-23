import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";

/* ═══════════════════════════════════════════════════════
   INJECT GLOBAL STYLES
═══════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap');

  :root{
    --red:#e53935; --blue:#00c8ff;
    --navy:#070d2a; --navy2:#0a1240; --navy3:#0d1535;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body{background:var(--navy);color:#fff;overflow-x:hidden;}
  .bb{font-family:"Bebas Neue",sans-serif;}
  .it{font-family:"Inter",sans-serif;}

  /* ── keyframes ─────────────────────────────────── */
  @keyframes arcDash  {to{stroke-dashoffset:-300}}
  @keyframes arcDash2 {to{stroke-dashoffset:-220}}
  @keyframes arcDash3 {to{stroke-dashoffset:-160}}
  @keyframes cityPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(1.7)}}
  @keyframes cityPing {0%{transform:scale(1);opacity:.7}100%{transform:scale(3.5);opacity:0}}
  @keyframes incPing  {0%{transform:scale(1);opacity:.75}75%,100%{transform:scale(2.8);opacity:0}}
  @keyframes floatY   {0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes floatY2  {0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes btnGlow  {
    0%,100%{box-shadow:0 0 25px rgba(229,57,53,.7),0 0 55px rgba(229,57,53,.3)}
    50%    {box-shadow:0 0 42px rgba(229,57,53,1),  0 0 90px rgba(229,57,53,.55)}
  }
  @keyframes barIn    {from{transform:scaleY(0)}to{transform:scaleY(1)}}
  @keyframes fadeUp   {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes borderPulse{
    0%,100%{box-shadow:0 0 0 0 rgba(0,200,255,0);border-color:rgba(20,60,140,.45)}
    50%    {box-shadow:0 0 18px rgba(0,200,255,.3);border-color:rgba(0,200,255,.55)}
  }
  @keyframes shimmer  {0%{opacity:.6}50%{opacity:1}100%{opacity:.6}}

  .arc-a{stroke-dasharray:16 80; animation:arcDash  3.6s linear infinite}
  .arc-b{stroke-dasharray:11 90; animation:arcDash2 4.9s linear infinite}
  .arc-c{stroke-dasharray:13 70; animation:arcDash  5.3s linear infinite}
  .arc-d{stroke-dasharray:9 100; animation:arcDash2 4.1s linear infinite}
  .arc-e{stroke-dasharray:14 75; animation:arcDash3 3.2s linear infinite}
  .arc-f{stroke-dasharray:10 85; animation:arcDash  5.8s linear infinite}

  .fu1{animation:fadeUp .65s ease-out .05s both}
  .fu2{animation:fadeUp .65s ease-out .18s both}
  .fu3{animation:fadeUp .65s ease-out .30s both}
  .fu4{animation:fadeUp .65s ease-out .42s both}

  /* ── glass card ───────────────────────────────── */
  .glass-card{
    background:rgba(6,14,48,.88);
    border:1px solid rgba(26,58,122,.75);
    border-radius:10px;
    backdrop-filter:blur(12px);
    animation:borderPulse 4s ease-in-out infinite;
  }

  /* ── bar animation ─────────────────────────────── */
  .bar{transform-origin:bottom;animation:barIn .65s ease-out both}

  /* ── feature card ──────────────────────────────── */
  .feat{
    flex:1;display:flex;align-items:center;justify-content:space-between;
    padding:36px 32px;
    background:var(--navy3);
    border-right:1px solid #1a2a5e;
    position:relative;overflow:hidden;
    transition:background .22s;
    cursor:pointer;
  }
  .feat:last-child{border-right:none}
  .feat::after{
    content:"";position:absolute;top:0;left:0;right:0;height:3px;
  }
  .feat.r::after{background:linear-gradient(90deg,#e53935,transparent)}
  .feat.b::after{background:linear-gradient(90deg,#00c8ff,transparent)}
  .feat:hover{background:#0f1a42}

  /* ── section divider ───────────────────────────── */
  .sec-div{height:1px;background:linear-gradient(90deg,transparent,#1a2a5e 20%,#1a2a5e 80%,transparent)}

  /* ── how-it-works step ─────────────────────────── */
  .step-card{
    flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;
    padding:36px 24px;gap:16px;position:relative;
  }
  .step-card:not(:last-child)::after{
    content:"";position:absolute;right:-1px;top:50%;transform:translateY(-50%);
    width:1px;height:60%;background:linear-gradient(to bottom,transparent,#1a2a5e,transparent);
  }
  .step-num{
    width:52px;height:52px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-family:"Bebas Neue",sans-serif;font-size:22px;
    border:2px solid;
  }

  /* ── stat badge ─────────────────────────────────── */
  .stat-badge{
    flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;
    padding:36px 20px;border-right:1px solid #1a2a5e;
  }
  .stat-badge:last-child{border-right:none}

  /* ── CTA section ────────────────────────────────── */
  .cta-sec{
    background:linear-gradient(135deg,#0a0e2e 0%,#0d1a40 50%,#0a0e2e 100%);
    border-top:1px solid #1a2a5e;border-bottom:1px solid #1a2a5e;
    display:flex;align-items:center;justify-content:space-between;
    padding:56px 8%;gap:40px;flex-wrap:wrap;
  }

  /* ── footer ─────────────────────────────────────── */
  .footer-col{display:flex;flex-direction:column;gap:12px}
  .footer-link{
    font-size:13px;color:rgba(160,185,230,.55);cursor:pointer;
    transition:color .18s;
  }
  .footer-link:hover{color:#00c8ff}
`;

const injectStyles = () => {
  if (document.getElementById("cc-v5")) return;
  const s = document.createElement("style");
  s.id = "cc-v5"; s.innerHTML = STYLES;
  document.head.appendChild(s);
};

/* ═══════════════════════════════════════════════════════
   WORLD MAP — react-simple-maps (real country borders)
═══════════════════════════════════════════════════════ */
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = () => (
  <div style={{
    position:"absolute",inset:0,width:"100%",height:"100%",
    zIndex:1,overflow:"hidden",background:"#070d2a",
  }}>
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ scale: 155, center: [20, 15] }}
      style={{ width:"100%", height:"100%" }}
    >
      <ZoomableGroup zoom={1} minZoom={1} maxZoom={1}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1a2f6e"
                stroke="#00c8ff"
                strokeWidth={0.35}
                strokeOpacity={0.65}
                fillOpacity={0.88}
                style={{
                  default: { outline:"none" },
                  hover:   { outline:"none", fill:"#1e3a80" },
                  pressed: { outline:"none" },
                }}
              />
            ))
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
    {/* glow bloom over map */}
    <div style={{
      position:"absolute",inset:0,pointerEvents:"none",
      background:"radial-gradient(ellipse at 62% 48%, rgba(0,200,255,.06) 0%, transparent 65%)",
    }}/>
  </div>
);


/* ═══════════════════════════════════════════════════════
   ARC LINES + CITY DOTS  — overlay SVG at zIndex:3
   Using Annotation inside ComposableMap internally,
   or a simple overlay SVG with city % positions.
═══════════════════════════════════════════════════════ */

/* Real cities lat/lon → Mercator % approx for scale:155 center:[20,15]
   Used for arc endpoints and dot placement as % of container */
// Approximate pixel positions in a 1470×835 container (vw 100% × vh 100%)
// Derived from Mercator projection: px = (lon - centerLon)*scale/180*π + w/2, etc.
// For reference map: scale=155, center=[20,15], typical for world map.
// We keep this as a simple overlay SVG using viewBox="0 0 100 100" with decimal %s.

const CITIES = [
  // [x%, y%] calibrated to geoMercator scale=155 center=[20,15] at 1470×835
  [20,  38,  "New York"],      // 0  lon=-74  lat=41
  [17,  55,  "Bogota"],        // 1  lon=-74  lat=5
  [48,  28,  "London"],        // 2  lon=-0   lat=51
  [50,  30,  "Paris"],         // 3  lon=2    lat=49
  [55,  22,  "Moscow"],        // 4  lon=37   lat=56
  [50,  40,  "Cairo"],         // 5  lon=31   lat=30
  [60,  38,  "Dubai"],         // 6  lon=55   lat=25
  [65,  44,  "Mumbai"],        // 7  lon=73   lat=19
  [80,  30,  "Beijing"],       // 8  lon=116  lat=40
  [78,  44,  "Bangkok"],       // 9  lon=101  lat=14
  [88,  32,  "Tokyo"],         // 10 lon=140  lat=36
  [84,  72,  "Sydney"],        // 11 lon=151  lat=-34
  [52,  54,  "Nairobi"],       // 12 lon=37   lat=-1
];

// Arc connections [from-idx, to-idx, color, css-class]
const ARCS = [
  [0, 2,  "#00c8ff", "arc-a"],  // New York → London
  [2, 5,  "#00c8ff", "arc-b"],  // London → Cairo
  [5, 6,  "#00c8ff", "arc-c"],  // Cairo → Dubai
  [6, 7,  "#e53935", "arc-d"],  // Dubai → Mumbai
  [7, 8,  "#00c8ff", "arc-e"],  // Mumbai → Beijing
  [8,10,  "#00c8ff", "arc-f"],  // Beijing → Tokyo
  [10,11, "#00c8ff", "arc-a"],  // Tokyo → Sydney
  [2, 4,  "#00c8ff", "arc-c"],  // London → Moscow
  [4, 8,  "#00c8ff", "arc-b"],  // Moscow → Beijing
  [0, 1,  "#e53935", "arc-d"],  // New York → Bogota
  [7, 9,  "#00c8ff", "arc-e"],  // Mumbai → Bangkok
  [5,12,  "#e53935", "arc-f"],  // Cairo → Nairobi
];

const ArcLines = () => {
  const w = 1470, h = 835; // match viewport so % coords align
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice"
      style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:3,pointerEvents:"none"}}
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow-arc">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Ghost (faint) arcs */}
      {ARCS.map(([fi,ti,col],i) => {
        const [fx,fy] = CITIES[fi]; const [tx,ty] = CITIES[ti];
        const mx=(fx+tx)/2, my=Math.min(fy,ty)-15;
        return (
          <path key={`g${i}`}
            d={`M${fx/100*w},${fy/100*h} Q${mx/100*w},${my/100*h} ${tx/100*w},${ty/100*h}`}
            fill="none" stroke={col} strokeWidth="1" opacity="0.14"
            strokeDasharray="4 4"/>
        );
      })}

      {/* Animated arcs */}
      {ARCS.map(([fi,ti,col,cls],i) => {
        const [fx,fy] = CITIES[fi]; const [tx,ty] = CITIES[ti];
        const mx=(fx+tx)/2, my=Math.min(fy,ty)-15;
        return (
          <path key={`a${i}`}
            d={`M${fx/100*w},${fy/100*h} Q${mx/100*w},${my/100*h} ${tx/100*w},${ty/100*h}`}
            fill="none" stroke={col} strokeWidth="1.6" opacity="0.88"
            strokeDasharray="300" className={cls} filter="url(#glow-arc)"/>
        );
      })}

      {/* City dots */}
      {CITIES.map(([cx,cy],i) => {
        const px = cx/100*w, py = cy/100*h;
        return (
          <g key={i}>
            <circle cx={px} cy={py} r="6" fill="#00c8ff" opacity=".07"/>
            <circle cx={px} cy={py} r="4.5" fill="#00c8ff" opacity=".14"
              style={{animation:`cityPing 2.4s ease-out ${i*.28}s infinite`}}/>
            <circle cx={px} cy={py} r="2.8" fill="#00c8ff" opacity=".7"
              style={{animation:`cityPulse 2.2s ease-in-out ${i*.18}s infinite`}}/>
            <circle cx={px} cy={py} r="1.3" fill="white" opacity=".95"/>
          </g>
        );
      })}
    </svg>
  );
};




/* ═══════════════════════════════════════════════════════
   INCIDENT MARKER CARD
═══════════════════════════════════════════════════════ */
const IncCard = ({ emoji, label, style, delay="0s" }) => (
  <div style={{
    position:"absolute",zIndex:38,
    display:"flex",flexDirection:"column",alignItems:"center",
    animation:`floatY 4.5s ease-in-out ${delay} infinite`,
    ...style,
  }}>
    <div style={{
      position:"relative",width:64,height:64,borderRadius:12,
      background:"linear-gradient(135deg,#b71c1c,#e53935)",
      border:"1.5px solid rgba(255,120,120,.5)",
      boxShadow:"0 0 20px rgba(229,57,53,.75),0 0 45px rgba(229,57,53,.25)",
      display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,
    }}>
      <div style={{
        position:"absolute",inset:-7,borderRadius:14,
        border:"2px solid rgba(229,57,53,.55)",
        animation:`incPing 2.2s ease-out ${delay} infinite`,
      }}/>
      {emoji}
    </div>
    <div style={{
      marginTop:5,padding:"2px 9px",borderRadius:4,fontSize:11,
      fontFamily:'"Bebas Neue",sans-serif',letterSpacing:".2em",
      background:"rgba(5,10,34,.92)",border:"1.5px solid rgba(229,57,53,.45)",
      color:"#e53935",backdropFilter:"blur(6px)",
    }}>{label}</div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   SPARKLINE  (top-right stats card)
═══════════════════════════════════════════════════════ */
const Sparkline = () => (
  <>
    <svg style={{width:"100%",height:48}} viewBox="0 0 170 48" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00c8ff" stopOpacity=".42"/>
          <stop offset="100%" stopColor="#00c8ff" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d="M0,46 L0,36 Q20,28 30,32 T60,20 T90,26 T120,12 T150,9 T170,6 L170,46 Z" fill="url(#spk)"/>
      <path d="M0,36 Q20,28 30,32 T60,20 T90,26 T120,12 T150,9 T170,6" fill="none" stroke="#00c8ff" strokeWidth="1.8"/>
      <circle cx="170" cy="6" r="2.5" fill="#00c8ff"/>
    </svg>
    <div style={{display:"flex",justifyContent:"space-between",padding:"0 1px",marginTop:2}}>
      {["JAN","FEB","MAR","APR","MAY","JUN","SEP"].map(m=>(
        <span key={m} style={{fontSize:7,color:"rgba(140,165,215,.45)",fontWeight:600}}>{m}</span>
      ))}
    </div>
  </>
);

/* ═══════════════════════════════════════════════════════
   BAR CHART
═══════════════════════════════════════════════════════ */
const BarChart = ({ h=44 }) => (
  <div style={{display:"flex",alignItems:"flex-end",gap:2.5,height:h}}>
    {[52,88,34,96,60,82,35,94,48].map((pct,i)=>(
      <div key={i} className="bar" style={{
        flex:1,height:`${pct}%`,
        background:i%2===0?"#e53935":"#00c8ff",
        borderRadius:"2px 2px 0 0",opacity:.88,
        animationDelay:`${i*.065}s`,
      }}/>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════
   ISOMETRIC ILLUSTRATIONS
═══════════════════════════════════════════════════════ */
const IsoPhone = () => (
  <svg viewBox="0 0 120 110" style={{width:"100%",height:"100%"}} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="97" rx="48" ry="13" fill="rgba(0,200,255,.08)" stroke="#00c8ff" strokeWidth=".6"/>
    <rect x="32" y="18" width="30" height="58" rx="5" fill="#090e30" stroke="#00c8ff" strokeWidth="1.2"/>
    <rect x="36" y="25" width="22" height="36" rx="2" fill="#040820"/>
    <line x1="39" y1="32" x2="55" y2="32" stroke="#00c8ff" strokeWidth=".7" opacity=".5"/>
    <line x1="39" y1="37" x2="53" y2="37" stroke="#00c8ff" strokeWidth=".7" opacity=".35"/>
    <line x1="39" y1="42" x2="54" y2="42" stroke="#00c8ff" strokeWidth=".7" opacity=".35"/>
    <polygon points="47,28 42,55 52,55" fill="none" stroke="#e53935" strokeWidth="1.2"/>
    <line x1="47" y1="33" x2="47" y2="49" stroke="#e53935" strokeWidth=".9"/>
    <circle cx="47" cy="52" r="1.1" fill="#e53935"/>
    <circle cx="47" cy="71" r="3" fill="none" stroke="#00c8ff" strokeWidth=".8"/>
    <rect x="62" y="12" width="20" height="26" rx="2" fill="#090e30" stroke="#00c8ff" strokeWidth=".9"
      transform="rotate(-12,72,25)"/>
    <line x1="65" y1="20" x2="77" y2="18" stroke="#e53935" strokeWidth=".9" transform="rotate(-12,72,25)"/>
    <line x1="65" y1="24" x2="75" y2="22" stroke="#00c8ff" strokeWidth=".6" transform="rotate(-12,72,25)"/>
    <circle cx="72" cy="56" r="9" fill="#e53935" stroke="#040820" strokeWidth="1.2"/>
    <text x="72" y="60" textAnchor="middle" fill="white" fontSize="9" fontWeight="800">!</text>
  </svg>
);

const IsoScreen = () => (
  <svg viewBox="0 0 120 110" style={{width:"100%",height:"100%"}} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="97" rx="48" ry="13" fill="rgba(0,200,255,.08)" stroke="#00c8ff" strokeWidth=".6"/>
    <rect x="52" y="78" width="10" height="18" fill="#090e30" stroke="#00c8ff" strokeWidth=".7"/>
    <rect x="38" y="94" width="30" height="4" rx="1" fill="#090e30" stroke="#00c8ff" strokeWidth=".7"/>
    <rect x="12" y="18" width="82" height="60" rx="4" fill="#060820" stroke="#00c8ff" strokeWidth="1.2"/>
    <rect x="15" y="21" width="76" height="54" rx="2" fill="#03060f"/>
    <path d="M24,46 L40,40 L52,52 L48,58 L28,57 Z" fill="none" stroke="#00c8ff" strokeWidth=".8" opacity=".45"/>
    <path d="M60,36 L76,31 L84,43 L80,52 L63,50 Z" fill="none" stroke="#00c8ff" strokeWidth=".8" opacity=".45"/>
    <path d="M40,49 Q58,27 76,43" fill="none" stroke="#00c8ff" strokeWidth="1.1" opacity=".88" strokeDasharray="4 3"/>
    <circle cx="40" cy="49" r="3.5" fill="#e53935"/>
    <circle cx="40" cy="49" r="6"   fill="none" stroke="#e53935" strokeWidth=".7" opacity=".45"/>
    <circle cx="76" cy="43" r="3.5" fill="#e53935"/>
    <circle cx="76" cy="43" r="6"   fill="none" stroke="#e53935" strokeWidth=".7" opacity=".45"/>
  </svg>
);

const IsoAlloc = () => (
  <svg viewBox="0 0 120 110" style={{width:"100%",height:"100%"}} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="97" rx="48" ry="13" fill="rgba(0,200,255,.08)" stroke="#00c8ff" strokeWidth=".6"/>
    <rect x="54" y="54" width="10" height="42" rx="2" fill="#090e30" stroke="#00c8ff" strokeWidth=".7"/>
    <path d="M60,16 L80,28 L80,52 Q80,67 60,75 Q40,67 40,52 L40,28 Z"
      fill="#090e30" stroke="#00c8ff" strokeWidth="1.2"/>
    <path d="M54,44 L59,50 L69,38" fill="none" stroke="#e53935" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="22" cy="76" r="7" fill="#090e30" stroke="#00c8ff" strokeWidth="1"/>
    <path d="M14,86 Q22,79 30,86" fill="none" stroke="#00c8ff" strokeWidth="1"/>
    <circle cx="98" cy="76" r="7" fill="#090e30" stroke="#e53935"  strokeWidth="1"/>
    <path d="M90,86 Q98,79 106,86" fill="none" stroke="#e53935" strokeWidth="1"/>
    <line x1="50" y1="72" x2="30" y2="80" stroke="#00c8ff" strokeWidth=".8" strokeDasharray="3 3" opacity=".7"/>
    <line x1="70" y1="72" x2="90" y2="80" stroke="#e53935" strokeWidth=".8" strokeDasharray="3 3" opacity=".7"/>
    <circle cx="98" cy="56" r="11" fill="#e53935"/>
    <path d="M92,56 L96,60 L105,48" fill="none" stroke="white" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════
   HOW IT WORKS ICONS
═══════════════════════════════════════════════════════ */
const IconReport = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19" stroke="#e53935" strokeWidth="1.5" opacity=".35"/>
    <polygon points="20,10 14,28 26,28" fill="none" stroke="#e53935" strokeWidth="1.6"/>
    <line x1="20" y1="14" x2="20" y2="23" stroke="#e53935" strokeWidth="1.4"/>
    <circle cx="20" cy="26" r="1.2" fill="#e53935"/>
  </svg>
);
const IconCoord = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19" stroke="#00c8ff" strokeWidth="1.5" opacity=".35"/>
    <circle cx="20" cy="20" r="6" stroke="#00c8ff" strokeWidth="1.4"/>
    <line x1="20" y1="3"  x2="20" y2="12" stroke="#00c8ff" strokeWidth="1.4"/>
    <line x1="20" y1="28" x2="20" y2="37" stroke="#00c8ff" strokeWidth="1.4"/>
    <line x1="3"  y1="20" x2="12" y2="20" stroke="#00c8ff" strokeWidth="1.4"/>
    <line x1="28" y1="20" x2="37" y2="20" stroke="#00c8ff" strokeWidth="1.4"/>
  </svg>
);
const IconDeploy = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19" stroke="#e53935" strokeWidth="1.5" opacity=".35"/>
    <path d="M20,8 L28,24 L20,20 L12,24 Z" fill="#e53935" opacity=".8"/>
    <path d="M14,26 L20,32 L26,26" fill="none" stroke="#00c8ff" strokeWidth="1.4"/>
  </svg>
);
const IconMonitor = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19" stroke="#00c8ff" strokeWidth="1.5" opacity=".35"/>
    <rect x="8" y="12" width="24" height="16" rx="2" stroke="#00c8ff" strokeWidth="1.4"/>
    <line x1="14" y1="32" x2="26" y2="32" stroke="#00c8ff" strokeWidth="1.4"/>
    <line x1="20" y1="28" x2="20" y2="32" stroke="#00c8ff" strokeWidth="1.4"/>
    <path d="M12,22 L16,18 L20,22 L24,16 L28,20" fill="none" stroke="#00c8ff" strokeWidth="1.2"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
export default function LandingPage() {
  const nav = useNavigate();
  useEffect(() => { injectStyles(); }, []);

  return (
    <div className="it" style={{background:"#070d2a",color:"#fff",minHeight:"100vh",overflowX:"hidden"}}>

      {/* ══════════════════ NAVBAR ══════════════════ */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:200,
        background:"rgba(4,7,22,.95)",backdropFilter:"blur(14px)",
        borderBottom:"1px solid #1a2a5e",height:60,
        display:"flex",alignItems:"center",
      }}>
        <div style={{maxWidth:1400,width:"100%",margin:"0 auto",padding:"0 40px",
          display:"flex",alignItems:"center",justifyContent:"space-between"}}>

          <div onClick={()=>nav("/")} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="11" stroke="#e53935" strokeWidth="1.6"/>
              <circle cx="13" cy="13" r="4.5" stroke="#e53935" strokeWidth="1.6"/>
              <line x1="13" y1="1"   x2="13" y2="6.5" stroke="#e53935" strokeWidth="1.6"/>
              <line x1="13" y1="19.5" x2="13" y2="25" stroke="#e53935" strokeWidth="1.6"/>
              <line x1="1"  y1="13"  x2="6.5" y2="13" stroke="#e53935" strokeWidth="1.6"/>
              <line x1="19.5" y1="13" x2="25" y2="13" stroke="#e53935" strokeWidth="1.6"/>
            </svg>
            <span className="bb" style={{fontSize:21,letterSpacing:".14em",userSelect:"none"}}>
              <span style={{color:"#e53935"}}>CRISIS</span>
              <span>CHAIN</span>
            </span>
          </div>

          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <button onClick={()=>nav("/login")} style={{
              height:36,padding:"0 24px",fontSize:13,letterSpacing:".08em",cursor:"pointer",
              background:"transparent",border:"1.5px solid rgba(255,255,255,.32)",
              borderRadius:50,color:"#fff",fontFamily:"Inter,sans-serif",fontWeight:600,
              lineHeight:1,transition:"background .18s",whiteSpace:"nowrap",
            }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.08)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              LOGIN
            </button>
            <button onClick={()=>nav("/register")} style={{
              height:36,padding:"0 24px",fontSize:13,letterSpacing:".08em",cursor:"pointer",
              background:"#e53935",border:"1.5px solid #e53935",borderRadius:50,color:"#fff",
              fontFamily:"Inter,sans-serif",fontWeight:700,lineHeight:1,
              boxShadow:"0 0 18px rgba(229,57,53,.45)",transition:"all .18s",whiteSpace:"nowrap",
            }}
            onMouseEnter={e=>{e.currentTarget.style.background="#ff4444";e.currentTarget.style.boxShadow="0 0 28px rgba(229,57,53,.7)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="#e53935";e.currentTarget.style.boxShadow="0 0 18px rgba(229,57,53,.45)";}}>              REGISTER
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════ HERO ══════════════════
          Full-viewport map background. Text is overlaid LEFT.
          All incident/stats elements are positioned over map.
      ══════════════════════════════════════════════ */}
      <section style={{
        position:"relative",height:"100vh",minHeight:680,
        paddingTop:60,overflow:"hidden",
      }}>
        {/* World map */}
        <WorldMap/>
        {/* Arc lines + city nodes */}
        <ArcLines/>

        {/* LEFT gradient — text readable */}
        <div style={{
          position:"absolute",inset:0,zIndex:5,pointerEvents:"none",
          background:"linear-gradient(105deg, #070d2a 38%, rgba(7,13,42,.78) 56%, rgba(7,13,42,.18) 72%, transparent 84%)",
        }}/>

        {/* ── HERO TEXT ─────────────────────────── */}
        <div style={{
          position:"absolute",zIndex:20,
          top:"50%",left:0,
          transform:"translateY(-50%)",
          padding:"0 0 0 5%",width:"44%",
          display:"flex",flexDirection:"column",gap:14,
        }}>
          <span className="bb fu1" style={{color:"#e53935",fontSize:13,letterSpacing:".28em",display:"block"}}>
            CRISISCHAIN
          </span>

          <h1 className="bb fu2" style={{
            fontSize:"clamp(66px,7vw,110px)",
            lineHeight:.9,color:"#fff",letterSpacing:".025em",
          }}>
            REAL-TIME<br/>DISASTER<br/>COORDINATION
          </h1>

          <p className="fu3" style={{
            fontSize:11,letterSpacing:".17em",textTransform:"uppercase",
            color:"rgba(168,195,238,.6)",lineHeight:1.8,maxWidth:310,
          }}>
            BRIDGING THE GAP BETWEEN<br/>VICTIMS AND RESPONDERS
          </p>

        </div>

        {/* ── INCIDENT CARDS (over map, geo-aligned to SVG) ── */}
        {/* ACCIDENT — Turkey / Middle East */}
        <IncCard emoji="🚗" label="ACCIDENT" delay="0s"
          style={{top:"28%", left:"60%"}}/>
        {/* DISASTER — India subcontinent */}
        <IncCard emoji="🏚" label="DISASTER" delay=".9s"
          style={{top:"42%", left:"70%"}}/>
        {/* DISASTER fire — East China / Japan coast */}
        <IncCard emoji="🔥" label="DISASTER" delay="1.8s"
          style={{top:"22%", left:"87%"}}/>

        {/* ── SPARKLINE CARD (top-right) ───────────── */}
        <div className="glass-card" style={{
          position:"absolute",zIndex:40,top:76,right:32,width:200,
          padding:"13px 14px",
          animation:"floatY2 5.2s ease-in-out .6s infinite, borderPulse 4s ease-in-out infinite",
        }}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
            <span style={{color:"#00c8ff",fontSize:12}}>●</span>
            <span style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".15em",
              color:"rgba(190,215,255,.88)"}}>ACTIVE INCIDENTS</span>
          </div>
          <Sparkline/>
        </div>

        {/* ── STATS CARD (map, bottom center) ────── */}
        <div className="glass-card" style={{
          position:"absolute",zIndex:40,
          bottom:"7%",left:"52%",transform:"translateX(-50%)",
          width:290,padding:"14px 16px",
          animation:"floatY 4.6s ease-in-out infinite, borderPulse 4s ease-in-out infinite",
        }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".14em",
              color:"rgba(190,215,255,.88)"}}>ACTIVE INCIDENTS</span>
            <div style={{display:"flex",gap:5}}>
              {[["20","#e53935",true],["2","#ccc",false]].map(([v,c,dot])=>(
                <div key={v} style={{
                  display:"flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:4,
                  background:dot?"rgba(229,57,53,.18)":"rgba(100,130,190,.12)",
                  border:`1px solid ${dot?"rgba(229,57,53,.4)":"rgba(255,255,255,.1)"}`,
                }}>
                  {dot ? <div style={{width:6,height:6,borderRadius:"50%",background:"#e53935"}}/> :
                    <span style={{fontSize:10,color:"#666",fontWeight:700}}>×</span>}
                  <span style={{color:c,fontWeight:700,fontSize:13}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <BarChart h={44}/>
          <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:8}}>
            {[["RESOURCES DEPLOYED","20+","#00c8ff"],["NGOs CONNECTED","5+","#fff"]].map(([k,v,c])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:9,color:"rgba(155,185,225,.5)",textTransform:"uppercase",
                  letterSpacing:".12em",fontWeight:600}}>{k}</span>
                <span className="bb" style={{fontSize:18,color:c,letterSpacing:".05em"}}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── REPORT EMERGENCY BUTTON ─────────────── */}
        <div style={{position:"absolute",zIndex:50,bottom:"28%",left:"68%",transform:"translateX(-50%)"}}>
          <button className="bb" onClick={()=>nav("/report")} style={{
            padding:"18px 52px",fontSize:20,letterSpacing:".12em",cursor:"pointer",
            background:"#e53935",border:"none",borderRadius:50,color:"#fff",
            position:"relative",whiteSpace:"nowrap",transition:"transform .18s",
            animation:"btnGlow 2.4s ease-in-out infinite",
          }}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            <span style={{
              position:"absolute",inset:0,borderRadius:50,
              border:"2px solid rgba(229,57,53,.55)",
              animation:"incPing 2.2s ease-out infinite",pointerEvents:"none",
            }}/>
            REPORT EMERGENCY
          </button>
        </div>

        {/* bottom fade */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:90,
          background:"linear-gradient(to top,#070d2a,transparent)",zIndex:6,pointerEvents:"none"}}/>
      </section>

      {/* ══════════════════ FEATURE CARDS ══════════════════ */}
      <section style={{background:"#0d1535",borderTop:"1px solid #1a2a5e",position:"relative",zIndex:10}}>
        <div style={{display:"flex",maxWidth:"100%"}}>
          {[
            {title:"INSTANT\nREPORTING",       Iso:IsoPhone,  cls:"r"},
            {title:"REAL-TIME\nVISUALIZATION", Iso:IsoScreen, cls:"b"},
            {title:"EFFICIENT\nALLOCATION",    Iso:IsoAlloc,  cls:"b"},
          ].map(({title,Iso,cls},i)=>(
            <div key={i} className={`feat ${cls}`}>
              <h3 className="bb" style={{
                fontSize:"clamp(22px,2.5vw,36px)",lineHeight:1,
                whiteSpace:"pre-line",letterSpacing:".04em",flex:1,
              }}>{title}</h3>
              <div style={{width:112,height:100,flexShrink:0}}><Iso/></div>
            </div>
          ))}
        </div>
        <div className="sec-div"/>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section style={{background:"#070d2a",padding:"80px 0",borderBottom:"1px solid #1a2a5e"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 40px"}}>
          {/* heading */}
          <div style={{textAlign:"center",marginBottom:56}}>
            <span style={{color:"#e53935",fontSize:12,letterSpacing:".25em",
              fontWeight:700,textTransform:"uppercase",display:"block",marginBottom:10}}>
              HOW IT WORKS
            </span>
            <h2 className="bb" style={{fontSize:"clamp(32px,3.8vw,54px)",letterSpacing:".04em"}}>
              SIMPLE. FAST. LIFE-SAVING.
            </h2>
            <div style={{width:56,height:3,background:"#e53935",margin:"18px auto 0",borderRadius:2}}/>
          </div>

          <div style={{display:"flex",background:"#0a1130",borderRadius:16,
            border:"1px solid #1a2a5e",overflow:"hidden"}}>
            {[
              {num:"01",Icon:IconReport,  title:"REPORT",       desc:"Witnesses or victims report incidents instantly via the platform with location, type, and severity.",color:"#e53935"},
              {num:"02",Icon:IconCoord,   title:"COORDINATE",   desc:"CrisisChain connects relevant NGOs, first responders, and agencies in real-time on a shared dashboard.",color:"#00c8ff"},
              {num:"03",Icon:IconDeploy,  title:"DEPLOY",       desc:"Resources are dispatched with optimized routing, live tracking, and automated updates.",color:"#e53935"},
              {num:"04",Icon:IconMonitor, title:"MONITOR",      desc:"All parties monitor the situation live, enabling adaptive response and post-crisis reporting.",color:"#00c8ff"},
            ].map(({num,Icon,title,desc,color},i)=>(
              <div key={i} className="step-card">
                <div className="step-num" style={{borderColor:color,color}}>
                  {num}
                </div>
                <Icon/>
                <h3 className="bb" style={{fontSize:22,letterSpacing:".08em",color}}>{title}</h3>
                <p style={{fontSize:13,color:"rgba(160,185,228,.62)",lineHeight:1.7,maxWidth:220}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ IMPACT STATS ══════════════════ */}
      <section style={{background:"#0a1130",borderBottom:"1px solid #1a2a5e"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 40px"}}>
          <div style={{display:"flex",justifyContent:"center"}}>
            {[
              {n:"10,000+", label:"Incidents Reported",    color:"#e53935"},
              {n:"200+",    label:"NGO Partners",          color:"#00c8ff"},
              {n:"98%",     label:"Response Rate",         color:"#e53935"},
              {n:"50+",     label:"Countries Covered",     color:"#00c8ff"},
            ].map(({n,label,color},i)=>(
              <div key={i} className="stat-badge">
                <span className="bb" style={{fontSize:"clamp(36px,4vw,60px)",color,lineHeight:1}}>{n}</span>
                <span style={{fontSize:12,color:"rgba(155,185,228,.55)",textTransform:"uppercase",
                  letterSpacing:".14em",textAlign:"center"}}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA SECTION ══════════════════ */}
      <section className="cta-sec">
        <div style={{flex:1,minWidth:280}}>
          <span style={{color:"#e53935",fontSize:12,letterSpacing:".24em",fontWeight:700,
            textTransform:"uppercase",display:"block",marginBottom:10}}>READY TO HELP?</span>
          <h2 className="bb" style={{fontSize:"clamp(28px,3.2vw,46px)",letterSpacing:".04em",
            lineHeight:1.05,marginBottom:14}}>
            JOIN THE CRISISCHAIN<br/>NETWORK TODAY
          </h2>
          <p style={{fontSize:13,color:"rgba(155,185,228,.6)",lineHeight:1.7,maxWidth:460}}>
            Whether you're an NGO, first responder, government agency, or concerned citizen —
            CrisisChain empowers everyone to act fast and save lives.
          </p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12,flexShrink:0}}>
          <button className="bb" onClick={()=>nav("/register")} style={{
            padding:"16px 44px",fontSize:18,letterSpacing:".1em",cursor:"pointer",
            background:"#e53935",border:"none",borderRadius:50,color:"#fff",
            boxShadow:"0 0 24px rgba(229,57,53,.55)",transition:"all .18s",whiteSpace:"nowrap",
          }}
          onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)";e.currentTarget.style.boxShadow="0 0 42px rgba(229,57,53,.9)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 0 24px rgba(229,57,53,.55)";}}>
            GET STARTED FREE
          </button>
          <button className="bb" onClick={()=>nav("/about")} style={{
            padding:"16px 44px",fontSize:18,letterSpacing:".1em",cursor:"pointer",
            background:"transparent",border:"1.5px solid rgba(255,255,255,.25)",
            borderRadius:50,color:"#fff",transition:"all .18s",whiteSpace:"nowrap",
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.6)";e.currentTarget.style.background="rgba(255,255,255,.05)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.25)";e.currentTarget.style.background="transparent";}}>
            LEARN MORE
          </button>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer style={{background:"#04071a",borderTop:"1px solid #1a2a5e",padding:"52px 0 32px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 40px"}}>
          <div style={{display:"flex",gap:60,flexWrap:"wrap",marginBottom:44}}>

            {/* Brand */}
            <div style={{flex:"0 0 240px",display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"flex",alignItems:"center",gap:9}}>
                <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
                  <circle cx="13" cy="13" r="11" stroke="#e53935" strokeWidth="1.4"/>
                  <circle cx="13" cy="13" r="4.5" stroke="#e53935" strokeWidth="1.4"/>
                  <line x1="13" y1="1"   x2="13" y2="6.5" stroke="#e53935" strokeWidth="1.4"/>
                  <line x1="13" y1="19.5" x2="13" y2="25" stroke="#e53935" strokeWidth="1.4"/>
                  <line x1="1"  y1="13"  x2="6.5" y2="13" stroke="#e53935" strokeWidth="1.4"/>
                  <line x1="19.5" y1="13" x2="25"  y2="13" stroke="#e53935" strokeWidth="1.4"/>
                </svg>
                <span className="bb" style={{fontSize:18,letterSpacing:".14em"}}>
                  <span style={{color:"#e53935"}}>CRISIS</span>CHAIN
                </span>
              </div>
              <p style={{fontSize:12.5,color:"rgba(155,185,228,.5)",lineHeight:1.7,maxWidth:220}}>
                Real-time crisis coordination connecting victims, responders, and NGOs worldwide.
              </p>
            </div>

            {/* Links */}
            {[
              {title:"PLATFORM", links:["How It Works","Report Incident","Dashboard","API Docs"]},
              {title:"COMPANY",  links:["About Us","Blog","Careers","Press"]},
              {title:"SUPPORT",  links:["Help Center","Contact","Privacy Policy","Terms"]},
            ].map(({title,links})=>(
              <div key={title} className="footer-col" style={{flex:"1 1 140px"}}>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:".2em",
                  color:"rgba(190,215,255,.45)",textTransform:"uppercase",marginBottom:4}}>{title}</span>
                {links.map(l=>(
                  <span key={l} className="footer-link">{l}</span>
                ))}
              </div>
            ))}
          </div>

          <div style={{borderTop:"1px solid #1a2a5e",paddingTop:22,
            display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
            <span style={{fontSize:12,color:"rgba(130,158,210,.38)"}}>
              © 2024 CrisisChain. All rights reserved.
            </span>
            <div style={{display:"flex",gap:20}}>
              {["Privacy","Terms","Cookies"].map(t=>(
                <span key={t} style={{fontSize:12,color:"rgba(130,158,210,.38)",cursor:"pointer",
                  transition:"color .18s"}}
                onMouseEnter={e=>e.currentTarget.style.color="#00c8ff"}
                onMouseLeave={e=>e.currentTarget.style.color="rgba(130,158,210,.38)"}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
