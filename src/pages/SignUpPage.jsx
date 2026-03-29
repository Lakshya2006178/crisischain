import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Activity,
  Zap,
  Globe,
  Terminal,
  CheckCircle2
} from 'lucide-react';

const ROLES = ['Civilian / Victim', 'First Responder', 'NGO / Aid Worker', 'Government Official', 'Media / Press'];
const FEATURES = [
  { icon: Globe, label: 'GLOBAL_OBSERVATION', desc: 'Satellite-linked real-time surveillance across all tectonic and atmospheric sectors.' },
  { icon: Zap, label: 'INSTANT_TRIAGE', desc: 'AI-driven threat assessment protocols bypass human latency for immediate responder deployment.' },
  { icon: Shield, label: 'SECURE_CHNL', desc: 'Military-grade 256-bit encryption for all tactical communications and data exchanges.' },
];

function pwStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const STR_COLOR = ['', '#ef4444', '#f97316', '#eab308', '#00FFCC'];
const STR_LABEL = ['', 'CRITICAL_WEAKNESS', 'MARGINAL_SECURITY', 'OPTIMAL_STRENGTH', 'FORTIFIED_ENCRYPTION'];

export default function SignUpPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', org: '', role: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
    if (!agreed) e.agreed = 'You must accept the terms';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); nav('/dashboard'); }, 1600);
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-[#E5E5E7] font-inter overflow-y-auto flex selection:bg-[#00FFCC] selection:text-black">
      
      {/* ── AMBIENT MESH BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[160px] opacity-[0.1] bg-blue-500 transition-transform duration-1000 ease-out"
          style={{ transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)` }}
        />
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.1] bg-blue-600 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full blur-[180px] opacity-[0.05] bg-red-900" />
        <div className="absolute inset-0 opacity-[0.03] contrast-150 brightness-150 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* ── LEFT PANEL: NETWORK INFO ── */}
      <div className="hidden lg:flex w-[38%] flex-col justify-center px-16 relative z-10 border-r border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4 group mb-16">
          <div className="w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:border-[#00FFCC]/40 transition-all duration-500">
            <Shield className="w-6 h-6 text-[#00FFCC] group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col gap-0 leading-none">
            <span className="font-outfit font-black text-2xl tracking-tighter uppercase text-white">CRISISCHAIN</span>
            <span className="text-[10px] font-mono text-blue-400 tracking-[0.4em] opacity-60 uppercase">Nexus_Protocol_v5.4</span>
          </div>
        </Link>

        {/* Heading */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6 animate-fade-in">
            <div className="h-[1px] w-8 bg-[#00FFCC]/40" />
            <span className="text-[9px] font-mono tracking-[0.5em] text-[#00FFCC] uppercase">Register_New_Identity</span>
          </div>
          <h1 className="font-outfit text-6xl font-black leading-[0.9] tracking-tighter mb-8 uppercase">
            JOIN THE<br />
            <span className="bg-gradient-to-r from-[#00FFCC] via-white to-white/40 bg-clip-text text-transparent italic text-6xl">TACTICAL_GRID</span>
          </h1>
          <p className="text-white/40 text-lg font-light leading-relaxed max-w-sm">
            Become a sentinel in the planetary response network. Coordinate resource flows with zero human latency.
          </p>
        </div>

        {/* Features list */}
        <div className="space-y-6">
          {FEATURES.map((feat, i) => (
            <div key={i} className="flex gap-6 p-6 bg-white/5 border border-white/5 backdrop-blur-xl group hover:border-[#00FFCC]/20 transition-all">
              <feat.icon className="w-8 h-8 text-[#00FFCC] flex-shrink-0" />
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#00FFCC] tracking-widest uppercase">{feat.label}</span>
                <p className="text-xs text-white/40 leading-relaxed font-light">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center gap-4 text-white/20">
          <Terminal className="w-4 h-4 text-blue-500" />
          <span className="text-[10px] font-mono tracking-widest uppercase">Encryption_Level: AES-256-GCM</span>
        </div>
      </div>

      {/* ── RIGHT PANEL: SIGNUP FORM ── */}
      <div className="flex-1 flex items-start lg:items-center justify-center p-6 md:p-12 relative z-10 pt-24 lg:pt-12 min-h-screen">
        <div className="max-w-[540px] w-full py-12 animate-slide-up">
          
          <div className="mb-12">
            <Link to="/" className="lg:hidden flex items-center gap-2 text-[10px] font-mono text-[#00FFCC] uppercase tracking-widest mb-8">
              <ChevronLeft className="w-4 h-4" /> Back to Intelligence
            </Link>
            <span className="text-[9px] font-mono text-blue-400 tracking-[0.6em] uppercase block mb-4">Identity_Provisioning</span>
            <h2 className="font-outfit text-5xl font-black tracking-tighter uppercase leading-none mb-4">
              CREATE_ACCOUNT
            </h2>
            <p className="text-white/40 font-light">Already synchronized? <Link to="/login" className="text-blue-400 hover:text-[#00FFCC] transition-colors">Sign_In</Link></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Full_Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-[#00FFCC] transition-colors" />
                  <input className="w-full bg-white/5 border border-white/5 backdrop-blur-xl px-14 py-5 font-mono text-sm tracking-widest focus:outline-none focus:border-[#00FFCC]/40 transition-all text-white placeholder:text-white/10" placeholder="J_SMITH" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                {errors.name && <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest ml-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Identity_Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-[#00FFCC] transition-colors" />
                  <input className="w-full bg-white/5 border border-white/5 backdrop-blur-xl px-14 py-5 font-mono text-sm tracking-widest focus:outline-none focus:border-[#00FFCC]/40 transition-all text-white placeholder:text-white/10" placeholder="NAME@AGENCY.ORG" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                {errors.email && <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest ml-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Comm_Phone</label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-[#00FFCC] transition-colors" />
                  <input className="w-full bg-white/5 border border-white/5 backdrop-blur-xl px-14 py-5 font-mono text-sm tracking-widest focus:outline-none focus:border-[#00FFCC]/40 transition-all text-white placeholder:text-white/10" placeholder="+1_234_567_890" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                {errors.phone && <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest ml-1">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Affiliation</label>
                <div className="relative group">
                  <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-[#00FFCC] transition-colors" />
                  <input className="w-full bg-white/5 border border-white/5 backdrop-blur-xl px-14 py-5 font-mono text-sm tracking-widest focus:outline-none focus:border-[#00FFCC]/40 transition-all text-white placeholder:text-white/10" placeholder="ORG_NAME (OPT)" value={form.org} onChange={e => set('org', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Operational_Role</label>
              <div className="relative group">
                <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-[#00FFCC] transition-colors" />
                <select className="w-full bg-white/5 border border-white/5 backdrop-blur-xl px-14 py-5 font-mono text-sm tracking-widest focus:outline-none focus:border-[#00FFCC]/40 transition-all text-white appearance-none cursor-pointer" value={form.role} onChange={e => set('role', e.target.value)}>
                   <option value="" className="bg-[#08080A]">SELECT_ROLE</option>
                   {ROLES.map(r => <option key={r} value={r} className="bg-[#08080A] uppercase">{r}</option>)}
                </select>
                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-white/20">▼</div>
              </div>
              {errors.role && <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest ml-1">{errors.role}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Access_Token</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-[#00FFCC] transition-colors" />
                  <input type={showPw ? 'text' : 'password'} className="w-full bg-white/5 border border-white/5 backdrop-blur-xl px-14 py-5 font-mono text-sm tracking-widest focus:outline-none focus:border-[#00FFCC]/40 transition-all text-white placeholder:text-white/10" placeholder="PASSCODE" value={form.password} onChange={e => set('password', e.target.value)} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white">
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {form.password && (
                  <div className="space-y-1 mt-2 px-1">
                    <div className="h-1 w-full bg-white/5">
                      <div className="h-full transition-all duration-500" style={{ width: `${str * 25}%`, backgroundColor: STR_COLOR[str] }} />
                    </div>
                    <span className="text-[8px] font-mono uppercase tracking-[0.2em]" style={{ color: STR_COLOR[str] }}>{STR_LABEL[str]}</span>
                  </div>
                )}
                {errors.password && <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest ml-1">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Confirm_Token</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-[#00FFCC] transition-colors" />
                  <input type={showCf ? 'text' : 'password'} className="w-full bg-white/5 border border-white/5 backdrop-blur-xl px-14 py-5 font-mono text-sm tracking-widest focus:outline-none focus:border-[#00FFCC]/40 transition-all text-white placeholder:text-white/10" placeholder="RE-PASSCODE" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
                  <button type="button" onClick={() => setShowCf(!showCf)} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white">
                    {showCf ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirm && <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest ml-1">{errors.confirm}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <label className="flex items-start gap-4 cursor-pointer group p-4 border border-white/5 bg-white/5 hover:border-[#00FFCC]/20 transition-all">
                <div className={`w-5 h-5 border flex-shrink-0 flex items-center justify-center transition-all mt-0.5 ${agreed ? 'border-[#00FFCC] bg-[#00FFCC]/10' : 'border-white/10 bg-white/5'}`}>
                   {agreed && <div className="w-2 h-2 bg-[#00FFCC]" />}
                </div>
                <input type="checkbox" className="hidden" checked={agreed} onChange={() => setAgreed(!agreed)} />
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                  Synchronize my identity with <span className="text-white">CrisisChain Tactical Protocols</span> and accept <span className="text-[#00FFCC] hover:underline cursor-pointer">Mission_Parameters</span>.
                </span>
              </label>
              {errors.agreed && <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest ml-1">{errors.agreed}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full group relative overflow-hidden px-10 py-6 bg-white/5 border border-[#00FFCC]/20 hover:bg-[#00FFCC] transition-all duration-700 disabled:opacity-50"
            >
              <div className="relative z-10 flex items-center justify-center gap-4">
                <span className={`text-xl font-outfit font-black uppercase tracking-widest transition-colors duration-700 ${loading ? 'text-white/40' : 'group-hover:text-black text-[#00FFCC]'}`}>
                  {loading ? 'INITIALIZING_ACCOUNT...' : 'AUTHORIZE_SENTINEL'}
                </span>
                {!loading && <CheckCircle2 className="w-6 h-6 text-[#00FFCC] group-hover:text-black transition-colors" />}
              </div>
            </button>
          </form>

          <p className="text-center text-[10px] font-mono text-white/20 uppercase tracking-[0.8em] mt-12">
            © 2026 CrisisChain // GLOBAL_SENTINEL_PROGRAM
          </p>
        </div>
      </div>

    </div>
  );
}
