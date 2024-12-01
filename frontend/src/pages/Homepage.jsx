import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Merged, OrbitControls, Clone, useGLTF, meshBounds  } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect, Suspense, useMemo, useContext, createContext, useCallback } from 'react'
import * as THREE from 'three'
import { Perf } from 'r3f-perf'
import logo from '/Holofund.png';
import { Physics, InstancedRigidBodies, RigidBody, CuboidCollider, BallCollider, CylinderCollider } from '@react-three/rapier'
import { ShadowMaterial } from 'three'

function Cursor({ vec = new THREE.Vector3() }) {
    const ref = useRef()
    useFrame(({ mouse, viewport }) => {
      vec.lerp({ x: (mouse.x * viewport.width) / 2, y: (mouse.y * viewport.height) / 2, z: 3 }, 0.2)
      ref.current?.setNextKinematicTranslation(vec)
    })
    return (
      <RigidBody position={[100, 100, 100]} type="kinematicPosition" colliders={false} ref={ref}>
        <CylinderCollider args={[10, .1]} rotation={[Math.PI / 2, 0, 0]} />
      </RigidBody>
    )
  }

  function LoadingScreen() {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="gray" />
      </mesh>
    );
  }


export function Model(props) {

    const { nodes, materials } = useGLTF('/dollarsign.glb')

    const dollarSignCount = 400;

    const instances = useMemo(() => 
    {
        const instances = []

        for (let i = 0; i < dollarSignCount; i++)
        {
            instances.push({
            key: 'instance_' + i,
            position: 
            [ 
                (Math.random() - 0.5) * 8,
                8 + (i / 8),
                (Math.random() - 0.5) * 5,
            ],
            rotation: [ Math.random(), Math.random(), Math.random() ],
            scale: [2, 2, 2],
            })
        }

        return instances;

    }, [])



    return (
        <InstancedRigidBodies instances={instances}>
        <instancedMesh 
        castShadow 
        receiveShadow 
        args={[nodes.Text.geometry, nodes.Text.material, dollarSignCount]} 
        >
        <meshStandardMaterial color="gold" roughness={.1} />
        </instancedMesh>
    </InstancedRigidBodies>
    )
  }
  

useGLTF.preload('/dollarsign.glb')

  
  const Pointer = () => {
    return (
      <Canvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
        }}
        gl={{ alpha: true }}
        camera={{ position: [0, 0, 10], fov: 32.5, near: 1, far: 100 }}
        shadows
      >
        <Perf position='bottom-right'/>
        {/* <OrbitControls makeDefault /> */}
        <ambientLight intensity={.5} />
        <Environment castShadow preset="city" />
        <directionalLight castShadow position={ [1, 2, 3] } intensity={ 1.5 } />
        

        <Physics gravity={[0, -8, 0]} >
            <Model />
            
            <Cursor />
            <RigidBody type='fixed'>
                <CuboidCollider args={ [ 5, 20, 0.5 ] } position={ [ 0, 1, 5.5 ] } />
                <CuboidCollider args={ [ 5, 20, 0.5 ] } position={ [ 0, 1, - 5.5 ] } />
                <CuboidCollider args={ [ 0.5, 20, 5 ] } position={ [ 5.5, 1, 0 ] } />
                <CuboidCollider args={ [ 0.5, 20, 5 ] } position={ [ - 5.5, 1, 0 ] } />

                <mesh receiveShadow position-y={-1.25}>
                    <boxGeometry args={[15, 0.5, 15]} />
                    <shadowMaterial transparent opacity={0.5} />
                </mesh>
            </RigidBody>
        </Physics>
      </Canvas>
    );
  };

  function LandingPage() {
    return (
      <div className="relative min-h-screen bg-gray-100 overflow-hidden">

  
        {/* Header */}
        <header className="relative z-20 flex justify-between items-center p-6 bg-white bg-opacity-80 shadow-md">
          {/* Logo and Company Name */}
          <div className="flex items-center">
            <img src={logo} alt="HoloFund Logo" className="h-12 w-12 mr-1" />
            <span className="text-2xl font-bold text-gray-800">HoloFund</span>
          </div>
  
          {/* Navigation Buttons */}
          <div>
            <button className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-100">
              Login
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
              Register
            </button>
          </div>
        </header>
  
        {/* Main Content */}
        <main className="relative z-20 flex flex-col items-center justify-center mt-20">
          <h1 className="text-5xl font-semibold text-gray-800">Don't Let Those Receipts Pile Up</h1>
          {/* Placeholder for additional content */}
        </main>
        <Suspense fallback={null}>
            {/* React Three Fiber Canvas Overlay */}
            <Pointer />
        </Suspense>
      </div>
    );
  }


export default function Homepage() {
  return (
    <div>
        <LandingPage/>
    </div>
  )
}
