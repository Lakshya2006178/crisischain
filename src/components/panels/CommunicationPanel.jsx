import { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { MessageSquare, AlertTriangle, Radio, Send } from 'lucide-react';

export default function CommunicationPanel() {
    const { messages, addMessage } = useDashboard();
    const [input, setInput] = useState('');
    const [filter, setFilter] = useState('All');

    const filtered = filter === 'All' ? messages : messages.filter(m => m.status === filter);

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim()) { addMessage('Commander', input.trim(), 'Active'); setInput(''); }
    };

    const statusStyle = (s) => ({
        Critical: 'bg-red-500/15 text-red-400 border border-red-500/25',
        Active:   'bg-blue-500/15 text-blue-400 border border-blue-500/25',
        Warning:  'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25',
    })[s] || 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25';

    return (
        <div className="db-card">
            <div className="db-card-header">
                <h2 className="font-bebas tracking-widest text-lg text-slate-100 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse flex-shrink-0" />
                    Comms &amp; Feed
                </h2>
                <div className="flex gap-0.5 rounded-lg p-0.5" style={{background:'rgba(30,41,59,.7)', border:'1px solid rgba(51,65,85,.5)'}}>
                    {['All','Critical'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                                className={`font-inter px-3 py-1 text-[10px] font-semibold rounded-md tracking-wide transition-colors
                                    ${filter === f ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 divide-y"
                 style={{divideColor:'rgba(51,65,85,.4)'}}>
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-24 gap-2 text-slate-500">
                        <MessageSquare className="w-5 h-5 opacity-25" />
                        <span className="font-inter text-xs italic">No messages</span>
                    </div>
                )}
                {filtered.map(msg => (
                    <div key={msg.id} className="px-5 py-3.5 hover:bg-slate-800/25 transition-colors">
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <span className={`font-inter text-xs font-bold flex items-center gap-1
                                ${msg.sender === 'Commander' ? 'text-purple-400' : 'text-blue-400'}`}>
                                {(msg.sender === 'HQ Command' || msg.sender === 'Commander') &&
                                    <AlertTriangle className="w-3 h-3 flex-shrink-0" />}
                                {msg.sender}
                            </span>
                            <span className="font-inter text-[10px] font-mono text-slate-500 flex-shrink-0">{msg.time}</span>
                        </div>
                        <p className="font-inter text-[11px] text-slate-400 leading-relaxed mb-2">{msg.text}</p>
                        <div className="flex justify-end">
                            <span className={`font-inter text-[9px] uppercase font-bold px-2 py-0.5 rounded tracking-wider ${statusStyle(msg.status)}`}>
                                {msg.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Send box */}
            <form onSubmit={handleSend}
                  className="flex gap-2.5 px-4 py-3 flex-shrink-0 border-t"
                  style={{borderColor:'rgba(51,65,85,.5)'}}>
                <input
                    type="text" value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSend(e); }}
                    placeholder="Type message to all units…"
                    className="font-inter flex-1 min-w-0 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600
                        outline-none transition-all"
                    style={{
                        background:'rgba(15,24,40,.8)',
                        border:'1px solid rgba(51,65,85,.6)',
                    }}
                />
                <button type="submit"
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-white transition-colors active:scale-95"
                        style={{background:'#2563eb'}}>
                    <Send className="w-3.5 h-3.5" />
                </button>
            </form>
        </div>
    );
}
