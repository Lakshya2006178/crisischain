import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Activity, 
  Map as MapIcon, 
  Users, 
  BarChart3, 
  ArrowRight, 
  AlertTriangle,
  Zap,
  Globe,
  Bell,
  Menu,
  X,
  Target,
  Plus,
  Clock,
  Layers,
  Crosshair,
  Terminal,
  Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker,
  Line
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [incidents, setIncidents] = useState([
    { coords: [-74.006, 40.7128], type: 'CRITICAL', label: 'Cyclone – Coastal Zone 4', time: '2 min ago', color: '#ef4444' },
    { coords: [139.6917, 35.6895], type: 'DISPATCHED', label: 'Fire – Industrial Sector B', time: '5 min ago', color: '#3b82f6' },
    { coords: [31.2357, 30.0444], type: 'LIVE', label: 'Flood – River Valley', time: '1 min ago', color: '#ef4444' },
    { coords: [-43.1729, -22.9068], type: 'CRITICAL', label: 'Tectonic Alert – Sector G', time: '12 min ago', color: '#ef4444' },
    { coords: [77.2090, 28.6139], type: 'MONITORING', label: 'Heatwave – Central Hub', time: 'Just now', color: '#3b82f6' },
  ]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    // Auto-rotation loop
    const rotateInterval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 50);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(rotateInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#08080A] text-[#E5E5E7] font-inter overflow-x-hidden selection:bg-[#00FFCC] selection:text-black">
      
      {/* ── AMBIENT MESH BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[160px] opacity-[0.1] bg-blue-500 transition-transform duration-1000 ease-out"
          style={{ 
            transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)`,
          }}
        />
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.1] bg-blue-600 animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full blur-[180px] opacity-[0.05] bg-red-900" />
        
        {/* Fine Grain Texture */}
        <div className="absolute inset-0 opacity-[0.03] contrast-150 brightness-150 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* ── NAV BAR (GLASS) ── */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? 'bg-black/20 backdrop-blur-3xl border-b border-white/5 py-3' : 'bg-transparent py-8'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:border-[#00FFCC]/40 transition-all duration-500">
              <Shield className="w-5 h-5 text-[#00FFCC] group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col gap-0 leading-none">
              <span className="font-outfit font-black text-xl tracking-tighter uppercase">CRISISCHAIN</span>
              <span className="text-[9px] font-mono text-blue-400 tracking-[0.4em] opacity-60">TACTICAL_CONTROL_v5.4</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-12 text-[9px] font-mono uppercase tracking-[0.4em] font-bold text-white/40">
            <div className="flex items-center gap-2 text-blue-400">
               <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
               SYSTEM ONLINE
            </div>
            <div className="flex items-center gap-2 text-red-400">
               <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ef4444]" />
               INCIDENT FEED ACTIVE
            </div>
            <div className="h-4 w-[1px] bg-white/10 mx-4" />
            <Link to="/login" className="px-6 py-2 border border-blue-500/30 hover:bg-blue-500/10 bg-white/5 backdrop-blur-xl transition-all text-blue-400">AGENCY_LOGIN</Link>
          </div>

          <button className="lg:hidden text-white/60" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* ── ASYMMETRIC HERO SECTION ── */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 px-8 z-10">
        <div className="max-w-[1400px] mx-auto w-full grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Narrative */}
          <div className="lg:col-span-7 flex flex-col items-start pt-12">
            <div className="flex items-center gap-4 mb-12 animate-fade-in">
              <div className="h-[1px] w-12 bg-[#00FFCC]/40" />
              <span className="text-[9px] font-mono tracking-[0.5em] text-[#00FFCC] uppercase">Planetary Crisis Orchestration</span>
            </div>
            
            <h1 className="font-outfit text-[6vw] lg:text-[100px] font-black leading-[0.85] tracking-tighter mb-12 animate-slide-up text-white">
              REAL-TIME <br />
              <span className="text-white/10 stroke-text outline-white/20">DISASTER</span> <br />
              <span className="bg-gradient-to-r from-[#00FFCC] via-white to-white/40 bg-clip-text text-transparent italic">COORDINATION</span>
            </h1>
            
            <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-xl mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Real-time coordination across hospitals, fire brigades, and emergency response units — powered by live incident data.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <Link to="/report" className="relative group px-10 py-5 bg-red-600/10 border border-red-500/40 hover:bg-red-600/20 transition-all duration-500 flex items-center gap-4">
                  <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[8px] font-mono text-white/60 uppercase">Priority_Level_1</span>
                    <span className="text-xl font-outfit font-black uppercase tracking-tight">🚨 Report Emergency</span>
                  </div>
                </Link>

                <Link to="/dashboard" className="px-10 py-5 bg-blue-600/10 border border-blue-500/40 hover:bg-blue-600/20 transition-all duration-500 flex items-center gap-4">
                  <Shield className="w-6 h-6 text-blue-500" />
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[8px] font-mono text-white/60 uppercase">Command_Access</span>
                    <span className="text-xl font-outfit font-black uppercase tracking-tight text-blue-400">🛰 Access Command Center</span>
                  </div>
                </Link>
            </div>
          </div>

          {/* Right Floating Intelligence */}
          <div className="lg:col-span-5 h-[750px] relative mt-12 lg:mt-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="absolute inset-0 bg-blue-600/[0.02] backdrop-blur-3xl border border-white/10 rounded-[40px] flex items-center justify-center overflow-hidden">
               {/* Radar Sweep Effect */}
               <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-transparent w-[200%] h-[200%] -top-1/2 -left-1/2 animate-radar-sweep origin-center" />
               </div>

               {/* UI Overlays */}
               <div className="absolute top-10 left-10 p-6 bg-black/40 border border-blue-500/20 backdrop-blur-3xl z-40 max-w-[200px]">
                  <div className="text-[10px] font-mono text-blue-400 uppercase mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    Live_Telemetry
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-white/5 pb-2">
                      <span className="text-[8px] font-mono text-white/40">LATENCY</span>
                      <span className="text-xs font-outfit text-white">12MS</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-white/5 pb-2">
                      <span className="text-[8px] font-mono text-white/40">NODES</span>
                      <span className="text-xs font-outfit text-white">405 ACTIVE</span>
                    </div>
                  </div>
               </div>

               <div className="absolute bottom-10 right-10 p-6 bg-black/40 border border-red-500/20 backdrop-blur-3xl z-40 max-w-[240px]">
                  <div className="text-[10px] font-mono text-red-400 uppercase mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    CRITICAL_ALERTS
                  </div>
                  <div className="space-y-4 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                    {incidents.filter(i => i.type === 'CRITICAL' || i.type === 'LIVE').map((inc, i) => (
                      <div key={i} className="group cursor-pointer hover:bg-white/5 p-2 transition-all">
                        <div className="text-[8px] font-mono text-red-500 mb-1">{inc.time.toUpperCase()}</div>
                        <div className="text-[10px] font-outfit font-bold text-white uppercase">{inc.label}</div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* BIG Globe Node */}
               <div 
                  className={`relative cursor-crosshair transition-all duration-700 ${isZoomed ? 'scale-150' : 'scale-110'}`}
                  onClick={() => setIsZoomed(!isZoomed)}
               >
                  <div className="absolute inset-[-60px] border border-blue-500/10 rounded-full animate-spin-slow" />
                  <div className="absolute inset-[-20px] border border-white/5 rounded-full animate-reverse-spin" />
                  <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-3xl" />
                  
                  <div className="w-[450px] h-[450px] relative z-20">
                    <ComposableMap 
                      projection="geoOrthographic" 
                      projectionConfig={{ rotate: [rotation, -15, 0], scale: 160 }}
                      className="w-full h-full opacity-90 drop-shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                    >
                      <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                          geographies.map((geo) => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill="rgba(15, 23, 42, 0.4)"
                              stroke="rgba(59, 130, 246, 0.3)"
                              strokeWidth={0.5}
                              style={{
                                default: { outline: "none" },
                                hover: { fill: "rgba(59, 130, 246, 0.1)", outline: "none" },
                                pressed: { outline: "none" },
                              }}
                            />
                          ))
                      }
                      </Geographies>
                      
                      {/* Interactive Markers */}
                      {incidents.map((inc, i) => (
                        <Marker 
                          key={i} 
                          coordinates={inc.coords}
                          onMouseEnter={() => setHoveredMarker(inc)}
                          onMouseLeave={() => setHoveredMarker(null)}
                        >
                          <circle r={hoveredMarker === inc ? 6 : 4} fill={inc.color} className="animate-pulse shadow-lg cursor-pointer" />
                          <circle r={12} fill={inc.color} className="animate-ping opacity-20" />
                          {hoveredMarker === inc && (
                            <g className="pointer-events-none">
                              <rect x={10} y={-40} width={160} height={50} fill="rgba(0,0,0,0.8)" stroke={inc.color} strokeWidth={1} rx={4} />
                              <text x={20} y={-25} fill="white" fontSize={10} fontWeight="bold" fontFamily="Outfit">{inc.label.toUpperCase()}</text>
                              <text x={20} y={-12} fill={inc.color} fontSize={8} fontWeight="black" fontFamily="JetBrains Mono">{inc.type} / {inc.time}</text>
                            </g>
                          )}
                        </Marker>
                      ))}

                      {/* Moving Signals (Bezier Dots) */}
                      <Marker coordinates={[rotation - 20, 45]}>
                         <circle r={1.5} fill="#3b82f6" />
                         <path d="M -10 -10 Q 0 -30 10 -10" stroke="#3b82f6" fill="none" strokeWidth={0.5} opacity={0.3} className="animate-pulse" />
                      </Marker>
                    </ComposableMap>
                  </div>
               </div>

               {/* Bottom Telemetry HUD */}
               <div className="absolute bottom-10 left-10 right-10 grid grid-cols-2 gap-8">
                  <div className="p-4 bg-white/5 border border-white/5 backdrop-blur-xl">
                    <div className="text-[8px] font-mono text-white/20 uppercase mb-2">Zone_Alpha_Telemetry</div>
                    <div className="h-1 bg-white/10 w-full overflow-hidden">
                      <div className="h-full bg-[#00FFCC] w-[70%] animate-pulse" />
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/5 backdrop-blur-xl">
                    <div className="text-[8px] font-mono text-white/20 uppercase mb-2">Cortex_Processing</div>
                    <div className="text-xs font-outfit font-black text-[#00FFCC]">OPTIMAL</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EDITORIAL INTEL SECTION ── */}
      <section id="intel" className="py-40 px-8 relative z-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-32 max-w-4xl">
            <span className="text-[9px] font-mono text-[#00FFCC] tracking-[0.6em] uppercase block mb-8">Structural_Modulars</span>
            <h2 className="font-outfit text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              THE <span className="text-white/20 stroke-text">FUTURE</span> IS <br />
              NOT DISASTER.
            </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4 p-12 bg-white/5 border border-white/5 backdrop-blur-3xl transform hover:-translate-y-4 transition-all duration-700">
               <Zap className="text-[#00FFCC] w-12 h-12 mb-12" />
               <h3 className="font-outfit text-3xl font-black mb-6 uppercase">Autonomous Triage</h3>
               <p className="text-white/40 font-light text-sm leading-relaxed mb-12">
                  AI-led threat assessment protocols that bypass human latency for immediate deployment in critical zones.
               </p>
               <div className="text-[9px] font-mono text-[#00FFCC]/40 tracking-widest leading-none">THREAT_INTEL_V5.0</div>
            </div>

            <div className="lg:col-span-8 grid md:grid-cols-2 gap-12">
               <div className="p-12 bg-white/5 border border-white/5 backdrop-blur-3xl mt-24">
                  <Compass className="text-[#00FFCC] w-12 h-12 mb-12" />
                  <h3 className="font-outfit text-3xl font-black mb-6 uppercase text-white/60">Planetary Registry</h3>
                  <p className="text-white/30 font-light text-sm leading-relaxed">
                    A decentralized ledger of global resources, synchronized across satellite networks with zero downtime.
                  </p>
               </div>
               <div className="p-12 border border-white/10 backdrop-blur-3xl">
                  <Terminal className="text-[#00FFCC] w-12 h-12 mb-12" />
                  <h3 className="font-outfit text-3xl font-black mb-6 uppercase">Cortex Visualization</h3>
                  <p className="text-white/40 font-light text-sm leading-relaxed">
                    A multi-dimensional mission-critical HUD displaying real-time asset flows and predictive vectors.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ASYMMETRIC STATS LAYER ── */}
      <section id="nodes" className="py-40 relative px-8 bg-white/[0.01]">
         <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
               <div className="absolute inset-0 bg-[#00FFCC]/5 blur-[120px] rounded-full" />
               <div className="relative z-10 border border-white/5 bg-white/5 backdrop-blur-3xl p-16">
                  <div className="grid grid-cols-2 gap-16">
                     <div className="space-y-4">
                        <div className="text-[9px] font-mono text-[#00FFCC] tracking-widest uppercase">Resolved</div>
                        <div className="text-6xl font-outfit font-black tracking-tighter">1,452</div>
                     </div>
                     <div className="space-y-4">
                        <div className="text-[9px] font-mono text-[#00FFCC] tracking-widest uppercase">Nodes</div>
                        <div className="text-6xl font-outfit font-black tracking-tighter">120</div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="max-w-md">
               <h3 className="font-outfit text-4xl font-black mb-8 uppercase tracking-tighter">Unrivaled Network Density</h3>
               <p className="text-white/40 font-light leading-relaxed mb-12 text-lg">
                  Every node in the CrisisChain grid is an active sentinel, scanning for structural anomalies before they manifest as catastrophe.
               </p>
               <div className="flex gap-4">
                  <div className="w-12 h-[1px] bg-[#00FFCC] mt-3" />
                  <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Grid_Auth: Verified</span>
               </div>
            </div>
         </div>
      </section>

      {/* ── THE CALL TO ACTION VOID ── */}
      <section className="py-60 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00FFCC]/5 to-transparent opacity-40 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
          <h2 className="font-outfit text-6xl md:text-[120px] font-black leading-[0.8] mb-16 tracking-tighter uppercase grayscale opacity-30 group hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
            THE<br />FUTURE<br />IS_SAFE
          </h2>
          <Link to="/register" className="inline-block px-16 py-8 bg-white/5 backdrop-blur-3xl border border-[#00FFCC]/20 text-[#00FFCC] font-outfit font-black text-2xl uppercase tracking-widest hover:bg-[#00FFCC] hover:text-black hover:border-transparent transition-all duration-700 shadow-[0_0_60px_rgba(0,255,204,0.1)]">
            Join_The_Chain
          </Link>
        </div>
      </section>

      {/* ── MINIMALIST CYBER FOOTER ── */}
      <footer className="py-20 px-8 border-t border-white/5 relative z-10 bg-[#08080A]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2">
               <span className="font-outfit font-black text-2xl tracking-tighter uppercase block mb-8">CrisisChain</span>
               <p className="text-white/20 text-xs font-light max-w-sm leading-relaxed mb-12">
                 Planetary response orchestration through atmospheric computing and structural intelligence.
               </p>
               <div className="flex gap-12 text-[9px] font-mono text-white/30 tracking-[0.4em]">
                  <span>V5.0.1</span>
                  <span>NODE_G_SYNCED</span>
                  <span>SECURE_CHNL</span>
               </div>
            </div>
            
            <div className="space-y-6">
              <div className="text-[9px] font-mono text-white/40 tracking-widest uppercase mb-4">Tactical</div>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/60">
                <li><Link to="/alerts" className="hover:text-[#00FFCC] transition-colors">Alert_Feed</Link></li>
                <li><Link to="/dashboard" className="hover:text-[#00FFCC] transition-colors">Cortex_Link</Link></li>
                <li><Link to="/dashboard" className="hover:text-[#00FFCC] transition-colors">Satellite_HUD</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="text-[9px] font-mono text-white/40 tracking-widest uppercase mb-4">Command</div>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/60">
                <li><Link to="/login" className="hover:text-[#00FFCC] transition-colors">Auth_Port</Link></li>
                <li className="hover:text-[#00FFCC] cursor-pointer transition-colors">Legal_Ops</li>
                <li className="hover:text-[#00FFCC] cursor-pointer transition-colors">Partner_Grid</li>
              </ul>
            </div>
          </div>
          
          <div className="h-[1px] w-full bg-white/5 mb-8" />
          <div className="text-[8px] font-mono text-white/10 uppercase tracking-[0.8em] text-center">
             © 2026 CrisisChain // THE_SOVEREIGN_OBSERVER
          </div>
        </div>
      </footer>

      {/* Global CSS for Stroke Text */}
      <style dangerouslySetInnerHTML={{ __html: `
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255,255,255,0.4);
          text-stroke: 1px rgba(255,255,255,0.4);
          color: transparent;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-reverse-spin {
          animation: reverse-spin 15s linear infinite;
        }
        .animate-radar-sweep {
          animation: radar-sweep 6s linear infinite;
        }
      `}} />
    </div>
  );
};

export default LandingPage;
