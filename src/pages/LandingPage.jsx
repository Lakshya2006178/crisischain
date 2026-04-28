import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Map as MapIcon, 
  Users, 
  AlertTriangle,
  Zap,
  Menu,
  X,
  Radio,
  Terminal,
  Activity,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rotation, setRotation] = useState(0);

  const incidents = [
    { coords: [-74.006, 40.7128], color: '#ef4444' },
    { coords: [139.6917, 35.6895], color: '#3b82f6' },
    { coords: [31.2357, 30.0444], color: '#ef4444' },
    { coords: [-43.1729, -22.9068], color: '#f59e0b' },
    { coords: [77.2090, 28.6139], color: '#3b82f6' },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const rotateInterval = setInterval(() => {
      setRotation(prev => (prev + 0.2) % 360);
    }, 50);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(rotateInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1220] text-gray-200 font-inter overflow-x-hidden selection:bg-teal-500/30 selection:text-teal-400">
      
      {/* ── MOBILE MENU OVERLAY ── */}
      <div className={`
        fixed inset-0 z-[100] bg-[#0B1220] transition-all duration-300 lg:hidden
        ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
      `}>
        <div className="flex flex-col h-full p-6">
            <div className="flex justify-between items-center mb-12 border-b border-[#1F2937] pb-4">
               <div className="flex items-center gap-3">
                 <Shield className="w-6 h-6 text-teal-500" />
                 <span className="font-poppins font-bold text-lg text-gray-100 uppercase tracking-wide">CrisisChain</span>
               </div>
               <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-[#1F2937] rounded-md border border-[#374151]">
                 <X className="w-6 h-6 text-gray-300" />
               </button>
            </div>
           
            <div className="flex flex-col gap-6 flex-1">
               <button onClick={() => scrollToSection('mission')} className="text-xl font-poppins font-semibold text-left text-gray-200">Mission</button>
               <button onClick={() => scrollToSection('capabilities')} className="text-xl font-poppins font-semibold text-left text-gray-200">Capabilities</button>
               <Link to="/report" className="text-xl font-poppins font-semibold text-red-500 mt-4">Report Emergency</Link>
               <Link to="/login" className="text-xl font-poppins font-semibold text-teal-500">Responder Login</Link>
           </div>
        </div>
      </div>

      {/* ── NAV BAR ── */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#0B1220]/90 backdrop-blur-md border-b border-[#1F2937] py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#111827] rounded border border-[#1F2937] flex items-center justify-center">
              <Shield className="w-4 h-4 text-teal-500" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-poppins font-bold text-lg tracking-wide text-gray-100 uppercase">CrisisChain</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-400">
            <button onClick={() => scrollToSection('mission')} className="hover:text-gray-200 transition-colors">Mission</button>
            <button onClick={() => scrollToSection('capabilities')} className="hover:text-gray-200 transition-colors">Capabilities</button>
            <div className="w-px h-4 bg-[#1F2937]" />
            <Link to="/report" className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-2">
              <AlertTriangle size={14} /> Report Incident
            </Link>
            <Link to="/login" className="px-5 py-2 border border-[#1F2937] bg-[#111827] text-gray-200 rounded hover:bg-[#1F2937] transition-all font-poppins">
              Responder Login
            </Link>
          </div>

          <button 
            className="lg:hidden p-2 bg-[#111827] rounded border border-[#1F2937]" 
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-20 px-6 z-10 flex flex-col lg:flex-row max-w-[1200px] mx-auto items-center min-h-[80vh] gap-12">
        <div className="lg:w-1/2 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-500 text-xs font-semibold mb-6">
            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
            System Operational
          </div>
          
          <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-100">
            Professional Emergency Response Coordination
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl font-normal leading-relaxed mb-10 max-w-lg">
            A unified command center for emergency responders, organizations, and citizens to report, track, and resolve crises in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/report" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-poppins font-semibold rounded transition-colors flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Report Emergency
              </Link>
              <Link to="/login" className="px-6 py-3 bg-[#111827] border border-[#1F2937] hover:bg-[#1F2937] text-gray-200 font-poppins font-semibold rounded transition-colors flex items-center justify-center gap-2">
                <Shield className="w-5 h-5 text-gray-400" />
                Responder Access
              </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-[#1F2937] w-full">
            <div>
              <div className="text-2xl font-poppins font-bold text-gray-100">24/7</div>
              <div className="text-xs text-gray-500 uppercase font-semibold mt-1">Monitoring</div>
            </div>
            <div>
              <div className="text-2xl font-poppins font-bold text-teal-500">142</div>
              <div className="text-xs text-gray-500 uppercase font-semibold mt-1">Active Responders</div>
            </div>
            <div>
              <div className="text-2xl font-poppins font-bold text-red-500">8</div>
              <div className="text-xs text-gray-500 uppercase font-semibold mt-1">Live Incidents</div>
            </div>
          </div>
        </div>

        {/* Hero Globe (Reduced Dominance) */}
        <div className="lg:w-1/2 w-full flex justify-center items-center relative h-[400px] lg:h-[500px]">
           <div className="absolute inset-0 flex justify-center items-center opacity-60">
             <ComposableMap 
                projection="geoOrthographic" 
                projectionConfig={{ rotate: [rotation, -15, 0], scale: 180 }}
                className="w-full h-full max-w-[500px] max-h-[500px]"
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#1F2937"
                        stroke="#374151"
                        strokeWidth={0.5}
                        style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                      />
                    ))
                }
                </Geographies>
                {incidents.map((inc, i) => (
                  <Marker key={i} coordinates={inc.coords}>
                    <circle r={3} fill={inc.color} className="animate-pulse" />
                  </Marker>
                ))}
              </ComposableMap>
           </div>
        </div>
      </section>

      {/* ── CAPABILITIES SECTION ── */}
      <section id="capabilities" className="py-24 bg-[#111827] border-y border-[#1F2937]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-3xl font-bold text-gray-100 mb-4">Core Capabilities</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Designed for reliability and speed, providing essential tools for efficient disaster management and response coordination.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0B1220] p-8 rounded-lg border border-[#1F2937] hover:border-[#374151] transition-colors">
               <Radio className="text-teal-500 w-8 h-8 mb-6" />
               <h3 className="font-poppins text-xl font-semibold text-gray-100 mb-3">Live Incident Tracking</h3>
               <p className="text-gray-400 leading-relaxed text-sm">
                 Monitor critical emergencies as they unfold. Get detailed location, severity, and status updates instantly synced across all command stations.
               </p>
            </div>
            <div className="bg-[#0B1220] p-8 rounded-lg border border-[#1F2937] hover:border-[#374151] transition-colors">
               <Users className="text-teal-500 w-8 h-8 mb-6" />
               <h3 className="font-poppins text-xl font-semibold text-gray-100 mb-3">Resource Deployment</h3>
               <p className="text-gray-400 leading-relaxed text-sm">
                 Manage inventory, medical supplies, and response units. Assign teams dynamically based on proximity and incident priority.
               </p>
            </div>
            <div className="bg-[#0B1220] p-8 rounded-lg border border-[#1F2937] hover:border-[#374151] transition-colors">
               <Activity className="text-teal-500 w-8 h-8 mb-6" />
               <h3 className="font-poppins text-xl font-semibold text-gray-100 mb-3">Data Analytics</h3>
               <p className="text-gray-400 leading-relaxed text-sm">
                 Analyze response times and historical data. Make informed decisions to improve disaster preparedness and operational efficiency.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 bg-[#0B1220]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 mb-8 border-b border-[#1F2937] pb-8">
            <div>
               <div className="flex items-center gap-2 mb-4">
                 <Shield className="w-5 h-5 text-gray-400" />
                 <span className="font-poppins font-bold text-gray-200">CrisisChain</span>
               </div>
               <p className="text-gray-500 text-sm max-w-sm">
                 A reliable and secure disaster management platform for emergency response teams.
               </p>
            </div>
            
            <div className="flex gap-16 md:justify-end">
              <div className="space-y-4">
                <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Platform</div>
                <ul className="space-y-3 text-sm text-gray-500">
                  <li><Link to="/login" className="hover:text-gray-300 transition-colors">Responder Login</Link></li>
                  <li><Link to="/report" className="hover:text-gray-300 transition-colors">Report Incident</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Legal</div>
                <ul className="space-y-3 text-sm text-gray-500">
                  <li className="hover:text-gray-300 cursor-pointer transition-colors">Privacy Policy</li>
                  <li className="hover:text-gray-300 cursor-pointer transition-colors">Terms of Service</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-600 font-semibold">
             <span>© 2026 CrisisChain. All rights reserved.</span>
             <span className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-teal-500" /> System Online
             </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
