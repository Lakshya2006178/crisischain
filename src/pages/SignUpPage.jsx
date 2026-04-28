import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { 
  Shield, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ChevronLeft,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

const ROLES = ['Civilian / Victim', 'First Responder', 'NGO / Aid Worker', 'Government Official', 'Media / Press'];

function pwStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const STR_COLOR = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
const STR_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong'];

export default function SignUpPage() {
  const nav = useNavigate();
  const { signup } = useDashboard();
  const [form, setForm] = useState({ name: '', email: '', phone: '', org: '', role: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const str = pwStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!/^\+?[\d\s\-]{8,}$/.test(form.phone)) e.phone = 'Valid phone required';
    if (!form.role) e.role = 'Please select your role';
    if (form.password.length < 8) e.password = 'Min. 8 characters required';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!agreed) e.agreed = 'You must accept the terms of service';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    
    try {
      // Map UI roles to backend system roles
      let systemRole = 'citizen';
      if (form.role === 'First Responder') systemRole = 'responder';
      if (form.role === 'Government Official') systemRole = 'admin';

      await signup(form.name, form.email, form.password, systemRole);
      
      setLoading(false); 
      nav('/dashboard');
    } catch (err) {
      setLoading(false);
      setErrors({ global: err.response?.data?.error || err.message || 'Account Creation Failed.' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-gray-200 font-inter flex flex-col lg:flex-row">
      
      {/* ── LEFT PANEL: BRANDING ── */}
      <div className="hidden lg:flex w-1/3 bg-[#111827] border-r border-[#1F2937] flex-col p-12">
        <Link to="/" className="flex items-center gap-3 mb-auto">
          <Shield className="w-8 h-8 text-teal-500" />
          <span className="font-poppins font-bold text-2xl tracking-wide text-gray-100 uppercase">CrisisChain</span>
        </Link>
        
        <div className="mb-auto">
          <h1 className="font-poppins text-4xl font-bold text-gray-100 mb-6">
            Join the <br/> Network
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
            Create an account to participate in the global emergency response network. Securely manage and report incidents in your sector.
          </p>
        </div>
        
        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
          Enterprise Security Standard
        </div>
      </div>

      {/* ── RIGHT PANEL: SIGNUP FORM ── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="max-w-[600px] w-full py-8">
          
          <div className="mb-8">
            <Link to="/" className="lg:hidden flex items-center gap-2 text-sm text-teal-500 font-semibold mb-8">
              <ChevronLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h2 className="font-poppins text-3xl font-bold text-gray-100 mb-3">
              Create Account
            </h2>
            <p className="text-gray-400">
              Already have an account? <Link to="/login" className="text-teal-500 font-semibold hover:text-teal-400">Sign In</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.global && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-400">{errors.global}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input className="w-full bg-[#111827] border border-[#1F2937] rounded px-12 py-3 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all text-gray-200 placeholder:text-gray-600" placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Business Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input type="email" className="w-full bg-[#111827] border border-[#1F2937] rounded px-12 py-3 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all text-gray-200 placeholder:text-gray-600" placeholder="john@agency.org" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input className="w-full bg-[#111827] border border-[#1F2937] rounded px-12 py-3 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all text-gray-200 placeholder:text-gray-600" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Organization</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input className="w-full bg-[#111827] border border-[#1F2937] rounded px-12 py-3 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all text-gray-200 placeholder:text-gray-600" placeholder="Red Cross" value={form.org} onChange={e => set('org', e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">System Role</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <select className="w-full bg-[#111827] border border-[#1F2937] rounded px-12 py-3 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all text-gray-200 appearance-none cursor-pointer" value={form.role} onChange={e => set('role', e.target.value)}>
                   <option value="">Select a role</option>
                   {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">▼</div>
              </div>
              {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input type={showPw ? 'text' : 'password'} className="w-full bg-[#111827] border border-[#1F2937] rounded px-12 py-3 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all text-gray-200 placeholder:text-gray-600" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#1F2937] rounded-full overflow-hidden">
                      <div className="h-full transition-all duration-300" style={{ width: `${str * 25}%`, backgroundColor: STR_COLOR[str] }} />
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: STR_COLOR[str] }}>{STR_LABEL[str]}</span>
                  </div>
                )}
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input type={showCf ? 'text' : 'password'} className="w-full bg-[#111827] border border-[#1F2937] rounded px-12 py-3 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all text-gray-200 placeholder:text-gray-600" placeholder="••••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
                  <button type="button" onClick={() => setShowCf(!showCf)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showCf ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 rounded border-[#374151] bg-[#111827] text-teal-500 focus:ring-teal-500/50 focus:ring-offset-[#0B1220]" checked={agreed} onChange={() => setAgreed(!agreed)} />
                <span className="text-sm text-gray-400">
                  I agree to the <span className="text-gray-200">CrisisChain Strategic Terms</span> and accept the <span className="text-teal-500 hover:underline cursor-pointer">Terms of Service</span>.
                </span>
              </label>
              {errors.agreed && <p className="text-xs text-red-500 mt-1">{errors.agreed}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-poppins font-semibold rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Register Account'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
