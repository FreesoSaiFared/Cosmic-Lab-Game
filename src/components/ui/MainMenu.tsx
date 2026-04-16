import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGameStore } from '../../store/useGameStore'

export const MainMenu = ({ onStartVR, vrSupported }: { onStartVR: () => void, vrSupported: boolean | null }) => {
  const { gameState, setGameState } = useGameStore()

  if (gameState !== 'menu') return null

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        className="bg-black/80 border border-cyan-500/50 p-12 rounded-3xl text-center max-w-xl shadow-[0_0_50px_rgba(0,255,255,0.1)] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />
        
        <h1 className="text-5xl font-light tracking-tight text-white mb-2 relative z-10">
          RESONANCE DIVER
        </h1>
        <h2 className="text-xl text-cyan-400 tracking-[0.3em] font-bold uppercase mb-8 relative z-10">
          The Glass Sea
        </h2>

        <p className="text-white/60 mb-12 leading-relaxed font-light relative z-10">
          Descend into the visceral mathematics of the cosmos.
          Modulate the fluid geometry of space, solve harmonic locks, and neutralize dissonance.
        </p>

        <div className="flex flex-col gap-4 relative z-10">
          <button 
            onClick={() => {
              setGameState('playing')
            }}
            className="w-full py-4 bg-white hover:bg-cyan-100 text-black rounded-full font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Commence Dive (Desktop)
          </button>
          
          <button 
            onClick={() => {
              setGameState('playing')
              onStartVR()
            }}
            disabled={vrSupported === false}
            className={`w-full py-4 border rounded-full font-bold uppercase tracking-widest transition-all ${
              vrSupported === false 
                ? 'border-white/10 text-white/30 cursor-not-allowed bg-black/50' 
                : 'border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]'
            }`}
          >
            {vrSupported === false ? 'XR Not Supported' : 'Commence Dive (VR)'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
