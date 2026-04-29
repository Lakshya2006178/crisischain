import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertTriangle,
  Zap,
  Activity,
  ChevronLeft,
  Globe,
  Terminal
} from 'lucide-react';

const LIVE_STATS = [
  { label: 'ACTIVE INCIDENTS', value: '24', color: '#ef4444' },
  { label: 'RESPONDERS ONLINE', value: '312', color: '#00F0FF' },
  { label: 'LIVES PROTECTED', value: '10K+', color: '#10b981' },
];

export default function LoginPage() {
  const nav = useNavigate();
  const { login } = useDashboard();
  const [name, setName] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!aadhar.trim() || !/^\d{12}$/.test(aadhar.trim())) { setError('Valid 12-digit Aadhar required.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    setLoading(true);
    try {
      await login({ name, aadhar, password });
      setLoading(false); 
      nav('/alerts');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Authentication Failed. Integrity Check Error.');
    }
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-[#E5E5E7] font-inter overflow-y-auto flex selection:bg-[#00FFCC] selection:text-black">
      
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
        <div className="absolute inset-0 opacity-[0.03] contrast-150 brightness-150 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* ── LEFT PANEL: TACTICAL INFO ── */}
      <div className="hidden lg:flex w-[40%] flex-col justify-center px-16 relative z-10 border-r border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4 group mb-16">
          <div className="w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:border-[#00FFCC]/40 transition-all duration-500">
            <Shield className="w-6 h-6 text-[#00FFCC] group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col gap-0 leading-none">
            <span className="font-outfit font-black text-2xl tracking-tighter uppercase">CRISISCHAIN</span>
            <span className="text-[10px] font-mono text-blue-400 tracking-[0.4em] opacity-60 uppercase">Responder Network v5.4</span>
          </div>
        </Link>

        {/* Tactical Heading */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6 animate-fade-in">
            <div className="h-[1px] w-8 bg-[#00FFCC]/40" />
            <span className="text-[9px] font-mono tracking-[0.5em] text-[#00FFCC] uppercase">Auth_Session_Secure</span>
          </div>
          <h1 className="font-outfit text-6xl font-black leading-[0.9] tracking-tighter mb-8 uppercase">
            COMMAND<br />
            <span className="bg-gradient-to-r from-[#00FFCC] via-white to-white/40 bg-clip-text text-transparent italic">CENTER_ACCESS</span>
          </h1>
          <p className="text-white/40 text-lg font-light leading-relaxed max-w-sm">
            Access the centralized crisis management dashboard to coordinate real-time response efforts.
          </p>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 gap-4 mb-12">
          {LIVE_STATS.map(({label, value, color}) => (
            <div key={label} className="p-6 bg-white/5 border border-white/5 backdrop-blur-xl flex flex-col items-start gap-1 group hover:border-[#00FFCC]/20 transition-all">
              <span className="text-[10px] font-mono text-white/20 tracking-widest uppercase">{label}</span>
              <span className="text-4xl font-outfit font-black tracking-tighter text-white group-hover:text-[#00FFCC] transition-colors">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 text-white/20">
          <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest uppercase">System_Status: Operational</span>
        </div>
      </div>

      {/* ── RIGHT PANEL: LOGIN FORM ── */}
      <div className="flex-1 flex items-start lg:items-center justify-center p-6 md:p-12 relative z-10 pt-24 lg:pt-8 min-h-screen">
        <div className="max-w-[480px] w-full animate-slide-up">
          
          <div className="mb-12">
            <Link to="/" className="lg:hidden flex items-center gap-2 text-[10px] font-mono text-[#00FFCC] uppercase tracking-widest mb-8">
              <ChevronLeft className="w-4 h-4" /> Back to Intelligence
            </Link>
            <span className="text-[9px] font-mono text-blue-400 tracking-[0.6em] uppercase block mb-4">Login Portal</span>
            <h2 className="font-outfit text-5xl font-black tracking-tighter uppercase leading-none mb-4">
              WELCOME_BACK
            </h2>
            <p className="text-white/40 font-light">Access your operational dashboard to manage ongoing incidents.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/20 group-focus-within:text-[#00FFCC] transition-colors" />
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="USERNAME"
                  className="w-full bg-white/5 border border-white/5 backdrop-blur-xl px-14 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00FFCC]/40 focus:bg-white/[0.08] transition-all font-mono text-sm tracking-widest"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-white/20 group-focus-within:text-[#00FFCC] transition-colors" />
                </div>
                <input 
                  type="text" 
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value)}
                  placeholder="12-DIGIT AADHAR"
                  className="w-full bg-white/5 border border-white/5 backdrop-blur-xl px-14 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00FFCC]/40 focus:bg-white/[0.08] transition-all font-mono text-sm tracking-widest"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/20 group-focus-within:text-[#00FFCC] transition-colors" />
                </div>
                <input 
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="PASSWORD"
                  className="w-full bg-white/5 border border-white/5 backdrop-blur-xl px-14 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00FFCC]/40 focus:bg-white/[0.08] transition-all font-mono text-sm tracking-widest"
                />
                <button 
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute inset-y-0 right-5 flex items-center text-white/20 hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 flex items-center gap-4 animate-fade-in">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-xs font-mono text-red-400 uppercase tracking-widest">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 border flex items-center justify-center transition-all ${remember ? 'border-[#00FFCC] bg-[#00FFCC]/10' : 'border-white/10 bg-white/5 group-hover:border-white/20'}`}>
                  {remember && <div className="w-2 h-2 bg-[#00FFCC]" />}
                </div>
                <input type="checkbox" className="hidden" checked={remember} onChange={() => setRemember(!remember)} />
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Keep me signed in</span>
              </label>
              <button type="button" className="text-[10px] font-mono text-blue-400 hover:text-[#00FFCC] transition-colors uppercase tracking-widest">
                Forgot_Passcode?
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full group relative overflow-hidden px-10 py-6 bg-white/5 border border-[#00FFCC]/20 hover:bg-[#00FFCC] transition-all duration-700 disabled:opacity-50"
            >
              <div className="relative z-10 flex items-center justify-center gap-4">
                <span className={`text-xl font-outfit font-black uppercase tracking-widest transition-colors duration-700 ${loading ? 'text-white/40' : 'group-hover:text-black text-[#00FFCC]'}`}>
                  {loading ? 'AUTHENTICATING...' : 'ENTER LOGIN'}
                </span>
                {!loading && <ArrowRight className="w-6 h-6 text-[#00FFCC] group-hover:text-black transition-colors" />}
              </div>
              <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out hidden" />
            </button>
          </form>

          <div className="mt-12 pt-12 border-t border-white/5">
             <div className="grid grid-cols-3 gap-6 mb-12">
                {['GOOGLE', 'GOV_ID', 'AGENCY_PORT'].map(method => (
                  <button key={method} className="py-4 bg-white/5 border border-white/5 hover:border-white/20 transition-all text-[8px] font-mono text-white/40 tracking-widest uppercase">
                    {method}
                  </button>
                ))}
             </div>

             <p className="text-center text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
               New responder? <Link to="/register" className="text-[#00FFCC] hover:underline">Create Account</Link>
             </p>
          </div>
        </div>
      </div>

    </div>
  );
}
