import { create } from 'zustand'

export type GameState = 'menu' | 'playing' | 'gameover' | 'victory'

export type ChamberType = 'puzzle' | 'combat' | 'harvest' | 'boss'
export type ViewMode = 'fluid' | 'math' | 'hybrid'

interface GameStore {
  gameState: GameState
  chamber: number
  chamberType: ChamberType | null
  viewMode: ViewMode
  score: number
  energy: number // For boss or generic health
  
  // Settings
  soundVolume: number
  hapticIntensity: number

  setGameState: (state: GameState) => void
  nextChamber: () => void
  setViewMode: (mode: ViewMode) => void
  addScore: (points: number) => void
  setEnergy: (energy: number) => void
  
  setSoundVolume: (volume: number) => void
  setHapticIntensity: (intensity: number) => void
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'menu',
  chamber: 1,
  chamberType: null,
  viewMode: 'fluid',
  score: 0,
  energy: 100,
  soundVolume: 0.5,
  hapticIntensity: 0.6,

  setGameState: (state) => set({ gameState: state }),
  nextChamber: () => set((state) => {
    const next = state.chamber + 1
    let nextType: ChamberType = 'puzzle'
    if (next % 4 === 0) nextType = 'boss'
    else if (next % 3 === 0) nextType = 'combat'
    else if (next % 2 === 0) nextType = 'harvest'
    
    return { chamber: next, chamberType: nextType, energy: 100 }
  }),
  setViewMode: (mode) => set({ viewMode: mode }),
  addScore: (points) => set((state) => ({ score: state.score + points })),
  setEnergy: (energy) => set({ energy }),
  
  setSoundVolume: (volume) => set({ soundVolume: volume }),
  setHapticIntensity: (intensity) => set({ hapticIntensity: intensity }),
}))
