import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { 
  ShieldAlert, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  ChevronLeft
} from 'lucide-react';

export default function AdminLogin() {
  const nav = useNavigate();
  const { login } = useDashboard();
  const [name, setName] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !aadhar.trim() || !password) { setError('Credentials required.'); return; }
    setLoading(true);
    try {
      await login({ name, aadhar, password }, true);
      setLoading(false); 
      nav('/dashboard');
    } catch (err) {
      setLoading(false);
      setError('Admin Authentication Failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-[#E5E5E7] font-inter flex items-center justify-center p-6 selection:bg-red-500 selection:text-white">
      <div className="max-w-[480px] w-full bg-white/5 border border-red-500/20 backdrop-blur-xl p-12 relative animate-slide-up">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
        
        <div className="mb-10 text-center">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-6" />
          <span className="text-[10px] font-mono text-red-500 tracking-[0.5em] uppercase block mb-4">Restricted Access</span>
          <h1 className="font-outfit text-4xl font-black tracking-tighter uppercase leading-none">ADMIN PORTAL</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-white/20 group-focus-within:text-red-500 transition-colors" />
              </div>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ADMIN_USERNAME"
                className="w-full bg-black/50 border border-white/10 px-14 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/40 transition-all font-mono text-sm tracking-widest"
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <ShieldAlert className="h-5 w-5 text-white/20 group-focus-within:text-red-500 transition-colors" />
              </div>
              <input 
                type="text" 
                value={aadhar}
                onChange={(e) => setAadhar(e.target.value)}
                placeholder="ADMIN_AADHAR"
                className="w-full bg-black/50 border border-white/10 px-14 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/40 transition-all font-mono text-sm tracking-widest"
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-white/20 group-focus-within:text-red-500 transition-colors" />
              </div>
              <input 
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ADMIN_PASSWORD"
                className="w-full bg-black/50 border border-white/10 px-14 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/40 transition-all font-mono text-sm tracking-widest"
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
            <div className="p-4 bg-red-500/10 border border-red-500/20 flex items-center gap-4">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-xs font-mono text-red-400 uppercase tracking-widest">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full relative overflow-hidden px-10 py-6 bg-red-600 border border-red-500 hover:bg-red-700 transition-all duration-700 disabled:opacity-50"
          >
            <span className="text-xl font-outfit font-black uppercase tracking-widest text-white">
              {loading ? 'AUTHENTICATING...' : 'AUTHORIZE_ACCESS'}
            </span>
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <Link to="/" className="text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-widest transition-colors flex justify-center items-center gap-2">
                <ChevronLeft size={14} /> BACK TO PUBLIC SITE
            </Link>
        </div>
      </div>
    </div>
  );
}
