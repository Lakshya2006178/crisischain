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
import { useDashboard } from '../context/DashboardContext';

const DISASTER_TYPES = [
  { value: 'flood', label: 'Flood / Flash Flood', icon: Droplets, iconName: 'Droplets' },
  { value: 'cyclone', label: 'Cyclone / Hurricane', icon: Wind, iconName: 'Wind' },
  { value: 'wildfire', label: 'Wildfire', icon: Flame, iconName: 'Flame' },
  { value: 'earthquake', label: 'Earthquake / Landslide', icon: Activity, iconName: 'Activity' },
  { value: 'collapse', label: 'Structural Collapse', icon: Shield, iconName: 'Shield' },
  { value: 'chemical', label: 'Chemical / Hazmat Spill', icon: Radiation, iconName: 'Radiation' },
  { value: 'other', label: 'Other Emergency', icon: AlertTriangle, iconName: 'AlertTriangle' },
];

const SEVERITIES = [
  { id: 'low', label: 'MINOR', color: '#10b981' },
  { id: 'medium', label: 'MODERATE', color: '#f59e0b' },
  { id: 'high', label: 'HIGH DANGER', color: '#ef4444' },
  { id: 'critical', label: 'LIFE THREATENING', color: '#ef4444' },
];

export default function ReportIncident() {
  const nav = useNavigate();
  const fileRef = useRef();
  const [form, setForm] = useState({ location: '', disasterType: '', severity: '', description: '' });
  const [files, setFiles] = useState([]);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { addAlert, addToast } = useDashboard();

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFiles = (fl) => {
    const arr = Array.from(fl).slice(0, 5);
    setFiles(prev => [...prev, ...arr].slice(0, 5));
  };

  const fetchGPSLocation = () => {
    if (!navigator.geolocation) { set('location', 'Geolocation not supported'); return; }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        let placeName = '';
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          if (data && data.display_name) {
            // Take the most relevant parts of the address for brevity
            const parts = data.display_name.split(', ');
            placeName = parts.slice(0, 3).join(', ');
          }
        } catch (error) {
          console.error("Reverse geocoding failed", error);
        }
        
        if (placeName) {
          set('location', `${placeName} (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
        } else {
          set('location', `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
        setLocLoading(false);
      },
      () => { set('location', 'Unable to retrieve location'); setLocLoading(false); }
    );
  };

  const validate = () => {
    const e = {};
    if (!form.location.trim()) e.location = 'Location / address is required';
    if (!form.disasterType) e.disasterType = 'Please select a disaster type';
    if (!form.severity) e.severity = 'Please select severity level';
    if (!form.description.trim() || form.description.length < 20) e.description = 'Please provide at least 20 characters of detail';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    
    try {
      const isCritical = form.severity === 'critical' || form.severity === 'high';
      
      const payload = {
        type: form.disasterType,
        location: form.location,
        severity: isCritical ? 'high' : (form.severity === 'medium' ? 'medium' : 'low'),
        description: form.description
      };
      
      await addAlert(payload);
      setLoading(false); 
      setSuccess(true); 
    } catch (e) {
      setLoading(false);
      addToast('System Error. Report not delivered.', 'error');
    }
  };

  if (success) return (
    <div className="min-h-screen bg-[#08080A] text-[#E5E5E7] font-inter flex items-center justify-center p-8 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none bg-green-500/5 blur-[160px]" />
      <div className="max-w-[600px] w-full bg-white/5 border border-green-500/20 backdrop-blur-3xl p-16 text-center animate-slide-up relative z-10">
        <div className="w-24 h-24 bg-green-500/10 border border-green-500/40 flex items-center justify-center mx-auto mb-10">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
       <span className="text-[10px] font-mono text-green-500 tracking-[0.5em] uppercase block mb-6">HELP IS ON THE WAY</span>
        <h2 className="font-outfit text-5xl font-black tracking-tighter uppercase mb-8">REPORT RECEIVED</h2>
        <p className="text-white/40 font-light text-lg mb-12">
          Your emergency report has been sent to the nearest rescue teams. They are being notified right now.
          Report ID: <span className="text-[#00FFCC] font-mono">#RI-{Date.now().toString().slice(-6)}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button onClick={() => nav('/dashboard')} className="px-10 py-5 bg-[#00FFCC] text-black font-outfit font-black uppercase tracking-widest hover:brightness-110 transition-all">
            View Updates
          </button>
          <button onClick={() => { setSuccess(false); setForm({ location: '', disasterType: '', severity: '', description: '' }); setFiles([]); }} className="px-10 py-5 bg-white/5 border border-white/10 text-white font-outfit font-black uppercase tracking-widest hover:bg-white/10 transition-all">
            Report Another Emergency
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
              <span className="text-[9px] font-mono text-red-400 tracking-[0.4em] opacity-60 uppercase">Emergency Help Portal</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-mono tracking-widest uppercase font-bold">Priority Line Active</span>
             </div>
             <button onClick={() => nav('/')} className="px-6 py-2 border border-white/10 hover:bg-white/5 transition-all text-xs font-mono uppercase tracking-widest text-white/40">
               ← CANCEL
             </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-40 px-8">
        <div className="max-w-[1000px] mx-auto">
          
          <div className="mb-20 text-center">
             <span className="text-[10px] font-mono text-red-500 tracking-[0.8em] uppercase block mb-6 animate-pulse">Emergency Report Mode</span>
             <h1 className="font-outfit text-5xl md:text-[80px] font-black leading-[0.85] tracking-tighter uppercase mb-6">
               REPORT AN<br />
               <span className="text-white/10 stroke-text outline-white/20">EMERGENCY</span>
             </h1>
             <p className="text-white/40 text-lg md:text-xl font-light max-w-2xl mx-auto uppercase tracking-wide">
               Your report will be sent directly to local emergency responders.
             </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Section 1: Geo-location */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-[#00FFCC] uppercase tracking-widest">01_INCIDENT_LOCATION</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="relative flex-1 group">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-red-500 transition-colors" />
                    <input className="w-full bg-white/5 border border-white/5 focus:border-red-500/40 px-16 py-6 font-mono text-sm tracking-widest focus:outline-none transition-all placeholder:text-white/10" placeholder="ENTER ADDRESS OR COORDINATES" value={form.location} onChange={e => set('location', e.target.value)} />
                  </div>
                  <button type="button" onClick={fetchGPSLocation} disabled={locLoading} className="px-12 bg-white/5 border border-red-500/20 hover:bg-red-500/10 transition-all font-outfit font-black text-xs uppercase tracking-widest text-red-500">
                    {locLoading ? 'SEARCHING...' : 'USE GPS'}
                  </button>
                </div>
                {errors.location && <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest ml-1">{errors.location}</p>}
              </div>
            </div>

            {/* Section 2: Event Intel */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-[#00FFCC] uppercase tracking-widest">02_EVENT_DETAILS</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-1">What is happening?*</label>
                  <div className="relative group">
                    <select className="w-full bg-white/5 border border-white/5 focus:border-red-500/40 px-8 py-6 font-mono text-sm tracking-widest focus:outline-none transition-all text-white appearance-none cursor-pointer" value={form.disasterType} onChange={e => set('disasterType', e.target.value)}>
                       <option value="" className="bg-[#08080A]">SELECT TYPE</option>
                       {DISASTER_TYPES.map(type => <option key={type.value} value={type.value} className="bg-[#08080A] uppercase">{type.label}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-white/20">▼</div>
                  </div>
                  {errors.disasterType && <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest ml-1">{errors.disasterType}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-1">Threat Level*</label>
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
                  <span>Describe what happened*</span>
                  <span>{form.description.length}_chars</span>
                </label>
                <div className="relative group">
                  <MessageSquare className="absolute left-6 top-8 w-5 h-5 text-white/20 group-focus-within:text-red-500 transition-colors" />
                  <textarea rows={6} className="w-full bg-white/5 border border-white/5 focus:border-red-500/40 px-16 py-8 font-mono text-sm tracking-widest focus:outline-none transition-all placeholder:text-white/10 resize-none" placeholder="DESCRIBE THE SITUATION IN DETAIL..." value={form.description} onChange={e => set('description', e.target.value)} />
                </div>
                {errors.description && <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest ml-1">{errors.description}</p>}
              </div>
            </div>

            {/* Section 3: Visuals */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-[#00FFCC] uppercase tracking-widest">03_EVIDENCE_UPLOAD</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>
              <div className={`relative p-12 bg-white/5 border-2 border-dashed transition-all group ${drag ? 'border-red-500 bg-red-500/5' : 'border-white/5 hover:border-white/10'}`}>
                <input type="file" accept="image/*,video/*" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFiles(e.target.files)} />
                <div className="text-center space-y-4">
                  <Camera className={`w-12 h-12 mx-auto transition-colors ${drag ? 'text-red-500' : 'text-white/20 group-hover:text-white/40'}`} />
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
                    Drag_Evidence_Here OR <span className="text-red-500">Attach_Files</span>
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
                 PLEASE NOTE: Only report real emergencies. Accurate information helps our rescue teams save lives faster.
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
                  {loading ? 'SENDING REPORT...' : 'SEND REPORT NOW'}
                </span>
              </div>
            </button>
          </form>

          <footer className="mt-20 pt-20 border-t border-white/5 flex flex-col items-center gap-6">
             <div className="flex gap-12 text-[9px] font-mono text-white/20 tracking-[0.4em]">
                <span>ENCRYPT_STRENGTH: 256-BIT</span>
                <span>SECURE_UPLINK</span>
                <span>AUTH: COMMAND_SYSTEM</span>
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
