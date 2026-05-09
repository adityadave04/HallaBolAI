/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Send, 
  History, 
  Smartphone, 
  Zap, 
  Megaphone, 
  Users, 
  ChevronRight,
  Plus,
  Loader2,
  Trash2
} from 'lucide-react';
import { generateCommentary } from './geminiService';
import { BallEvent, RR_COLORS } from './types';

export default function App() {
  const [events, setEvents] = useState<BallEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [tacticalContext, setTacticalContext] = useState('');
  
  // Form State
  const [currentOver, setCurrentOver] = useState(0);
  const [currentBall, setCurrentBall] = useState(1);
  const [batsman, setBatsman] = useState('Vaibhav Suryavanshi');
  const [bowler, setBowler] = useState('Opponent Bowler');
  const [runs, setRuns] = useState(0);
  const [isWicket, setIsWicket] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const addEvent = async (customEvent?: Partial<BallEvent>, context?: string) => {
    setLoading(true);
    
    const newEvent: Partial<BallEvent> = customEvent || {
      over: currentOver,
      ball: currentBall,
      batsman,
      bowler,
      runs,
      wicket: isWicket,
      isFour: runs === 4,
      isSix: runs === 6,
    };

    const comm = await generateCommentary(newEvent, context || tacticalContext);
    
    const finalEvent: BallEvent = {
      ...newEvent as BallEvent,
      id: crypto.randomUUID(),
      commentary: comm,
      timestamp: Date.now(),
    };

    setEvents(prev => [...prev, finalEvent]);
    
    // Auto-increment balls/overs if not custom
    if (!customEvent) {
      if (currentBall === 6) {
        setCurrentBall(1);
        setCurrentOver(prev => prev + 1);
      } else {
        setCurrentBall(prev => prev + 1);
      }
    }
    
    setLoading(false);
  };

  const clearHistory = () => {
    if (confirm('Clear match history?')) {
      setEvents([]);
    }
  };

  const quickScenario = (type: string) => {
    switch(type) {
      case 'vaibhav_six':
        addEvent({ 
          batsman: 'Vaibhav Suryavanshi', 
          runs: 6, 
          isSix: true, 
          over: currentOver, 
          ball: currentBall 
        }, 'Powerplay aggression');
        break;
      case 'chahal_wicket':
        addEvent({ 
          bowler: 'Yuzvendra Chahal', 
          wicket: true, 
          wicketType: 'Caught', 
          over: currentOver, 
          ball: currentBall 
        }, 'Middle-overs spin choke');
        break;
      case 'samson_four':
        addEvent({ 
          batsman: 'Sanju Samson', 
          runs: 4, 
          isFour: true, 
          over: currentOver, 
          ball: currentBall 
        }, 'Captain leading from front');
        break;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-100 font-sans overflow-hidden">
      {/* Immersive Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-[#D11D55] via-[#1D4B8B] to-[#020617] shadow-2xl border-b border-white/10 shrink-0">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center p-1 shadow-[0_0_15px_rgba(209,29,85,0.6)]">
            <div className="text-[#1D4B8B] font-black text-xl">RR</div>
          </div>
          <div>
            <h1 className="text-xs uppercase tracking-widest text-pink-200 font-bold mb-1">Live From Sawai Mansingh Stadium</h1>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic text-white">Halla Bol AI</span>
              <span className="text-sm text-pink-200 opacity-80 uppercase font-bold">(Commentary Box)</span>
            </div>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">Session Mode</div>
          <div className="text-xl font-bold text-yellow-400">Live Reaction Intel</div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar: Atmosphere & Input */}
        <aside className="w-80 bg-[#060B26]/50 border-r border-white/5 flex flex-col gap-6 p-4 overflow-y-auto overflow-x-hidden">
          
          {/* Atmosphere Visualizer */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-[10px] uppercase tracking-wider text-pink-400 font-bold mb-2">Stadium Atmosphere</h3>
            <div className="flex items-end gap-1 h-12 mb-2">
              {[60, 90, 40, 100, 80, 55, 95].map((h, i) => (
                <div 
                  key={i} 
                  style={{ height: `${h}%` }} 
                  className={`flex-1 rounded-t-sm ${i === 3 ? 'bg-white animate-pulse shadow-[0_0_10px_#D11D55]' : 'bg-pink-500'}`} 
                />
              ))}
            </div>
            <p className="text-xs font-serif italic text-pink-100">"Halla Bol! Halla Bol!"</p>
          </div>

          {/* Tactical Intel / Scenarios */}
          <div className="bg-[#1D4B8B]/20 rounded-xl p-4 border border-[#1D4B8B]/40">
            <h3 className="text-[10px] uppercase tracking-wider text-blue-300 font-bold mb-3 flex items-center gap-2">
              <Zap size={12} /> Tactical Quick-Actions
            </h3>
            <div className="space-y-2">
              <button onClick={() => quickScenario('vaibhav_six')} className="w-full text-left bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-all group">
                <p className="text-[10px] text-slate-400">PRODIGY AGGRESSION</p>
                <p className="text-xs font-semibold group-hover:text-yellow-400">Vaibhav 6+ Powerplay</p>
              </button>
              <button onClick={() => quickScenario('chahal_wicket')} className="w-full text-left bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-all group">
                <p className="text-[10px] text-slate-400">SPIN CHOKE</p>
                <p className="text-xs font-semibold group-hover:text-pink-400">Yuzi Chahal Wicket</p>
              </button>
              <button onClick={() => quickScenario('samson_four')} className="w-full text-left bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-all group">
                <p className="text-[10px] text-slate-400">CAPTAIN'S CLASS</p>
                <p className="text-xs font-semibold group-hover:text-blue-400">Sanju Samson Boundary</p>
              </button>
            </div>
          </div>

          {/* Data Input Form */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
             <h3 className="text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-white/5 pb-2">Manual Ball Entry</h3>
             
             <div className="grid grid-cols-2 gap-2">
                <input 
                  type="number" value={currentOver} onChange={e => setCurrentOver(Number(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-bold focus:border-rr-pink outline-none" placeholder="Over"
                />
                <input 
                  type="number" value={currentBall} onChange={e => setCurrentBall(Number(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-bold focus:border-rr-pink outline-none" placeholder="Ball"
                />
             </div>

             <input 
              type="text" value={batsman} onChange={e => setBatsman(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs focus:border-rr-pink outline-none" placeholder="Batsman"
            />
            
            <input 
              type="text" value={bowler} onChange={e => setBowler(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs focus:border-rr-pink outline-none" placeholder="Bowler"
            />

            <div className="grid grid-cols-2 gap-2">
              <select 
                value={runs} onChange={e => setRuns(Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-bold outline-none"
              >
                {[0,1,2,3,4,6].map(r => (
                  <option key={r} value={r} className="bg-slate-900">{r} Runs</option>
                ))}
              </select>
              <button 
                onClick={() => setIsWicket(!isWicket)}
                className={`py-2 px-3 rounded-lg text-[10px] font-black uppercase transition-all ${isWicket ? 'bg-red-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 font-bold'}`}
              >
                {isWicket ? '!!! WICKET !!!' : 'NO WICKET'}
              </button>
            </div>

            <button 
              onClick={() => addEvent()}
              disabled={loading}
              className="w-full bg-rr-pink hover:bg-pink-600 text-white py-3 rounded-lg font-black uppercase text-xs tracking-widest shadow-lg shadow-pink-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : 'Generate Live Call'}
            </button>
          </div>

          <div className="mt-auto">
            <div className="bg-gradient-to-t from-[#D11D55]/30 to-transparent p-4 rounded-xl border border-[#D11D55]/20">
              <p className="text-[10px] font-bold text-pink-400">ACTIVE PHILOSOPHY</p>
              <p className="text-xs font-bold">RR Fan Tilt • Hinglish • Halla Bol Spirit</p>
            </div>
          </div>
        </aside>

        {/* Main Content: Bilingual Commentary Feed */}
        <main className="flex-1 flex flex-col p-6 space-y-4 overflow-hidden relative">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 italic">Ball-by-Ball Commentary Feed</h2>
            <button onClick={clearHistory} className="text-white/20 hover:text-red-400 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
          
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-4 pr-2 pb-24 mt-4"
          >
            <AnimatePresence initial={false}>
              {events.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                  <Megaphone size={48} className="mb-4 opacity-10" />
                  <p className="font-black uppercase tracking-[0.3em] text-xs">Waiting for the spark...</p>
                </div>
              ) : (
                [...events].reverse().map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`bg-white/5 backdrop-blur-md rounded-2xl p-5 border-l-4 shadow-2xl relative overflow-hidden group ${
                      event.wicket ? 'border-red-500' : 
                      event.isSix ? 'border-yellow-500' : 
                      event.isFour ? 'border-pink-500' : 'border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black px-2 py-0.5 rounded ${
                          event.wicket ? 'bg-red-500 text-white' : 
                          event.isSix ? 'bg-yellow-500 text-black' : 
                          event.isFour ? 'bg-pink-500 text-white' : 'text-slate-400 bg-white/5'
                        }`}>
                          {event.over}.{event.ball} • {event.wicket ? 'WICKET!' : event.runs === 6 ? 'SIX!' : event.runs === 4 ? 'FOUR!' : `${event.runs} RUN`}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        {event.bowler} ⚡ {event.batsman}
                      </span>
                    </div>
                    <p className="text-xl leading-relaxed font-light text-slate-200">
                      {event.commentary}
                    </p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-2">
                        {(event.isSix || event.isFour) && (
                          <div className="text-[10px] font-black uppercase tracking-tighter py-1 px-2 bg-white/10 rounded flex items-center gap-1">
                            <Zap size={10} className="text-yellow-400" /> Boundary Pulse
                          </div>
                        )}
                        {event.batsman.includes('Suryavanshi') && (
                          <div className="text-[10px] font-black uppercase tracking-tighter py-1 px-2 bg-blue-500/20 text-blue-300 rounded flex items-center gap-1">
                            <div className="animate-pulse">✨</div> Prodigy Special
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-white/20 font-mono">
                        {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Interactive Fan Bar */}
          <div className="absolute bottom-6 left-6 right-6 bg-rr-blue rounded-full px-6 py-3 flex items-center justify-between border border-white/20 shadow-2xl backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-white/60">HALLA BOL PULSE:</span>
              <span className="bg-rr-pink text-[10px] px-2 py-1 rounded-full font-black tracking-tighter animate-pulse">LIVE REACTION</span>
            </div>
            <div className="flex gap-6 items-center">
              <div className="text-xs flex items-center gap-1">❤️ <span className="font-mono font-bold text-pink-300">{events.length * 12 + 42}K</span></div>
              <div className="text-xs flex items-center gap-1">🔥 <span className="font-mono font-bold text-yellow-400">ACTIVE</span></div>
              <div className="text-[10px] text-white/40 font-black uppercase tracking-widest hidden sm:block">SMS Stadium Desk</div>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Ticker */}
      <footer className="h-8 bg-black/40 border-t border-white/5 flex items-center px-4 overflow-hidden shrink-0">
        <div className="flex items-center gap-8 whitespace-nowrap text-[10px] tracking-widest font-bold animate-marquee">
          <span className="text-rr-pink">LATEST INTEL:</span>
          <span className="text-slate-300">Yuzvendra Chahal 3-24 (4.0) • Trent Boult 2-18 (3.0) • Sanju Samson 42*(28) • Vaibhav Suryavanshi 21*(10) • SMS peaks at 112dB</span>
          <span className="text-slate-500">|</span>
          <span className="text-yellow-500 uppercase">Rajasthan Royals dominating the middle overs...</span>
        </div>
      </footer>
    </div>
  );
}
