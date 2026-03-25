import React, { useEffect, useState } from 'react';
import { AlertCircle, X, Bell } from 'lucide-react';

const AlertToast = ({ alert, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for transition
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const priorityColors = {
    P1: 'bg-red-500/20 border-red-500 text-red-400',
    High: 'bg-red-500/20 border-red-500 text-red-400',
    P2: 'bg-orange-500/20 border-orange-500 text-orange-400',
    P3: 'bg-blue-500/20 border-blue-500 text-blue-400',
  };

  return (
    <div className={`
      fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      w-80 p-4 rounded-xl border-l-[4px] shadow-2xl backdrop-blur-md
      bg-slate-900/90 border border-slate-700
      ${priorityColors[alert.priority] || priorityColors.P3}
    `}>
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${(alert.priority === 'P1' || alert.priority === 'High') ? 'bg-red-500/20 animate-pulse' : 'bg-slate-800'}`}>
          <AlertCircle size={20} className={(alert.priority === 'P1' || alert.priority === 'High') ? 'text-red-500' : 'text-slate-400'} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm tracking-wide uppercase">
              {alert.priority} {alert.title}
            </h4>
            <button onClick={() => setIsVisible(false)} className="text-slate-500 hover:text-slate-300">
              <X size={16} />
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-1 line-clamp-2">
            {alert.message}
          </p>
        </div>
      </div>
      {(alert.priority === 'P1' || alert.priority === 'High') && (
        <div className="mt-3 flex gap-2">
          <button onClick={onClose} className="flex-1 py-1 px-2 rounded bg-red-600/20 border border-red-500/40 text-[10px] font-bold uppercase tracking-wider hover:bg-red-600/30 transition-colors">
            Acknowledge Emergency
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertToast;
