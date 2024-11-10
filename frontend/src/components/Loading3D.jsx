import { Canvas } from '@react-three/fiber'
import { Text3D, Environment, Edges } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { LayerMaterial, Depth, Fresnel } from 'lamina'
import * as THREE from 'three'
import { Perf } from 'r3f-perf'

const Pointer = () => {
  const groupRef = useRef()
  const textRef = useRef()
  const materialRef = useRef()

  useEffect(() => {
    if (textRef.current) {
      // Compute the bounding box of the Text3D mesh
      const bbox = new THREE.Box3().setFromObject(textRef.current)
      const center = new THREE.Vector3()
      bbox.getCenter(center)

      // Adjust the position of the Text3D mesh to center it
      textRef.current.position.sub(center)
    }
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
    }

    const sin = Math.sin(state.clock.elapsedTime / 2)
    const cos = Math.cos(state.clock.elapsedTime / 2)
    materialRef.current.layers[0].origin.set(cos / 2, 0, 0)
    materialRef.current.layers[1].origin.set(cos, sin, cos)
    materialRef.current.layers[2].origin.set(sin, cos, sin)
    materialRef.current.layers[3].origin.set(cos, sin, cos)
  })

  const gradient = 0.5

  return (
    <>

        <Perf />
        
      <ambientLight intensity={1} />
      <Environment preset="city" />

      <group ref={groupRef}>
        <Text3D
          ref={textRef}
          font="./fonts/Archivo SemiExpanded Black_Regular.json"
          size={2}
          height={0.7}
        >
          H
          <Edges color="black" lineWidth={2} />
          <LayerMaterial ref={materialRef} toneMapped={false}>
            <Depth
              colorA="#ff0080"
              colorB="black"
              alpha={1}
              mode="normal"
              near={0.5 * gradient}
              far={0.5}
              origin={[0, 0, 0]}
            />
            <Depth
              colorA="blue"
              colorB="#f7b955"
              alpha={1}
              mode="add"
              near={2 * gradient}
              far={2}
              origin={[0, 1, 1]}
            />
            <Depth
              colorA="green"
              colorB="#f7b955"
              alpha={1}
              mode="add"
              near={3 * gradient}
              far={3}
              origin={[0, 1, -1]}
            />
            <Depth
              colorA="white"
              colorB="red"
              alpha={1}
              mode="overlay"
              near={1.5 * gradient}
              far={1.5}
              origin={[1, -1, -1]}
            />
            <Fresnel mode="add" color="white" intensity={0.5} power={1.5} bias={0.05} />
          </LayerMaterial>
        </Text3D>
      </group>

    </>
  )
}

export default function Loading3D() {
  return (
    <Canvas
      orthographic
      dpr={[1, 2]}
      camera={{ position: [0, 3, 10], zoom: 200 }}
    >
      <Pointer />
    </Canvas>
  )
}
