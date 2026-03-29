import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Shield, 
  AlertTriangle, 
  MapPin, 
  Phone, 
  User, 
  MessageSquare, 
  Upload, 
  Camera, 
  CheckCircle2, 
  ChevronLeft,
  Activity,
  Zap,
  Terminal,
  Radiation,
  Flame,
  Droplets,
  Wind,
  Info
} from 'lucide-react';

const DISASTER_TYPES = [
  { value: 'flood', label: 'Flood / Flash Flood', icon: Droplets },
  { value: 'cyclone', label: 'Cyclone / Hurricane', icon: Wind },
  { value: 'wildfire', label: 'Wildfire', icon: Flame },
  { value: 'earthquake', label: 'Earthquake / Landslide', icon: Activity },
  { value: 'collapse', label: 'Structural Collapse', icon: Shield },
  { value: 'chemical', label: 'Chemical / Hazmat Spill', icon: Radiation },
  { value: 'other', label: 'Other Emergency', icon: AlertTriangle },
];

const SEVERITIES = [
  { id: 'low', label: 'LOW_PRIORITY', color: '#10b981' },
  { id: 'medium', label: 'ELEVATED', color: '#f59e0b' },
  { id: 'high', label: 'HIGH_RISK', color: '#ef4444' },
  { id: 'critical', label: 'CRITICAL_MAX', color: '#ef4444' },
];

export default function ReportIncident() {
  const nav = useNavigate();
  const fileRef = useRef();
  const [form, setForm] = useState({ name: '', phone: '', location: '', disasterType: '', severity: '', description: '' });
  const [files, setFiles] = useState([]);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFiles = (fl) => {
    const arr = Array.from(fl).slice(0, 5);
    setFiles(prev => [...prev, ...arr].slice(0, 5));
  };

  const useLocation = () => {
    if (!navigator.geolocation) { set('location', 'Geolocation not supported'); return; }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        set('location', `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        setLocLoading(false);
      },
      () => { set('location', 'Unable to retrieve location'); setLocLoading(false); }
    );
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Reporter name is required';
    if (!/^\+?[\d\s\-]{8,}$/.test(form.phone)) e.phone = 'Valid phone number required';
    if (!form.location.trim()) e.location = 'Location / address is required';
    if (!form.disasterType) e.disasterType = 'Please select a disaster type';
    if (!form.severity) e.severity = 'Please select severity level';
    if (!form.description.trim() || form.description.length < 20) e.description = 'Please provide at least 20 characters of detail';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 2000);
  };

  if (success) return (
    <div className="min-h-screen bg-[#08080A] text-[#E5E5E7] font-inter flex items-center justify-center p-8 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none bg-green-500/5 blur-[160px]" />
      <div className="max-w-[600px] w-full bg-white/5 border border-green-500/20 backdrop-blur-3xl p-16 text-center animate-slide-up relative z-10">
        <div className="w-24 h-24 bg-green-500/10 border border-green-500/40 flex items-center justify-center mx-auto mb-10">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <span className="text-[10px] font-mono text-green-500 tracking-[0.5em] uppercase block mb-6">Dispatch_Successful</span>
        <h2 className="font-outfit text-5xl font-black tracking-tighter uppercase mb-8">INCIDENT_LOGGED</h2>
        <p className="text-white/40 font-light text-lg mb-12">
          Your emergency report has been prioritized and routed to nearest response units. 
          Session ID: <span className="text-[#00FFCC] font-mono">#RI-{Date.now().toString().slice(-6)}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button onClick={() => nav('/dashboard')} className="px-10 py-5 bg-[#00FFCC] text-black font-outfit font-black uppercase tracking-widest hover:brightness-110 transition-all">
            Enter Command Center
          </button>
          <button onClick={() => { setSuccess(false); setForm({ name: '', phone: '', location: '', disasterType: '', severity: '', description: '' }); setFiles([]); }} className="px-10 py-5 bg-white/5 border border-white/10 text-white font-outfit font-black uppercase tracking-widest hover:bg-white/10 transition-all">
            Log New Event
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#08080A] text-[#E5E5E7] font-inter selection:bg-[#ef4444] selection:text-white">
      
      {/* ── AMBIENT MESH BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[160px] opacity-[0.1] bg-red-600 transition-transform duration-1000 ease-out"
          style={{ transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)` }}
        />
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.1] bg-red-700 animate-pulse" />
        <div className="absolute inset-0 opacity-[0.03] contrast-150 brightness-150 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* ── TACTICAL NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-3xl border-b border-white/5 py-6 px-8">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
           <Link to="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-white/5 border border-red-500/20 flex items-center justify-center group-hover:border-red-500/40 transition-all">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-outfit font-black text-xl tracking-tighter uppercase">CRISISCHAIN</span>
              <span className="text-[9px] font-mono text-red-400 tracking-[0.4em] opacity-60 uppercase">Emergency_Portal_v5</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-mono tracking-widest uppercase font-bold">Priority_Channel_Active</span>
             </div>
             <button onClick={() => nav('/')} className="px-6 py-2 border border-white/10 hover:bg-white/5 transition-all text-xs font-mono uppercase tracking-widest text-white/40">
               ← ABORT
             </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-40 px-8">
        <div className="max-w-[1000px] mx-auto">
          
          <div className="mb-20 text-center">
             <span className="text-[10px] font-mono text-red-500 tracking-[0.8em] uppercase block mb-6 animate-pulse">Critical_Intake_Mode</span>
             <h1 className="font-outfit text-6xl md:text-[80px] font-black leading-[0.85] tracking-tighter uppercase mb-6">
               REPORT_AN<br />
               <span className="text-white/10 stroke-text outline-white/20">INCIDENT</span>
             </h1>
             <p className="text-white/40 text-xl font-light max-w-2xl mx-auto uppercase tracking-wide">
               Initialize tactical feed. Immediate deployment across all available nodes.
             </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Section 1: Reporter */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-[#00FFCC] uppercase tracking-widest">01_IDENTIFICATION</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-1">Full_Name*</label>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-red-500 transition-colors" />
                    <input className="w-full bg-white/5 border border-white/5 focus:border-red-500/40 px-16 py-6 font-mono text-sm tracking-widest focus:outline-none transition-all placeholder:text-white/10" placeholder="NAME_ENTRY" value={form.name} onChange={e => set('name', e.target.value)} />
                  </div>
                  {errors.name && <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest ml-1">{errors.name}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-1">Comm_Line*</label>
                  <div className="relative group">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-red-500 transition-colors" />
                    <input className="w-full bg-white/5 border border-white/5 focus:border-red-500/40 px-16 py-6 font-mono text-sm tracking-widest focus:outline-none transition-all placeholder:text-white/10" placeholder="+1_XXX_XXXX" value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </div>
                  {errors.phone && <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest ml-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Geo-location */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-[#00FFCC] uppercase tracking-widest">02_LOCATION</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-1">Cortex_GPS_Coordinates*</label>
                <div className="flex gap-4">
                  <div className="relative flex-1 group">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-red-500 transition-colors" />
                    <input className="w-full bg-white/5 border border-white/5 focus:border-red-500/40 px-16 py-6 font-mono text-sm tracking-widest focus:outline-none transition-all placeholder:text-white/10" placeholder="ADDR_COORD_ENTRY" value={form.location} onChange={e => set('location', e.target.value)} />
                  </div>
                  <button type="button" onClick={useLocation} disabled={locLoading} className="px-12 bg-white/5 border border-red-500/20 hover:bg-red-500/10 transition-all font-outfit font-black text-xs uppercase tracking-widest text-red-500">
                    {locLoading ? 'SEARCHING...' : 'SYNC_GPS'}
                  </button>
                </div>
                {errors.location && <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest ml-1">{errors.location}</p>}
              </div>
            </div>

            {/* Section 3: Event Intel */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-[#00FFCC] uppercase tracking-widest">03_EVENT_INTEL</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-1">Event_Category*</label>
                  <div className="relative group">
                    <select className="w-full bg-white/5 border border-white/5 focus:border-red-500/40 px-8 py-6 font-mono text-sm tracking-widest focus:outline-none transition-all text-white appearance-none cursor-pointer" value={form.disasterType} onChange={e => set('disasterType', e.target.value)}>
                       <option value="" className="bg-[#08080A]">SELECT_TYPE</option>
                       {DISASTER_TYPES.map(type => <option key={type.value} value={type.value} className="bg-[#08080A] uppercase">{type.label}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-white/20">▼</div>
                  </div>
                  {errors.disasterType && <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest ml-1">{errors.disasterType}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-1">Threat_Level*</label>
                  <div className="grid grid-cols-4 gap-2">
                    {SEVERITIES.map(sev => (
                      <button key={sev.id} type="button" onClick={() => set('severity', sev.id)} className={`py-6 border font-mono text-[8px] tracking-widest transition-all ${form.severity === sev.id ? 'bg-red-600 border-red-500 text-white' : 'bg-white/5 border-white/5 text-white/20 hover:border-white/20'}`}>
                        {sev.label}
                      </button>
                    ))}
                  </div>
                  {errors.severity && <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest ml-1">{errors.severity}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-1 flex justify-between">
                  <span>Tactical_Situation_Log*</span>
                  <span>{form.description.length}_chars</span>
                </label>
                <div className="relative group">
                  <MessageSquare className="absolute left-6 top-8 w-5 h-5 text-white/20 group-focus-within:text-red-500 transition-colors" />
                  <textarea rows={6} className="w-full bg-white/5 border border-white/5 focus:border-red-500/40 px-16 py-8 font-mono text-sm tracking-widest focus:outline-none transition-all placeholder:text-white/10 resize-none" placeholder="DESCRIBE_SITUATION_IN_DETAIL..." value={form.description} onChange={e => set('description', e.target.value)} />
                </div>
                {errors.description && <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest ml-1">{errors.description}</p>}
              </div>
            </div>

            {/* Section 4: Visuals */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-[#00FFCC] uppercase tracking-widest">04_VISUAL_TELEM_DATA</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>
              <div className={`relative p-12 bg-white/5 border-2 border-dashed transition-all group ${drag ? 'border-red-500 bg-red-500/5' : 'border-white/5 hover:border-white/10'}`}>
                <input type="file" accept="image/*,video/*" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFiles(e.target.files)} />
                <div className="text-center space-y-4">
                  <Camera className={`w-12 h-12 mx-auto transition-colors ${drag ? 'text-red-500' : 'text-white/20 group-hover:text-white/40'}`} />
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
                    Drag_Visual_Intel_Here OR <span className="text-red-500">Link_FileSystem</span>
                  </p>
                  <p className="text-[8px] font-mono text-white/20 uppercase">JPG_PNG_MP4 // LIMIT_5_FILES</p>
                </div>
              </div>
              {files.length > 0 && (
                <div className="grid grid-cols-5 gap-4">
                  {files.map((f, i) => (
                    <div key={i} className="aspect-square bg-white/5 border border-white/5 relative group">
                       <img src={URL.createObjectURL(f)} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="preview" />
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-red-500 text-[8px] font-mono bg-black/80 px-2 py-1">PURGE</button>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 bg-red-600/5 border border-red-600/20 flex gap-6 items-start">
               <Info className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
               <p className="text-xs font-mono text-red-600 uppercase tracking-widest leading-relaxed">
                 MISSION_CRITICAL: All information submitted is verified through atmospheric nodes. 
                 False reporting will result in immediate identity revocation and prosecution under planetary law.
               </p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full group relative overflow-hidden px-10 py-8 bg-red-600 border border-red-500 hover:bg-red-700 transition-all duration-700 disabled:opacity-50"
            >
              <div className="relative z-10 flex items-center justify-center gap-6">
                <Zap className={`w-8 h-8 text-white ${loading ? 'animate-pulse' : ''}`} />
                <span className="text-2xl font-outfit font-black uppercase tracking-widest text-white">
                  {loading ? 'DISPATCHING_ALERT...' : 'INITIALIZE_EMERGENCY_FEED'}
                </span>
              </div>
            </button>
          </form>

          <footer className="mt-20 pt-20 border-t border-white/5 flex flex-col items-center gap-6">
             <div className="flex gap-12 text-[9px] font-mono text-white/20 tracking-[0.4em]">
                <span>ENCRYPT_STRENGTH: 256-BIT</span>
                <span>UPLINK: SATELLITE_LINK_7</span>
                <span>AUTH: V5_TAC_CENTER</span>
             </div>
             <p className="text-[8px] font-mono text-white/10 uppercase tracking-[0.8em]">
               © 2026 CrisisChain // THE_SOVEREIGN_OBSERVER
             </p>
          </footer>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255,255,255,0.4);
          text-stroke: 1px rgba(255,255,255,0.4);
          color: transparent;
        }
      `}} />
    </div>
  );
}
