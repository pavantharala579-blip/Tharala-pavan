import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { TRACKS } from '../constants';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col gap-6 shadow-2xl relative overflow-hidden group">
      {/* Background Visualizer Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="flex items-end justify-between h-full w-full gap-1 p-2">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              animate={isPlaying ? { height: `${Math.random() * 100}%` } : { height: '10%' }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full bg-cyan-500 rounded-t-full"
            />
          ))}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex gap-4 relative z-10">
        <motion.div 
          key={currentTrack.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        >
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
               <motion.div 
                 animate={{ scale: [1, 1.2, 1] }} 
                 transition={{ repeat: Infinity, duration: 1.5 }}
               >
                 <Music className="w-6 h-6 text-white" />
               </motion.div>
            </div>
          )}
        </motion.div>

        <div className="flex flex-col justify-center flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              <h3 className="text-xl font-bold text-white leading-tight">{currentTrack.title}</h3>
              <p className="text-sm text-cyan-400/80 font-mono uppercase tracking-widest">{currentTrack.artist}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col gap-2 relative z-10">
        <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-cyan-500"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'linear', duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono text-white/40">
          <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
          <span>{audioRef.current && !isNaN(audioRef.current.duration) ? formatTime(audioRef.current.duration) : '0:00'}</span>
        </div>
      </div>

      <div className="flex justify-between items-center relative z-10 px-2">
        <div className="flex items-center gap-6">
          <button onClick={handlePrev} className="text-white/60 hover:text-white transition-colors">
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 bg-white text-black flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </motion.button>
          <button onClick={handleNext} className="text-white/60 hover:text-white transition-colors">
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-white/40" />
          <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
             <div className="w-2/3 h-full bg-white/60" />
          </div>
        </div>
      </div>
    </div>
  );
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
