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
  ChevronLeft
} from 'lucide-react';

export default function LoginPage() {
  const nav = useNavigate();
  const { login } = useDashboard();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    setLoading(true);
    try {
      await login(email, password);
      setLoading(false);
      nav('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || err.message || 'Authentication Failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-gray-200 font-inter flex flex-col md:flex-row">
      
      {/* ── LEFT PANEL: BRANDING ── */}
      <div className="hidden md:flex w-1/3 bg-[#111827] border-r border-[#1F2937] flex-col p-12">
        <Link to="/" className="flex items-center gap-3 mb-auto">
          <Shield className="w-8 h-8 text-teal-500" />
          <span className="font-poppins font-bold text-2xl tracking-wide text-gray-100 uppercase">CrisisChain</span>
        </Link>
        
        <div className="mb-auto">
          <h1 className="font-poppins text-4xl font-bold text-gray-100 mb-6">
            Responder <br/> Access Portal
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
            Sign in to coordinate emergency responses, manage resources, and access live situational data.
          </p>
        </div>
        
        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
          Secure Connection Established
        </div>
      </div>

      {/* ── RIGHT PANEL: LOGIN FORM ── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="max-w-[440px] w-full">
          
          <div className="mb-10">
            <Link to="/" className="md:hidden flex items-center gap-2 text-sm text-teal-500 font-semibold mb-8">
              <ChevronLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h2 className="font-poppins text-3xl font-bold text-gray-100 mb-3">
              Sign In
            </h2>
            <p className="text-gray-400">Welcome back. Enter your credentials to access the command center.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.org"
                    className="w-full bg-[#111827] border border-[#1F2937] rounded px-12 py-3 text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all font-inter text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input 
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#111827] border border-[#1F2937] rounded px-12 py-3 text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all font-inter text-sm"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-[#374151] bg-[#111827] text-teal-500 focus:ring-teal-500/50 focus:ring-offset-[#0B1220]" 
                  checked={remember} 
                  onChange={() => setRemember(!remember)} 
                />
                <span className="text-sm text-gray-400 font-medium">Remember me</span>
              </label>
              <button type="button" className="text-sm font-semibold text-teal-500 hover:text-teal-400 transition-colors">
                Forgot password?
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-poppins font-semibold rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/register" className="text-teal-500 font-semibold hover:text-teal-400">Request Access</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
