import { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { MessageSquare, AlertTriangle, Radio, Send, Terminal, Shield, Lock } from 'lucide-react';

export default function CommunicationPanel() {
    const { messages, addMessage } = useDashboard();
    const [input, setInput] = useState('');
    const [filter, setFilter] = useState('All');

    const filtered = filter === 'All' ? messages : messages.filter(m => m.status === filter);

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim()) { addMessage('Alex', input.trim(), 'Active'); setInput(''); }
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#0A0A0B]/20 relative overflow-hidden  group">
            
            {/* Secur-Link Header */}
            <div className="flex items-center justify-between px-10 py-8 border-b border-[#1F2937] bg-white/[0.02]">
                <div className="flex items-center gap-6">
                    <div className="w-10 h-10 border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center relative">
                        <Radio className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform animate-pulse" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
                    </div>
                    <div>
                        <h4 className="font-poppins font-black text-xl tracking-tight text-white uppercase leading-none mb-1">TEAM CHAT</h4>
                        <p className="font-mono text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase flex items-center gap-2">
                           <Lock className="w-3 h-3" /> SECURE CHANNEL
                        </p>
                    </div>
                </div>
                
                <div className="flex gap-1 p-1 bg-black/40 border border-[#1F2937]">
                    {['All','Critical'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                                className={`font-mono px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all
                                    ${filter === f ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'text-[#6B7280] hover:text-[#9CA3AF]'}`}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/[0.03]">
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full gap-6 opacity-10">
                        <Terminal className="w-12 h-12" />
                        <span className="font-mono text-[10px] font-black tracking-[0.5em] uppercase">NO MESSAGES</span>
                    </div>
                )}
                {filtered.map(msg => (
                    <div key={msg.id} className="group/msg px-10 py-8 hover:bg-white/[0.02] transition-colors relative">
                        <div className="flex items-start justify-between gap-6 mb-4">
                            <div className="flex items-center gap-4">
                               <div className={`w-1 h-6 ${msg.sender === 'Alex' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                               <span className={`font-poppins font-black text-sm tracking-tight uppercase transition-all group-hover/msg:translate-x-1
                                   ${msg.sender === 'Alex' ? 'text-purple-400' : 'text-blue-400'}`}>
                                   {msg.sender}
                               </span>
                            </div>
                            <span className="font-mono text-[9px] text-white/10 tracking-widest font-bold uppercase transition-transform group-hover/msg:translate-x-2">[{msg.time}]</span>
                        </div>
                        <p className="font-inter text-[11px] text-[#9CA3AF] leading-relaxed mb-6 uppercase italic tracking-[0.02em]">{msg.text}</p>
                        
                        <div className="flex justify-end items-center gap-4">
                            <div className="h-[1px] flex-1 bg-white/[0.03]" />
                            <span className={`
                                font-mono text-[8px] font-black tracking-widest uppercase px-3 py-1 border
                                ${msg.status === 'Critical' ? 'bg-red-500/5 text-red-500 border-red-500/20' : 'bg-[#1F2937] text-[#6B7280] border-[#1F2937]'}
                            `}>
                                {msg.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Terminal Input Array */}
            <form onSubmit={handleSend} className="p-10 bg-black/40 border-t border-[#1F2937]">
                <div className="relative group/input">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                         <Terminal className="w-4 h-4 text-emerald-500/40" />
                         <span className="text-[9px] font-mono text-emerald-500/20 font-black tracking-widest group-focus-within/input:text-emerald-500/60 transition-colors uppercase">MESSAGE:</span>
                    </div>
                    <input
                        type="text" value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="TYPE A MESSAGE..."
                        className="font-mono w-full bg-white/[0.02] border border-[#1F2937] focus:border-[#14B8A6]/40 focus:bg-[#14B8A6]/[0.02] pl-36 pr-20 py-5 text-[11px] font-black tracking-widest text-[#14B8A6] placeholder-white/5 outline-none transition-all duration-700 uppercase"
                    />
                    <button type="submit"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-[#1F2937] hover:bg-[#14B8A6] border border-[#374151] hover:border-transparent flex items-center justify-center text-[#9CA3AF] hover:text-black transition-all duration-500 group-hover/input:border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.4)]">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
}
