import React from 'react'
import { useGameStore } from '../../store/useGameStore'
import { motion, AnimatePresence } from 'motion/react'
import { Battery, Activity, Info, Trophy } from 'lucide-react'

export const HUD = () => {
  const { gameState, chamber, chamberType, score, energy, viewMode } = useGameStore()

  if (gameState !== 'playing') return null

  return (
    <div className="absolute inset-0 pointer-events-none z-50 p-6 flex flex-col justify-between">
      {/* Top HUD */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4 bg-black/50 backdrop-blur-md border border-cyan-500/30 p-4 rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.1)]">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-cyan-400">Chamber</span>
            <span className="text-2xl font-light text-white">{chamber}</span>
          </div>
          <div className="w-[1px] h-8 bg-cyan-500/30 mx-2" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-cyan-400">Class</span>
            <span className="text-sm uppercase tracking-widest text-white/80">{chamberType}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-black/50 backdrop-blur-md border border-[#ff00ff]/30 p-4 rounded-xl shadow-[0_0_20px_rgba(255,0,255,0.1)]">
          <Trophy size={20} className="text-[#ff00ff]" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-[#ff00ff]">Resonance</span>
            <span className="text-xl font-mono text-white">{score}</span>
          </div>
        </div>
      </div>

      {/* Center Screen Messages */}
      <div className="self-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${chamber}-${chamberType}`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1 }}
            className="text-center mt-20"
          >
            {chamberType === 'puzzle' && <h1 className="text-4xl text-cyan-300 font-light tracking-[0.2em] uppercase blur-[0.5px]">Harmonic Lock Detected</h1>}
            {chamberType === 'combat' && <h1 className="text-4xl text-[#ff0055] font-light tracking-[0.2em] uppercase blur-[0.5px]">Dissonance Knot Detected</h1>}
            {chamberType === 'harvest' && <h1 className="text-4xl text-[#00ff55] font-light tracking-[0.2em] uppercase blur-[0.5px]">Resonance Harvest Sequence</h1>}
            {chamberType === 'boss' && <h1 className="text-4xl text-[#ff00ff] font-light tracking-[0.2em] uppercase blur-[0.5px]">VORTEX INTELLIGENCE INCOMING</h1>}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom HUD */}
      <div className="flex justify-between items-end">
        <div className="bg-black/50 backdrop-blur-md border border-white/10 p-4 rounded-xl max-w-sm">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-cyan-400" />
            <span className="text-[10px] uppercase tracking-widest text-cyan-400">Suit Diagnostics</span>
          </div>
          <div className="flex items-center gap-4">
            <Battery size={24} className={energy < 30 ? "text-red-500" : "text-cyan-400"} />
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${energy < 30 ? 'bg-red-500' : 'bg-cyan-400'}`}
                animate={{ width: `${energy}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="font-mono text-sm">{Math.floor(energy)}%</span>
          </div>
        </div>

        <div className="bg-black/50 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-white/50">Current Sensor Mode</span>
            <span className="text-sm font-bold uppercase tracking-widest text-cyan-300">{viewMode}</span>
          </div>
          <Info size={24} className="text-white/50" />
        </div>
      </div>
    </div>
  )
}
