import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { useGameStore } from '../../../store/useGameStore'

export const HarmonicLock = ({
  punchData,
  onUnlock
}: {
  punchData: any
  onUnlock: () => void
}) => {
  const [nodes, setNodes] = useState(() => [
    { id: 1, pos: new THREE.Vector3(50, 50, 50).normalize().multiplyScalar(85), active: false },
    { id: 2, pos: new THREE.Vector3(-50, 50, -50).normalize().multiplyScalar(85), active: false },
    { id: 3, pos: new THREE.Vector3(0, -70, 0).normalize().multiplyScalar(85), active: false },
  ])

  const viewMode = useGameStore(state => state.viewMode)

  useFrame(() => {
    // Check if punch hits any inactive node
    if (punchData) {
      setNodes(prev => {
        let changed = false;
        const newNodes = prev.map(n => {
          if (!n.active && punchData.position.distanceTo(n.pos) < 30) {
            changed = true;
            return { ...n, active: true }
          }
          return n;
        });

        if (changed && newNodes.every(n => n.active)) {
          // Solved
          setTimeout(onUnlock, 1000);
        }

        return changed ? newNodes : prev;
      });
    }
  })

  return (
    <group>
      {nodes.map(node => (
        <group key={node.id} position={node.pos}>
          <mesh>
            <octahedronGeometry args={[5]} />
            <meshStandardMaterial 
              color={node.active ? '#00ff55' : '#aaaaaa'} 
              emissive={node.active ? '#00ff55' : '#000000'}
              emissiveIntensity={node.active ? 2 : 0}
              wireframe={viewMode === 'math'}
            />
          </mesh>
          {(viewMode === 'hybrid' || viewMode === 'math') && (
            <Text position={[0, -8, 0]} fontSize={2} color="#ffffff">
              {node.active ? "RESONANCE ENGAGED" : "AWAITING IMPULSE"}
            </Text>
          )}
        </group>
      ))}
    </group>
  )
}
