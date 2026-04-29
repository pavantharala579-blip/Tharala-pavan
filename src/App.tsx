import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Cpu, Music as MusicIcon, Gamepad2, Github } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#020205] text-[#e0e0f0] font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 flex flex-col gap-12">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                <Cpu className="w-6 h-6 text-black" />
             </div>
             <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase italic">SYNTH.CORE</h1>
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40">Integrated Entertainment Module</p>
             </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest opacity-60">
            <a href="#" className="hover:text-cyan-400 hover:opacity-100 transition-all">Interface</a>
            <a href="#" className="hover:text-cyan-400 hover:opacity-100 transition-all">System</a>
            <a href="#" className="hover:text-cyan-400 hover:opacity-100 transition-all">Network</a>
          </nav>

          <div className="flex items-center gap-4">
             <button className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-all">
                <Github className="w-5 h-5 opacity-60" />
             </button>
          </div>
        </header>

        <main className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar / Music Player Section */}
          <section className="lg:col-span-4 flex flex-col gap-8 order-2 lg:order-1">
             <div className="flex items-center gap-2 mb-2 px-2">
                <MusicIcon className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-mono uppercase tracking-[0.2em] opacity-80">Media Station</h2>
             </div>
             
             <MusicPlayer />

             <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-widest opacity-80">System Analytics</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-mono opacity-40 uppercase">Audio Engine</span>
                      <span className="text-sm font-mono text-cyan-400">ACTIVE</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-mono opacity-40 uppercase">GPU Load</span>
                      <span className="text-sm font-mono text-cyan-400">12.4%</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-mono opacity-40 uppercase">Latency</span>
                      <span className="text-sm font-mono text-cyan-400">4.1ms</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-mono opacity-40 uppercase">Buffer</span>
                      <span className="text-sm font-mono text-cyan-400">OPTIMIZED</span>
                   </div>
                </div>
             </div>
          </section>

          {/* Main Game Section */}
          <section className="lg:col-span-8 flex flex-col gap-6 order-1 lg:order-2">
             <div className="flex items-center gap-2 mb-2 px-2">
                <Gamepad2 className="w-4 h-4 text-fuchsia-400" />
                <h2 className="text-xs font-mono uppercase tracking-[0.2em] opacity-80">Execution Chamber</h2>
             </div>

             <motion.div
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
             >
                <SnakeGame />
             </motion.div>

             <div className="grid md:grid-cols-3 gap-4">
                {[
                  { label: "Stability", val: "99.2%", color: "text-cyan-400" },
                  { label: "Sync Status", val: "LOCKED", color: "text-fuchsia-400" },
                  { label: "Uptime", val: "02:14:55", color: "text-white" }
                ].map((stat, i) => (
                  <div key={i} className="bg-black/20 border border-white/5 rounded-2xl p-4 flex justify-between items-center">
                    <span className="text-[10px] font-mono uppercase opacity-40">{stat.label}</span>
                    <span className={`text-sm font-mono font-bold ${stat.color}`}>{stat.val}</span>
                  </div>
                ))}
             </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-[10px] font-mono uppercase tracking-widest">
           <div className="flex items-center gap-4">
              <span>© 2026 SYNTH.CORE TECHNOLOGIES</span>
              <span className="hidden md:inline">|</span>
              <span>EST. 4.195-2-AX</span>
           </div>
           <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors underline underline-offset-4">Legal</a>
              <a href="#" className="hover:text-white transition-colors underline underline-offset-4">API Documentation</a>
              <a href="#" className="hover:text-white transition-colors underline underline-offset-4">Emergency Protocol</a>
           </div>
        </footer>
      </div>
    </div>
  );
}

