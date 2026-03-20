import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Shield, Map, Radio, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'Medical'
  });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted Data:', formData);
    setFormData({ name: '', location: '', type: 'Medical' });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-red-500/30 overflow-x-hidden">
      
      {/* Navbar segment */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-800 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Crisis<span className="text-gray-400">Chain</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#impact" className="hover:text-white transition-colors">Impact</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2"
            >
              Responder Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="max-w-2xl animate-fade-in text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Active Incident Response System
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                Real-time disaster <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-orange-500">
                  coordination.
                </span>
              </h1>
              
              <p className="text-lg text-gray-400 mb-8 max-w-xl leading-relaxed">
                Connect directly with emergency responders, track resources in real-time, and manage crisis workflows through our intelligent unified dashboard.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-white text-slate-900 hover:bg-gray-100 font-semibold py-3.5 px-6 rounded-lg shadow-xl shadow-white/10 hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Go to Command Center <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 24/7 Availability</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> End-to-end Encrypted</div>
              </div>
            </div>

            {/* Right Content - The Form Card */}
            <div className="w-full max-w-md mx-auto lg:ml-auto animate-slide-up animation-delay-200">
              <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Report Emergency</h3>
                  <p className="text-sm text-gray-400">Dispatches directly to the closest available responder teams.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-sm font-medium text-gray-300 block">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 placeholder:text-gray-600 shadow-inner"
                    />
                  </div>

                  {/* Location Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="location" className="text-sm font-medium text-gray-300 block">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Area or Coordinates"
                      className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 placeholder:text-gray-600 shadow-inner"
                    />
                  </div>

                  {/* Type Dropdown */}
                  <div className="space-y-1.5">
                    <label htmlFor="type" className="text-sm font-medium text-gray-300 block">Emergency Type</label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 shadow-inner appearance-none cursor-pointer"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                    >
                      <option value="Medical">Medical</option>
                      <option value="Fire">Fire</option>
                      <option value="Food">Food / Water</option>
                      <option value="Rescue">Search & Rescue</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-semibold py-3.5 px-4 rounded-lg shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">🚨</span> Dispatch Request
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#0B1121] relative border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in animation-delay-200">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Everything you need in a crisis
            </h2>
            <p className="text-lg text-gray-400 relative">
              Built for speed and reliability when every second counts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:bg-[#1e293b]/60 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <Map className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Live Incident Mapping</h3>
              <p className="text-gray-400 leading-relaxed">
                Track active emergencies, responder locations, and safe zones on an interactive, real-time map.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:bg-[#1e293b]/60 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center mb-6 border border-rose-500/20">
                <Shield className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Secure Resource Tracking</h3>
              <p className="text-gray-400 leading-relaxed">
                Manage inventory for food, medical supplies, and rescue equipment with automated status updates.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:bg-[#1e293b]/60 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                <Radio className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Unified Comms</h3>
              <p className="text-gray-400 leading-relaxed">
                Direct communication channels between victims, dispatchers, and field responders instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f172a] border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500" />
            <span className="text-lg font-semibold text-white">Crisis<span className="text-gray-400">Chain</span></span>
          </div>
          <p className="text-sm text-gray-500">
            Empowering communities when it matters most. &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
      
    </div>
  );
}
