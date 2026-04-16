import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../../store/useGameStore'
import { Text } from '@react-three/drei'

export const DissonanceKnot = ({ 
  mathSettings,
  punchData,
  activeBeams,
  onDefeat 
}: { 
  mathSettings: any
  punchData: any
  activeBeams: any[]
  onDefeat: () => void 
}) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [health, setHealth] = useState(100)
  const viewMode = useGameStore(state => state.viewMode)

  const knotPosition = useMemo(() => {
    // Random position on the sphere surface (radius slightly above 80)
    const pos = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize().multiplyScalar(90)
    return pos
  }, [])

  // The 'secret' resonance of this enemy
  const targetK = useMemo(() => 0.5 + Math.random() * 0.5, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!meshRef.current) return

    // Floating motion
    meshRef.current.position.copy(knotPosition)
    meshRef.current.position.y += Math.sin(t * 2) * 5
    meshRef.current.rotation.x = t
    meshRef.current.rotation.y = t * 0.5

    // Check interaction with beams
    let isHit = false;
    for (const beam of activeBeams) {
      if (beam.position.distanceTo(meshRef.current.position) < 20) {
        // If the beam is close, check if math settings match the enemy's vulnerability
        if (Math.abs(mathSettings.k - targetK) < 0.1) {
          setHealth(prev => Math.max(0, prev - 1))
          isHit = true;
          // Shrink on hit
          meshRef.current.scale.setScalar(Math.max(0.1, health / 100))
        }
      }
    }

    if (health <= 0) {
      onDefeat()
    }
  })

  // In fluid mode it just looks like a black/red anomaly. 
  // In hybrid/math, you see its wave signature (targetK).
  return (
    <group position={knotPosition}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[5, 1.5, 100, 16]} />
        <meshPhysicalMaterial 
          color={health < 50 ? "#ff0000" : "#ff00ff"} 
          emissive="#aa0000"
          emissiveIntensity={health < 50 ? 2 : 0.5}
          wireframe={viewMode === 'math'}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {(viewMode === 'hybrid' || viewMode === 'math') && (
        <Text position={[0, -10, 0]} fontSize={2} color="#ff00ff">
          Target k: {targetK.toFixed(2)}
        </Text>
      )}
    </group>
  )
}
