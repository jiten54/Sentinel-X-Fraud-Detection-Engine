/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Search, 
  Bell,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Transaction {
  id: string;
  timestamp: number;
  amount: number;
  merchant: string;
  location: string;
  userId: string;
  deviceType: string;
  isFraud?: boolean;
  score: number;
  features: {
    txCountLastHour: number;
    avgAmountLast24h: number;
    distanceFromHome: number;
    isInternational: boolean;
  };
}

interface Stats {
  totalProcessed: number;
  lastHourCount: number;
  fraudAlerts: number;
  volume: string;
  health: string;
}

// --- Components ---

const StatCard = ({ title, value, icon: Icon, color, trend, unit }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-sm">
    <div className="flex justify-between items-start mb-1">
      <span className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">{title}</span>
      <Icon className={cn("w-3.5 h-3.5", color)} />
    </div>
    <div className="flex items-baseline gap-1.5">
      <span className="text-2xl font-bold text-white">{value}</span>
      {unit && <span className="text-xs font-normal text-slate-500">{unit}</span>}
      {trend && (
        <span className="text-[10px] text-emerald-500 font-mono">+{trend}%</span>
      )}
    </div>
  </div>
);

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial fetch
    fetch("/api/transactions")
      .then(res => res.json())
      .then(setTransactions);
    
    fetch("/api/stats")
      .then(res => res.json())
      .then(setStats);

    // Stream Setup
    const eventSource = new EventSource("/api/stream");
    
    eventSource.onmessage = (event) => {
      const data: Transaction = JSON.parse(event.data);
      setTransactions(prev => [data, ...prev].slice(0, 50));
      
      setStats(prev => prev ? ({
        ...prev,
        totalProcessed: prev.totalProcessed + 1,
        fraudAlerts: data.isFraud ? prev.fraudAlerts + 1 : prev.fraudAlerts,
        volume: (parseFloat(prev.volume) + data.amount).toFixed(2)
      }) : null);
    };

    return () => eventSource.close();
  }, []);

  const chartData = transactions.slice().reverse().map(t => ({
    time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    amount: t.amount,
    score: (t.score * 100).toFixed(0)
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans overflow-hidden flex flex-col h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Shield className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Sentinel-X <span className="text-blue-500 underline underline-offset-4 decoration-2">Fraud Engine</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">v2.4.0 Production • Kafka-Cluster-01</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full shadow-sm">
            <div className={cn("w-2 h-2 rounded-full bg-emerald-500", isLive && "animate-pulse")} />
            <span className="text-xs font-medium text-emerald-400">System Live</span>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
            <span className="text-slate-500">Model:</span>
            <span className="text-blue-400 font-mono">XGBoost-L3-Optimized</span>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shrink-0">
        <StatCard 
          title="Throughput" 
          value={stats?.totalProcessed || "0"} 
          unit="tx/sec"
          icon={Activity} 
          color="text-blue-500" 
        />
        <StatCard 
          title="Fraud Detected" 
          value={stats?.fraudAlerts || "0"} 
          icon={AlertTriangle} 
          color="text-red-500" 
          trend="1.2"
        />
        <StatCard 
          title="Volume Processed" 
          value={stats?.volume || "0.00"} 
          unit="$USD"
          icon={TrendingUp} 
          color="text-emerald-500" 
        />
        <StatCard 
          title="Feature Accuracy" 
          value="99.92" 
          unit="%"
          icon={Cpu} 
          color="text-purple-500" 
        />
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
        
        {/* Left: Transaction Stream (Adapted from Design Section 1) */}
        <section className="col-span-12 lg:col-span-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col min-h-0 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 rounded-t-2xl">
            <h2 className="text-sm font-bold text-white">Live Transaction Stream</h2>
            <span className="text-[10px] font-mono text-slate-500">Buffer: 50/s</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar" ref={scrollRef}>
            <AnimatePresence mode="popLayout" initial={false}>
              {transactions.map((tx) => (
                <motion.div
                  layout
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  onClick={() => setSelectedTx(tx)}
                  className={cn(
                    "flex items-center justify-between text-xs p-3 rounded-lg border transition-all cursor-pointer group",
                    tx.isFraud 
                      ? "bg-red-900/10 border-red-900/30 hover:bg-red-900/20 shadow-sm" 
                      : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 shadow-sm"
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-mono text-slate-400 text-[10px]">#{tx.id}</span>
                    <span className="text-white font-medium">{tx.merchant}</span>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-white font-bold">${tx.amount.toFixed(2)}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[8px] font-bold mt-1 tracking-wider border",
                      tx.isFraud 
                        ? "bg-red-900/50 text-red-400 border-red-800/50" 
                        : "bg-emerald-900/30 text-emerald-400 border-emerald-800/50"
                    )}>
                      {tx.isFraud ? "FRAUD" : "SAFE"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Center: Chart & Analysis (Adapted from Design Section 2) */}
        <section className="col-span-12 lg:col-span-5 flex flex-col gap-6 min-h-0">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col h-[60%] shrink-0 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Risk Variance Analysis
              </h2>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-blue-500 rounded-full" />
                 <span className="text-[10px] text-slate-500 font-mono">Inference Score</span>
              </div>
            </div>
            
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#475569" fontSize={9} hide />
                  <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} domain={[0, 100]} width={20} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '10px', borderRadius: '8px' }}
                    itemStyle={{ color: '#f1f5f9' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex-1 shadow-lg">
            <h2 className="text-sm font-bold text-white mb-4">Feature Importances</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>User Transaction Frequency</span>
                  <span className="text-blue-400">82%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "82%" }} className="bg-blue-500 h-1.5 rounded-full" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Merchant Risk Index</span>
                  <span className="text-blue-400">64%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "64%" }} className="bg-slate-700 h-1.5 rounded-full" />
                </div>
              </div>
              <div className="space-y-1.5 text-center mt-4">
                <p className="text-[10px] text-blue-300 leading-relaxed font-medium bg-blue-600/10 border border-blue-500/20 rounded-xl p-3">
                   Streaming pipeline auto-optimizing. <br/> Next batch retraining in 2h 40m.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Performance Metrics (Adapted from Design Section 3) */}
        <section className="col-span-12 lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col shadow-lg">
          <h2 className="text-sm font-bold text-white mb-4">Model Performance</h2>
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-xl border border-slate-800/50 shadow-inner">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                  <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="301.6" strokeDashoffset="18" className="text-blue-500 transition-all duration-1000" />
                </svg>
                <span className="absolute text-2xl font-bold text-white tracking-tighter">0.94</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-3 tracking-widest">F1-SCORE</p>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between items-end border-b border-slate-800 pb-3">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Precision</p>
                  <p className="text-lg font-bold text-white tabular-nums">0.92</p>
                </div>
                <div className="text-emerald-500 text-xs font-mono font-bold">+0.02%</div>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800 pb-3">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Recall</p>
                  <p className="text-lg font-bold text-white tabular-nums">0.96</p>
                </div>
                <div className="text-slate-500 text-xs font-mono">-0.01%</div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">ROC-AUC</p>
                  <p className="text-lg font-bold text-white tabular-nums">0.985</p>
                </div>
                <div className="text-blue-500 text-xs font-bold font-mono">Stable</div>
              </div>
            </div>
          </div>

          <button className="mt-8 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-md active:scale-95">
             System Diagnostics
          </button>
        </section>
      </div>

      {/* Investigation Modal (Redesigned as Alert Analysis Area) */}
      <AnimatePresence>
        {selectedTx && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40"
              onClick={() => setSelectedTx(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-lg bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-1 mb-6 flex justify-between items-center">
                 <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", selectedTx.isFraud ? "bg-red-500" : "bg-emerald-500")}></span> 
                  {selectedTx.isFraud ? "High Risk Investigation" : "Transaction Analysis"}
                </h2>
                <button onClick={() => setSelectedTx(null)} className="text-slate-500 hover:text-white p-1">
                  <RefreshCw className="w-4 h-4 rotate-45" />
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl mb-6 shadow-inner">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">ID: {selectedTx.id}</h3>
                    <p className="text-xs text-slate-500 font-mono">Flagged by: Inference_Engine_V.2</p>
                  </div>
                  <div className={cn("text-right font-bold text-2xl tabular-nums", selectedTx.isFraud ? "text-red-500" : "text-emerald-500")}>
                    {(selectedTx.score * 100).toFixed(0)}% <span className="text-[10px] block text-slate-500 uppercase tracking-widest">Score</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-xs border-t border-slate-800 pt-4">
                  <div className="flex justify-between"><span className="text-slate-500">Location:</span><span className="text-slate-200 text-right">{selectedTx.location}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Amount:</span><span className="text-slate-200 text-right">${selectedTx.amount.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Velocity:</span><span className="text-slate-200 text-right font-mono">{selectedTx.features.txCountLastHour} tx / 60s</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Merchant:</span><span className="text-slate-200 text-right">{selectedTx.merchant}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Device Target:</span><span className="text-blue-400 font-mono text-[10px] uppercase">{selectedTx.deviceType}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Distance Index:</span><span className="text-slate-200 text-right">{selectedTx.features.distanceFromHome}km</span></div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedTx(null)}
                  className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-sm"
                >
                  BLOCK TRANSACTION
                </button>
                <button 
                  onClick={() => setSelectedTx(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-4 rounded-xl text-xs transition-all"
                >
                  RESOLVE AS SAFE
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
