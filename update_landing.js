const fs = require('fs');
const content = "import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Zap, Map as MapIcon, BarChart3, Users, AlertTriangle } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] text-white font-sans overflow-x-hidden relative\">
      {/* Navbar */}
      <nav className=\"fixed w-full z-50 top-0 border-b border-white/10 bg-white/10 backdrop-blur-lg\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
          <div className=\"flex justify-between items-center h-20\">
            <div className=\"flex items-center space-x-2\">
              <Shield className=\"h-8 w-8 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]\" />
              <span className=\"text-2xl font-bold tracking-widest text-white\">
                CRISIS<span className=\"text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]\">CHAIN</span>
              </span>
            </div>
            <div className=\"flex space-x-6 items-center\">
              <button
                onClick={() => navigate('/login')}
                className=\"px-6 py-2.5 rounded-lg text-sm font-semibold text-white border border-white/20 hover:border-white/50 transition-colors backdrop-blur-sm bg-white/5\"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className=\"px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] transition-all\"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className=\"relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full\">
          <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-16 items-center\">
            
            {/* Left side: Text Block */}
            <div className=\"flex flex-col items-start space-y-8 animate-fade-in-up\">
              <div className=\"inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1.5\">
                <span className=\"relative flex h-2 w-2\">
                  <span className=\"animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75\"></span>
                  <span className=\"relative inline-flex rounded-full h-2 w-2 bg-red-500\"></span>
                </span>
                <span className=\"text-xs font-bold tracking-widest text-red-400 uppercase\">
                  CRISISCHAIN
                </span>
              </div>

              <h1 className=\"text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] uppercase tracking-tight\">
                COORDINATING <br />
                <span className=\"text-red-500 bg-clip-text drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]\">
                  HOPE
                </span> <br />
                IN REAL-TIME
              </h1>

              <p className=\"text-xl lg:text-2xl text-blue-100/70 font-light max-w-xl border-l-4 border-blue-500/50 pl-6\">
                Bridging the gap between victims and responders with precision and speed.
              </p>
            </div>

            {/* Right side: Map Visual */}
            <div className=\"relative w-full h-[500px] lg:h-[600px] bg-gradient-to-tr from-[#0a1128] to-[#122b53] rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(14,30,64,0.8)] overflow-hidden flex items-center justify-center\">
              
              {/* Fake Map Elements */}
              <div className=\"absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 to-transparent mix-blend-screen\"></div>
              {/* Connecting lines SVG */}
              <svg className=\"absolute inset-0 w-full h-full stroke-blue-500/20 stroke-[1.5]\" fill=\"none\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"none\">
                <path d=\"M20,50 Q40,20 60,60 T90,30\" className=\"opacity-50\" />
                <path d=\"M10,80 Q30,50 80,70\" className=\"opacity-50\" />
              </svg>

              {/* Central Glowing CTA on Map */}
              <button className=\"absolute z-20 group top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:scale-105 transition-transform duration-300\">
                <div className=\"absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse\"></div>
                <div className=\"relative flex items-center space-x-3 px-8 py-4 bg-black rounded-full leading-none text-white font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(255,0,0,0.6)]\">
                  <AlertTriangle className=\"w-5 h-5 text-red-500\" />
                  <span>Report Emergency</span>
                </div>
              </button>

              {/* Floating Alert Marker 1 */}
              <div className=\"absolute top-[20%] left-[15%] flex flex-col items-center\">
                <span className=\"relative flex h-4 w-4 mb-2\">
                  <span className=\"animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75\"></span>
                  <span className=\"relative inline-flex rounded-full h-4 w-4 bg-red-600 border-2 border-white/20\"></span>
                </span>
                <div className=\"bg-red-950/80 border border-red-500/50 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur whitespace-nowrap\">
                  ACCIDENT
                </div>
              </div>

              {/* Floating Alert Marker 2 */}
              <div className=\"absolute bottom-[30%] right-[20%] flex flex-col items-center\">
                <span className=\"relative flex h-5 w-5 mb-2\">
                  <span className=\"animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75\"></span>
                  <span className=\"relative inline-flex rounded-full h-5 w-5 bg-red-600 border-2 border-white/20\"></span>
                </span>
                <div className=\"bg-red-950/80 border border-red-500/50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur whitespace-nowrap\">
                  DISASTER
                </div>
              </div>

              {/* Floating Alert Marker 3 */}
              <div className=\"absolute top-[40%] right-[30%] flex flex-col items-center\">
                <span className=\"relative flex h-3 w-3 mb-2\">
                  <span className=\"animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 lg:hidden\"></span>
                  <span className=\"relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white/20\"></span>
                </span>
                <div className=\"bg-red-900/60 border border-red-500/30 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur whitespace-nowrap\">
                  ACTIVE INCIDENT
                </div>
              </div>

              {/* Floating Card: Active Incidents */}
              <div className=\"absolute top-6 right-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 p-4 w-48 shadow-2xl animate-[translateY_4s_ease-in-out_infinite_alternate]\" style={{ animation: 'translateY 4s ease-in-out infinite alternate' }}>
                <h4 className=\"text-[10px] font-bold text-blue-300 tracking-wider mb-3\">ACTIVE INCIDENTS</h4>
                <div className=\"flex items-end justify-between space-x-1 h-12\">
                  {[40, 70, 45, 90, 65, 30, 80].map((h, i) => (
                    <div key={i} className=\"w-full bg-blue-500/40 rounded-t-sm transition-all\" style={{ height: h + '%' }}></div>
                  ))}
                </div>
              </div>

              {/* Floating Card: Resources */}
              <div className=\"absolute bottom-6 left-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 p-4 shadow-2xl animate-[translateY_5s_ease-in-out_infinite_alternate-reverse]\" style={{ animation: 'translateY 5s ease-in-out infinite alternate-reverse' }}>
                <div className=\"flex items-center space-x-3\">
                  <div className=\"bg-emerald-500/20 p-2 rounded-lg text-emerald-400\">
                    <Users className=\"w-5 h-5\" />
                  </div>
                  <div>
                    <h4 className=\"text-xl font-bold leading-none text-white\">20+</h4>
                    <p className=\"text-[10px] text-emerald-300/80 font-bold uppercase mt-1\">NGOs Connected</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className=\"py-24 relative z-10\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
          <div className=\"grid grid-cols-1 md:grid-cols-3 gap-8\">
            
            {/* Feature 1 */}
            <div className=\"bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 group\">
              <div className=\"w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform\">
                <Zap className=\"w-7 h-7 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]\" />
              </div>
              <h3 className=\"text-xl font-bold uppercase tracking-wider mb-4 text-white\">Instant Reporting</h3>
              <p className=\"text-blue-100/60 leading-relaxed font-light\">
                Submit emergency signals seamlessly. Our intelligent platform immediately routes crucial information to the nearest accessible responders.
              </p>
            </div>

            {/* Feature 2 */}
            <div className=\"bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 group\">
              <div className=\"w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform\">
                <MapIcon className=\"w-7 h-7 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]\" />
              </div>
              <h3 className=\"text-xl font-bold uppercase tracking-wider mb-4 text-white\">Real-Time Visualization</h3>
              <p className=\"text-blue-100/60 leading-relaxed font-light\">
                Interactive dynamic mapping of all active zones, displaying resources, dangers, and safe paths with live pinpoint precision.
              </p>
            </div>

            {/* Feature 3 */}
            <div className=\"bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 group\">
              <div className=\"w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform\">
                <BarChart3 className=\"w-7 h-7 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]\" />
              </div>
              <h3 className=\"text-xl font-bold uppercase tracking-wider mb-4 text-white\">Efficient Allocation</h3>
              <p className=\"text-blue-100/60 leading-relaxed font-light\">
                AI-driven analytics help command centers deploy responders, medical aid, and supplies exactly where they are needed most.
              </p>
            </div>

          </div>
        </div>
      </section>
      
      {/* Required CSS Animations to head */}
      <style dangerouslySetInnerHTML={{__html: \
        @keyframes translateY {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      \}} />
    </div>
  );
};

export default LandingPage;
";
fs.writeFileSync('src/pages/LandingPage.jsx', content);
