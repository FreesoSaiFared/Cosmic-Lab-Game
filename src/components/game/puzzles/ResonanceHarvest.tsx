import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../../store/useGameStore'
import { Text } from '@react-three/drei'

export const ResonanceHarvest = ({
  mathSettings,
  activeBeams,
  onComplete
}: {
  mathSettings: any
  activeBeams: any[]
  onComplete: () => void
}) => {
  const count = 10
  const [particles, setParticles] = useState(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      ),
      collected: false,
      targetPhi: Math.floor(Math.random() * 6) + 0.1 // random phi from 0 to 6
    }))
  })

  useFrame(() => {
    let allCollected = true;
    
    setParticles(prev => {
      let changed = false;
      const next = prev.map(p => {
        if (p.collected) return p;
        allCollected = false;
        
        let shouldCollect = false;
        for (const beam of activeBeams) {
          if (beam.position.distanceTo(p.pos) < 15) {
            if (Math.abs(mathSettings.phi - p.targetPhi) < 0.5) {
              shouldCollect = true;
            }
          }
        }
        if (shouldCollect) {
          changed = true;
          return { ...p, collected: true }
        }
        return p;
      });
      
      if (allCollected && changed) {
        setTimeout(onComplete, 1000)
      }
      return changed ? next : prev;
    })
  })

  const viewMode = useGameStore(state => state.viewMode)

  return (
    <group>
      {particles.map(p => !p.collected && (
        <group key={p.id} position={p.pos}>
          <mesh>
            <sphereGeometry args={[2, 16, 16]} />
            <meshBasicMaterial color="#00ff55" transparent opacity={0.8} wireframe={viewMode === 'math'} />
          </mesh>
          {(viewMode === 'hybrid' || viewMode === 'math') && (
            <Text position={[0, -4, 0]} fontSize={1.5} color="#00ff55">
              φ: {p.targetPhi.toFixed(1)}
            </Text>
          )}
        </group>
      ))}
    </group>
  )
}
