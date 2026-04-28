import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Shield, 
  AlertTriangle, 
  MapPin, 
  Phone, 
  User, 
  MessageSquare, 
  Camera, 
  Activity,
  Zap,
  Radiation,
  Flame,
  Droplets,
  Wind,
  Info
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

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
  { id: 'low', label: 'Minor', color: '#10b981' },
  { id: 'medium', label: 'Moderate', color: '#f59e0b' },
  { id: 'high', label: 'High Danger', color: '#ef4444' },
  { id: 'critical', label: 'Life Threatening', color: '#ef4444' },
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
  const { addAlert, addToast, user } = useDashboard();

  useEffect(() => {
    window.scrollTo(0, 0);
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

  // Map frontend disaster type values to valid backend enum values
  const mapDisasterType = (frontendType) => {
    const mapping = {
      'flood': 'flood',
      'cyclone': 'flood',       // closest match
      'wildfire': 'fire',
      'fire': 'fire',
      'earthquake': 'accident',  // closest match
      'collapse': 'accident',
      'medical': 'medical',
      'chemical': 'medical',     // closest match
      'accident': 'accident',
      'other': 'accident',       // fallback
    };
    return mapping[frontendType] || 'accident';
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
        type: mapDisasterType(form.disasterType),
        location: form.location,
        severity: isCritical ? 'high' : (form.severity === 'medium' ? 'medium' : 'low'),
        description: form.description,
        contact: form.phone,
      };

      await addAlert(payload);
      addToast('Emergency report submitted successfully!', 'success');
      setLoading(false);
      setSuccess(true);
    } catch (err) {
      setLoading(false);
      addToast('System Error. Report not delivered.', 'error');
    }
  };

  if (success) return (
    <div className="min-h-screen bg-[#0B1220] text-gray-200 font-inter flex items-center justify-center p-8">
      <div className="max-w-xl text-center bg-[#111827] border border-[#1F2937] p-12 rounded-lg">
        <span className="text-xs font-semibold text-emerald-500 uppercase tracking-widest block mb-4">Help Is On The Way</span>
        <h2 className="font-poppins text-4xl font-bold mb-6 text-gray-100">REPORT RECEIVED</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Your emergency report has been sent to the nearest rescue teams. They are being notified right now.
          <br /><br />
          Report ID: <span className="text-teal-500 font-mono">#RI-{Date.now().toString().slice(-6)}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => user ? nav('/dashboard') : nav('/')} className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded font-semibold transition-colors">
            {user ? 'View Dashboard' : 'Return Home'}
          </button>
          <button onClick={() => { setSuccess(false); setForm({ name: '', phone: '', location: '', disasterType: '', severity: '', description: '' }); setFiles([]); }} className="px-6 py-3 bg-[#1F2937] hover:bg-[#374151] border border-[#374151] text-white rounded font-semibold transition-colors">
            Report Another Emergency
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B1220] text-gray-200 font-inter pb-20">
      
      {/* Navbar */}
      <nav className="bg-[#111827] border-b border-[#1F2937] py-4 px-6 md:px-10 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500/10 rounded flex items-center justify-center text-red-500">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-poppins font-bold text-lg text-gray-100 tracking-tight">CRISISCHAIN</span>
          </div>
        </Link>
        <button onClick={() => nav('/')} className="text-sm font-semibold text-gray-400 hover:text-gray-200 transition-colors">
          Cancel & Return
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 mt-12 md:mt-20">
        
        <div className="mb-12 text-center md:text-left">
           <h1 className="font-poppins text-4xl md:text-5xl font-bold text-gray-100 mb-4">
             REPORT AN EMERGENCY
           </h1>
           <p className="text-gray-400 text-lg max-w-2xl">
             Please provide accurate information to help emergency responders dispatch the correct resources to your location immediately.
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Section 1: Contact Info */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-6 md:p-8">
            <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center gap-2">
               <span className="w-6 h-6 rounded bg-teal-500/10 text-teal-500 flex items-center justify-center text-xs">1</span> 
               Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Your Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input className="w-full bg-[#0B1220] border border-[#1F2937] rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-red-500/50 text-white placeholder:text-gray-600 transition-colors" placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-2 font-semibold">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input className="w-full bg-[#0B1220] border border-[#1F2937] rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-red-500/50 text-white placeholder:text-gray-600 transition-colors" placeholder="+1 234 567 8900" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-2 font-semibold">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Location */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-6 md:p-8">
            <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center gap-2">
               <span className="w-6 h-6 rounded bg-teal-500/10 text-teal-500 flex items-center justify-center text-xs">2</span> 
               Incident Location
            </h3>
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Address or Coordinates *</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input className="w-full bg-[#0B1220] border border-[#1F2937] rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-red-500/50 text-white placeholder:text-gray-600 transition-colors" placeholder="123 Main St, City" value={form.location} onChange={e => set('location', e.target.value)} />
                </div>
                <button type="button" onClick={fetchGPSLocation} disabled={locLoading} className="px-6 py-3 bg-[#1F2937] hover:bg-[#374151] border border-[#374151] rounded-lg text-sm font-semibold text-gray-200 transition-colors whitespace-nowrap">
                  {locLoading ? 'Locating...' : 'Use Current GPS'}
                </button>
              </div>
              {errors.location && <p className="text-xs text-red-500 mt-2 font-semibold">{errors.location}</p>}
            </div>
          </div>

          {/* Section 3: Details */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-6 md:p-8">
            <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center gap-2">
               <span className="w-6 h-6 rounded bg-teal-500/10 text-teal-500 flex items-center justify-center text-xs">3</span> 
               Event Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Emergency Type *</label>
                <div className="relative">
                  <select className="w-full bg-[#0B1220] border border-[#1F2937] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500/50 text-white appearance-none cursor-pointer transition-colors" value={form.disasterType} onChange={e => set('disasterType', e.target.value)}>
                     <option value="">Select Type...</option>
                     {DISASTER_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                  </select>
                </div>
                {errors.disasterType && <p className="text-xs text-red-500 mt-2 font-semibold">{errors.disasterType}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Threat Level *</label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {SEVERITIES.map(sev => (
                    <button key={sev.id} type="button" onClick={() => set('severity', sev.id)} className={`py-2 px-2 rounded border text-xs font-semibold transition-colors ${form.severity === sev.id ? 'bg-red-600 border-red-500 text-white' : 'bg-[#0B1220] border-[#1F2937] text-gray-400 hover:border-gray-600'}`}>
                      {sev.label}
                    </button>
                  ))}
                </div>
                {errors.severity && <p className="text-xs text-red-500 mt-2 font-semibold">{errors.severity}</p>}
              </div>
            </div>

            <div>
              <label className="flex justify-between text-sm font-semibold text-gray-400 mb-2">
                <span>Describe the situation *</span>
                <span className="text-gray-600 text-xs font-mono">{form.description.length} chars</span>
              </label>
              <textarea rows={5} className="w-full bg-[#0B1220] border border-[#1F2937] rounded-lg p-4 text-sm focus:outline-none focus:border-red-500/50 text-white placeholder:text-gray-600 transition-colors resize-none" placeholder="Provide any details that might help responders..." value={form.description} onChange={e => set('description', e.target.value)} />
              {errors.description && <p className="text-xs text-red-500 mt-2 font-semibold">{errors.description}</p>}
            </div>
          </div>

          {/* Section 4: Uploads */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-6 md:p-8">
            <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center gap-2">
               <span className="w-6 h-6 rounded bg-teal-500/10 text-teal-500 flex items-center justify-center text-xs">4</span> 
               Evidence (Optional)
            </h3>
            <div className={`relative p-8 rounded-lg border-2 border-dashed transition-colors flex flex-col items-center justify-center text-center ${drag ? 'border-red-500 bg-red-500/5' : 'border-[#374151] hover:border-gray-500 bg-[#0B1220]'}`}>
              <input type="file" accept="image/*,video/*" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFiles(e.target.files)} />
              <Camera className="w-8 h-8 text-gray-500 mb-3" />
              <p className="text-sm text-gray-300 font-semibold mb-1">
                Drag photos/videos here or <span className="text-red-500">browse files</span>
              </p>
              <p className="text-xs text-gray-500">JPG, PNG, MP4 (Max 5 files)</p>
            </div>
            
            {files.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6">
                {files.map((f, i) => (
                  <div key={i} className="aspect-square bg-[#0B1220] border border-[#1F2937] rounded relative group overflow-hidden">
                     <img src={URL.createObjectURL(f)} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="preview" />
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity">
                        <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-white text-xs font-semibold bg-red-600 px-3 py-1.5 rounded">Remove</button>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex gap-4 items-start">
             <Info className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
             <p className="text-sm text-red-200 leading-relaxed font-medium">
               Please only report real emergencies. False reports delay response times for actual life-threatening events.
             </p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-poppins font-bold text-lg tracking-wide transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <Zap className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
            {loading ? 'Submitting Report...' : 'Submit Emergency Report'}
          </button>
        </form>
      </main>
    </div>
  );
}
