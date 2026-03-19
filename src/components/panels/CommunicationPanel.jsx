import { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { MessageSquare, AlertTriangle, Radio, Send } from 'lucide-react';

export default function CommunicationPanel() {
    const { messages, addMessage } = useDashboard();
    const [input, setInput] = useState('');
    const [filter, setFilter] = useState('All');

    const filteredMessages = filter === 'All'
        ? messages
        : messages.filter(m => m.status === filter);

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim()) {
            addMessage('Commander', input.trim(), 'Active');
            setInput('');
        }
    };

    return (
        <div className="bg-gray-800 backdrop-blur-lg bg-white/5 rounded-xl p-4 shadow-lg border border-gray-700 overflow-hidden hover:shadow-xl hover:scale-[1.02] hover:border-blue-500 transition-all duration-300 flex flex-col h-full animate-fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Radio className="w-5 h-5 text-green-400 animate-pulse" />
                    Live Comms Log
                </h2>
                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                    <button onClick={() => setFilter('All')} className={`px-3 py-1 text-xs rounded-md ${filter === 'All' ? 'bg-slate-700 text-slate-200' : 'text-slate-400 hover:text-slate-200'}`}>All</button>
                    <button onClick={() => setFilter('Critical')} className={`px-3 py-1 text-xs rounded-md ${filter === 'Critical' ? 'bg-slate-700 text-slate-200' : 'text-slate-400 hover:text-slate-200'}`}>Critical</button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3 min-h-0">
                {filteredMessages.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-sm italic h-32">
                        <MessageSquare className="w-8 h-8 opacity-20 mb-2" />
                        No messages found for this filter.
                    </div>
                )}
                {filteredMessages.map((msg) => (
                    <div key={msg.id} className="bg-slate-900 rounded-lg p-3 border border-slate-700/50 hover:border-slate-600 transition-colors animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`font-bold text-sm flex items-center gap-1 ${msg.sender === 'Commander' ? 'text-purple-400' : 'text-blue-400'}`}>
                                {(msg.sender === 'HQ Command' || msg.sender === 'Commander') && <AlertTriangle className={`w-3 h-3 ${msg.sender === 'Commander' ? 'text-purple-400' : 'text-red-400'}`} />}
                                {msg.sender}
                            </span>
                            <span className="text-xs font-mono text-slate-500">{msg.time}</span>
                        </div>

                        <p className="text-sm text-slate-300 leading-relaxed font-mono">
                            {msg.text}
                        </p>

                        <div className="mt-2 flex justify-end">
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${msg.status === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                msg.status === 'Active' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                    msg.status === 'Warning' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                        'bg-green-500/20 text-green-400 border border-green-500/30'
                                }`}>
                                {msg.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSend} className="mt-4 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSend(e);
                    }}
                    placeholder="Type message to all units..."
                    className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-500"
                />
                <button
                    onClick={handleSend}
                    className="p-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center shadow-md shadow-blue-500/20"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
}
