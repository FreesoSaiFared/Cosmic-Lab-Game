import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../../store/useGameStore'
import { Text } from '@react-three/drei'

export const BossEntity = ({ 
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
  const [health, setHealth] = useState(1000)
  const viewMode = useGameStore(state => state.viewMode)

  const targetW = useMemo(() => 2.0 + Math.random() * 5.0, []) // Boss requires specific frequency

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!meshRef.current) return

    // Central ominous floating
    meshRef.current.position.y = Math.sin(t) * 10
    meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.5
    meshRef.current.rotation.y = t * 0.2

    // Pulse size
    const scale = 2 + Math.sin(t * 2) * 0.2
    
    // Check damage
    let hit = false;
    for (const beam of activeBeams) {
      if (beam.position.distanceTo(meshRef.current.position) < 40) {
        if (Math.abs(mathSettings.w - targetW) < 0.2) {
          setHealth(prev => Math.max(0, prev - 2))
          hit = true;
          meshRef.current.rotation.y += 0.5 // spin on hit
        }
      }
    }

    if (punchData && punchData.position.distanceTo(meshRef.current.position) < 50) {
        if (Math.abs(mathSettings.w - targetW) < 0.5) {
            setHealth(prev => Math.max(0, prev - 20))
            hit = true;
        }
    }

    meshRef.current.scale.setScalar(scale * (Math.max(0.1, health / 1000)))

    if (health <= 0) {
      onDefeat()
    }
  })

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[15, 2]} />
        <meshPhysicalMaterial 
          color="#ff00ff"
          emissive="#5500aa"
          emissiveIntensity={1}
          wireframe={viewMode === 'math'}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {(viewMode === 'hybrid' || viewMode === 'math') && (
        <Text position={[0, -25, 0]} fontSize={5} color="#ff00ff">
          Target w: {targetW.toFixed(2)}
        </Text>
      )}
      
      {/* Boss Health Bar 3D */}
      <mesh position={[0, 25, 0]}>
         <planeGeometry args={[20 * (health/1000), 1]} />
         <meshBasicMaterial color="#ff00ff" />
      </mesh>
    </group>
  )
}
