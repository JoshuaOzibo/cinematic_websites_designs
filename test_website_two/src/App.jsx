import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Terminal, 
  Activity, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Database, 
  RefreshCw, 
  Code,
  CheckCircle,
  Play,
  Share2,
  LineChart,
  HardDrive
} from 'lucide-react';
import gsap from 'gsap';

// Mock generation outputs for the interactive playground
const PLAYGROUND_PROMPTS = [
  {
    input: "Configure a secure microservices proxy routing rule",
    output: `// Aether Edge Routing Config
const EdgeProxy = require('@aether/core-proxy');

const secureRouter = new EdgeProxy.Router({
  ssl: 'strict',
  rateLimit: { windowMs: 15 * 60 * 1000, max: 100 },
  allowedHosts: ['*.aether.network']
});

secureRouter.use('/api/v2/neural', {
  target: 'http://core-neurons-cluster',
  balancing: 'round-robin',
  encryption: 'AES-256-GCM'
});

module.exports = secureRouter;`
  },
  {
    input: "Initialize vector database search for embedding similarity",
    output: `// Vector Search Initialize
import { AetherVectorDB } from '@aether/db';

const db = new AetherVectorDB({ url: 'aether://vectordb.internal' });
await db.connect();

const results = await db.querySimilarity({
  embedding: userQueryEmbedding,
  metric: 'cosine',
  threshold: 0.94,
  limit: 5
});

console.log(\`Found \${results.length} cognitive matches.\`);`
  },
  {
    input: "Deploy auto-scaling policy based on neural queue length",
    output: `# scaling-policy.yaml
apiVersion: scaler.aether.io/v1alpha1
kind: NeuralAutoScaler
metadata:
  name: cognitive-engine-scaler
spec:
  minWorkers: 3
  maxWorkers: 150
  scaleFactor: 1.45
  cooldownPeriod: 45s
  metricSource:
    type: QueueLength
    queueName: neural-inference-pipeline
    targetValue: 200`
  }
];

// Sample stats for the chart
const CPU_SERIES = [
  [30, 45, 35, 60, 40, 75, 55, 90, 85, 95],
  [20, 30, 25, 40, 35, 50, 45, 60, 58, 65],
  [80, 85, 78, 92, 88, 96, 94, 98, 97, 99]
];

export default function App() {
  // Playground State
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [playgroundOutput, setPlaygroundOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('brain');

  // Bento Interactive State
  const [selectedConsoleMode, setSelectedConsoleMode] = useState('success');
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [nodeCount, setNodeCount] = useState(1024);
  const [cpuUsage, setCpuUsage] = useState(42);

  // Trigger typing animation in the playground
  const triggerGeneration = (index) => {
    if (isGenerating) return;
    setIsGenerating(true);
    setPlaygroundOutput('');
    setSelectedPrompt(index);

    const fullText = PLAYGROUND_PROMPTS[index].output;
    let currentIdx = 0;
    
    // Quick typing simulation
    const timer = setInterval(() => {
      if (currentIdx < fullText.length) {
        setPlaygroundOutput(prev => prev + fullText.charAt(currentIdx));
        currentIdx += 2; // Type 2 chars at a time for speed
      } else {
        clearInterval(timer);
        setIsGenerating(false);
      }
    }, 15);
  };

  // Node count ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setNodeCount(prev => prev + Math.floor(Math.random() * 5) - 2);
      setCpuUsage(prev => {
        const delta = Math.floor(Math.random() * 9) - 4;
        const newVal = prev + delta;
        return Math.max(20, Math.min(95, newVal));
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Update Console Logs dynamically
  useEffect(() => {
    const messages = {
      success: [
        '[SECURE] Handshake completed successfully',
        '[DB] Vector index cached (0.24ms)',
        '[ROUTER] Rerouted 450 requests to node-US-East',
        '[SYNC] Neural weights synchronized with master server'
      ],
      warning: [
        '[ROUTER] High queue length detected on gateway 3',
        '[SCALER] Auto-scaler cooling down for next 15s',
        '[CACHE] Cache eviction threshold reached (80%)',
        '[DB] Minor latency spike detected in cluster-B'
      ],
      error: [
        '[GATEWAY] Rate limit exceeded from IP 185.22.45.10',
        '[AUTH] Expired token rejected on /api/v2/embeddings',
        '[NODE] Cluster connection timed out (retrying...)',
        '[DEPLOY] Configuration mismatch in replication factor'
      ]
    };
    setConsoleLogs(messages[selectedConsoleMode]);
  }, [selectedConsoleMode]);

  // Run initial typing
  useEffect(() => {
    triggerGeneration(0);
  }, []);

  return (
    <div className="min-h-screen bg-[#030307] text-white overflow-hidden selection:bg-brand-purple/30 selection:text-white">
      
      {/* Background Neon Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-purple/10 blur-[160px]" />
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-indigo/8 blur-[180px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-brand-pink/5 blur-[140px]" />
      </div>

      {/* Floating Glassmorphic Navbar */}
      <nav className="fixed top-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-4xl z-50">
        <div className="glass-panel rounded-full px-6 py-3.5 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-indigo via-brand-purple to-brand-pink flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-sans font-black tracking-wider text-white uppercase text-base">Aether</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#hero" className="font-sans text-xs font-semibold uppercase tracking-wider text-text-slate hover:text-white transition-colors cursor-pointer">Platform</a>
            <a href="#playground" className="font-sans text-xs font-semibold uppercase tracking-wider text-text-slate hover:text-white transition-colors cursor-pointer">Playground</a>
            <a href="#features" className="font-sans text-xs font-semibold uppercase tracking-wider text-text-slate hover:text-white transition-colors cursor-pointer">Bento Grid</a>
            <a href="#modules" className="font-sans text-xs font-semibold uppercase tracking-wider text-text-slate hover:text-white transition-colors cursor-pointer">Modules</a>
          </div>

          <button className="bg-white text-black px-5 py-2 rounded-full font-sans text-xs font-bold uppercase tracking-wider hover:bg-brand-purple hover:text-white transition-all duration-300 shadow-[0_4px_16px_rgba(255,255,255,0.1)] cursor-pointer">
            Get Access
          </button>
        </div>
      </nav>

      {/* ─── Hero Section ────────────────────────────────────────────── */}
      <section id="hero" className="relative z-10 pt-40 pb-20 px-6 md:px-12 flex flex-col items-center text-center max-w-6xl mx-auto">
        {/* Glow Badge */}
        <div className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse" />
          <span className="font-sans text-[10px] font-bold tracking-[0.25em] text-brand-purple uppercase">AETHER RUNTIME v2.4</span>
        </div>

        {/* Heading */}
        <h1 className="font-heading font-extrabold text-5xl md:text-7xl lg:text-8xl tracking-tight text-white leading-tight uppercase">
          Dynamic AI <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink italic">Inference</span> Engine
        </h1>

        <p className="font-sans text-base md:text-xl text-text-slate max-w-2xl mx-auto mt-6 leading-relaxed font-light">
          A high-performance workspace providing zero-latency auto-scaling, neural routing, and real-time cognitive pipeline management.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <a
            href="#playground" 
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-purple text-white font-semibold uppercase tracking-widest text-xs shadow-[0_8px_32px_rgba(168,85,247,0.25)] hover:shadow-[0_8px_40px_rgba(168,85,247,0.45)] hover:scale-105 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
          >
            <span>Launch Engine</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <button className="px-8 py-4 rounded-xl border border-white/10 bg-white/3 font-semibold uppercase tracking-widest text-xs hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer">
            Read Docs
          </button>
        </div>
      </section>

      {/* ─── Interactive Playground ──────────────────────────────────── */}
      <section id="playground" className="relative z-10 py-16 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-heading font-black text-3xl uppercase tracking-tight italic">
            Cognitive Playground
          </h2>
          <p className="font-sans text-xs text-text-muted uppercase tracking-widest mt-1">
            Test our neural configuration synthesizer
          </p>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 glass-panel rounded-3xl p-6 border border-white/6 shadow-[0_30px_90px_rgba(0,0,0,0.8)]">
          {/* Options Panel (Left) */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            <span className="font-sans text-[10px] font-bold text-text-muted tracking-widest uppercase mb-2 block">Select Pipeline</span>
            {PLAYGROUND_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => triggerGeneration(i)}
                className={`w-full text-left p-4 rounded-xl border text-xs font-semibold transition-all duration-300 cursor-pointer flex items-center gap-3 ${
                  selectedPrompt === i 
                    ? 'border-brand-purple/50 bg-brand-purple/10 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                    : 'border-white/5 bg-white/2 text-text-muted hover:bg-white/5 hover:border-white/10'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${selectedPrompt === i ? 'bg-brand-purple' : 'bg-white/20'}`} />
                <span className="truncate">{prompt.input}</span>
              </button>
            ))}
          </div>

          {/* Terminal Console (Right) */}
          <div className="lg:col-span-8 bg-[#05050a] border border-white/8 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="font-mono text-[10px] text-text-muted ml-3">aether-generator.sh</span>
              </div>
              <span className="font-mono text-[9px] text-brand-purple uppercase tracking-widest font-bold">
                {isGenerating ? 'Synthesizing...' : 'READY'}
              </span>
            </div>

            {/* Editor Code */}
            <pre className="font-mono text-xs text-brand-indigo/90 leading-relaxed overflow-x-auto flex-1 select-text">
              <code>{playgroundOutput || '// Select a pipeline to start...'}</code>
            </pre>

            {/* Terminal Footer */}
            <div className="border-t border-white/5 pt-3 mt-4 flex justify-between items-center text-[10px] font-mono text-text-muted">
              <span>Lines: {playgroundOutput.split('\n').length}</span>
              <span className="flex items-center gap-1.5 text-brand-indigo">
                <Code size={11} /> Output Generated
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bento Grid Features ─────────────────────────────────────── */}
      <section id="features" className="relative z-10 py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold tracking-[0.2em] text-brand-purple uppercase px-4 py-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5">
            Architecture Specs
          </span>
          <h2 className="font-heading font-black text-4xl md:text-5xl uppercase tracking-tight italic mt-5">
            Bento Grid Dashboard
          </h2>
          <p className="font-sans text-sm text-text-slate max-w-xl mx-auto mt-2 leading-relaxed font-light">
            An overview of live performance indicators, telemetry diagnostics, and database sync statuses.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Network Ticker (Interactive) */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between h-72">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-brand-purple/10 text-brand-purple rounded-xl">
                <Activity size={20} />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-brand-purple uppercase bg-brand-purple/5 px-2 py-0.5 rounded border border-brand-purple/10">
                LIVE TELEMETRY
              </span>
            </div>
            <div>
              <span className="text-xs text-text-muted uppercase tracking-wider block">Network Nodes Connected</span>
              <h3 className="font-mono font-black text-4xl text-white mt-1">{nodeCount.toLocaleString()}</h3>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-purple transition-all duration-500" 
                style={{ width: `${(nodeCount - 1000) * 10}%` }}
              />
            </div>
          </div>

          {/* Card 2: Interactive Console Logs */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between h-72 md:col-span-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-indigo/10 text-brand-indigo rounded-xl">
                  <Terminal size={20} />
                </div>
                <span className="text-xs font-semibold text-white uppercase tracking-wider">System Event Logs</span>
              </div>
              
              {/* Filter tabs */}
              <div className="flex gap-1.5 bg-black/40 p-1 rounded-lg border border-white/5">
                {['success', 'warning', 'error'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedConsoleMode(mode)}
                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedConsoleMode === mode 
                        ? 'bg-brand-indigo text-white shadow' 
                        : 'text-text-muted hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Console Messages */}
            <div className="my-4 bg-black/30 border border-white/5 rounded-xl p-3 flex-1 flex flex-col gap-1.5 font-mono text-[10px] justify-center select-text overflow-y-auto">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedConsoleMode === 'success' ? 'bg-green-500' :
                    selectedConsoleMode === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="text-slate-300 truncate">{log}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-[9px] text-text-muted font-mono border-t border-white/5 pt-3">
              <span>Status: Synchronized</span>
              <span className="flex items-center gap-1"><RefreshCw size={10} className="animate-spin" /> Auto-Refreshing</span>
            </div>
          </div>

          {/* Card 3: Interactive CPU load chart */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between h-72 md:col-span-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-text-muted uppercase tracking-wider block">Real-time Inference Load</span>
                <h3 className="font-heading font-black text-2xl text-white mt-0.5">CPU Core Cluster</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-black text-brand-pink">{cpuUsage}%</span>
                <span className="w-2.5 h-2.5 rounded-full bg-brand-pink animate-ping" />
              </div>
            </div>

            {/* SVG Live Graphic Chart */}
            <div className="h-32 w-full mt-4 flex items-end">
              <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
                {/* SVG Graph path */}
                <path
                  d={`M 0 ${80 - cpuUsage * 0.7} L 30 ${80 - (cpuUsage + 10) * 0.7} L 60 ${80 - (cpuUsage - 15) * 0.7} L 90 ${80 - (cpuUsage + 5) * 0.7} L 120 ${80 - cpuUsage * 0.7} L 150 ${80 - (cpuUsage - 8) * 0.7} L 180 ${80 - (cpuUsage + 12) * 0.7} L 210 ${80 - cpuUsage * 0.7} L 240 ${80 - (cpuUsage + 15) * 0.7} L 270 ${80 - (cpuUsage - 10) * 0.7} L 300 ${80 - cpuUsage * 0.7}`}
                  fill="none"
                  stroke="url(#gradient-pink)"
                  strokeWidth="3"
                  className="transition-all duration-700 ease-in-out"
                />
                <defs>
                  <linearGradient id="gradient-pink" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <span className="text-[10px] font-mono text-text-muted mt-2 block border-t border-white/5 pt-2">
              Scale Mode: Dynamic Inflection
            </span>
          </div>

          {/* Card 4: Database Sync specs */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between h-72">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-brand-amber/10 text-brand-amber rounded-xl">
                <Database size={20} />
              </div>
              <span className="text-[10px] font-mono text-brand-amber uppercase font-semibold">
                ACTIVE
              </span>
            </div>
            <div>
              <span className="text-xs text-text-muted uppercase tracking-wider block">Vector Cache Sync</span>
              <h3 className="font-heading font-black text-2xl text-white mt-1">99.98% Latency</h3>
            </div>
            <div className="flex gap-2 items-center text-[10px] font-mono text-brand-amber">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-pulse" />
              <span>Edge synchronizer active</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Feature Tabs / Detail modules ───────────────────────────── */}
      <section id="modules" className="relative z-10 py-16 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading font-black text-3xl uppercase tracking-tight italic">
            Architecture Modules
          </h2>
          <p className="font-sans text-xs text-text-muted uppercase tracking-widest mt-1">
            Browse our core execution systems
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex justify-center gap-2 md:gap-4 mb-8">
          {[
            { id: 'brain', label: 'Cognitive Brain', icon: <Cpu size={14} /> },
            { id: 'scaler', label: 'Auto Scaler', icon: <Layers size={14} /> },
            { id: 'shield', label: 'Sentinel Shield', icon: <ShieldCheck size={14} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-full font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-105' 
                  : 'bg-white/5 border border-white/5 text-text-slate hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="glass-panel rounded-3xl p-8 border border-white/8 relative overflow-hidden">
          {activeTab === 'brain' && (
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <span className="text-[10px] font-bold text-brand-purple tracking-widest uppercase">MODULE A</span>
                <h3 className="font-heading font-black text-3xl text-white uppercase italic">Cognitive Hub</h3>
                <p className="font-sans text-sm text-text-slate leading-relaxed font-light">
                  A high-end vector indexing and embedding generation system capable of processing billions of semantic points. Integrates seamlessly with multi-modal neural pipelines.
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-purple">
                  <Zap size={14} /> 0.12ms Generation latency
                </div>
              </div>
              <div className="w-full md:w-64 h-48 bg-brand-purple/5 border border-brand-purple/15 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-shimmer animate-shimmer pointer-events-none" />
                <Cpu size={48} className="text-brand-purple animate-pulse" />
              </div>
            </div>
          )}

          {activeTab === 'scaler' && (
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <span className="text-[10px] font-bold text-brand-indigo tracking-widest uppercase">MODULE B</span>
                <h3 className="font-heading font-black text-3xl text-white uppercase italic">Horizontal Scaler</h3>
                <p className="font-sans text-sm text-text-slate leading-relaxed font-light">
                  Automatically spins up containers, compute nodes, and queue managers. Adapts dynamically to traffic peaks while scaling down to zero during idle intervals to minimize server compute bills.
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-indigo">
                  <Layers size={14} /> Scaled from 3 to 150 instances
                </div>
              </div>
              <div className="w-full md:w-64 h-48 bg-brand-indigo/5 border border-brand-indigo/15 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-shimmer animate-shimmer pointer-events-none" />
                <Layers size={48} className="text-brand-indigo animate-bounce" />
              </div>
            </div>
          )}

          {activeTab === 'shield' && (
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <span className="text-[10px] font-bold text-brand-pink tracking-widest uppercase">MODULE C</span>
                <h3 className="font-heading font-black text-3xl text-white uppercase italic">Sentinel Guard</h3>
                <p className="font-sans text-sm text-text-slate leading-relaxed font-light">
                  End-to-end token auditing, proxy access rate limits, and encryption routines. Protects key model coordinates and database instances from vector leaking, prompt injection, and brute-force inquiries.
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-pink">
                  <ShieldCheck size={14} /> SOC-2 Type II Certified
                </div>
              </div>
              <div className="w-full md:w-64 h-48 bg-brand-pink/5 border border-brand-pink/15 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-shimmer animate-shimmer pointer-events-none" />
                <ShieldCheck size={48} className="text-brand-pink" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA Section ─────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="glass-panel rounded-3xl p-10 md:p-16 text-center border border-white/10 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
          {/* Decorative aura */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none" />
          
          <h2 className="font-heading font-black text-4xl md:text-6xl text-white uppercase italic mb-6">
            Ready to deploy?
          </h2>
          
          <p className="font-sans text-base text-text-slate max-w-lg mx-auto mb-10 leading-relaxed font-light">
            Secure your allocation today and interface with the cognitive pipeline in seconds.
          </p>

          <button className="px-10 py-4 bg-white text-black hover:bg-brand-purple hover:text-white rounded-xl font-semibold uppercase tracking-widest text-xs shadow-[0_8px_30px_rgba(255,255,255,0.1)] hover:shadow-[0_8px_32px_rgba(168,85,247,0.4)] hover:scale-105 transition-all duration-300 cursor-pointer">
            Get Access Key
          </button>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-12 px-6 bg-[#010103]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-indigo to-brand-purple flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="font-sans font-bold tracking-wider text-white uppercase text-xs">AETHER</span>
          </div>

          <span className="font-sans text-[10px] text-text-muted font-light">
            © {new Date().getFullYear()} Aether Technologies. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
