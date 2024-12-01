import { Canvas, useThree } from '@react-three/fiber'
import { Environment, useGLTF  } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect, Suspense, useMemo} from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { Perf } from 'r3f-perf'
import logo from '/Holofund.png';
import { Physics, InstancedRigidBodies, RigidBody, CuboidCollider, BallCollider, CylinderCollider } from '@react-three/rapier'
import { ShadowMaterial } from 'three'

// Handles cursor input
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

// Creates model instances
export function Model(props) {

    const { nodes, materials } = useGLTF('/dollarsign.glb')

    const dollarSignCount = 300;

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
        <meshStandardMaterial color="gold" roughness={.2} metalness={.8} />
        </instancedMesh>
    </InstancedRigidBodies>
    )
}

useGLTF.preload('/dollarsign.glb')

// Creates Canvas and physics
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
        
            {/* <Perf position='bottom-right'/> */}
            <ambientLight intensity={.5} />
            <Environment castShadow preset="lobby" />
            <directionalLight castShadow position={ [1, 2, 0] } intensity={ 4.5 } />
            
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

// Renders the actual page
function LandingPage() {
  const navigate = useNavigate();

    return (
      <>
        {/* React Three Fiber Canvas Layer */}
        <div className="fixed inset-0 z-10">
          <Suspense fallback={null}>
            <Pointer />
          </Suspense>
        </div>
  
        {/* Content Layer */}
        <div className="relative min-h-screen flex flex-col">
          {/* Header */}
          <header className="relative z-10 flex justify-between items-center p-6 opacity-80 shadow-md bg-custom-gradient animate-gradient">
            {/* Logo and Company Name */}
            <div className="flex items-center">
              <img src={logo} alt="HoloFund Logo" className="h-12 w-12 mr-1" />
              <span className="text-3xl font-bold text-gray-800">Holofund</span>
            </div>
  
            {/* Navigation Buttons */}
            <div>
              <button className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
              onClick={()=>navigate("/login")}>
                Login
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
              onClick={()=>navigate("/register")}>
                Register
              </button>
            </div>
          </header>
  
          {/* Main Content */}
          <main className="relative flex flex-col items-center justify-center mt-10 text-center min-h-[100px]">
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-800">
              Don't Let Those Receipts Pile Up
            </h2>
            <h1 className="z-40 text-7xl md:text-8xl text-gray-800 
            font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] ">
                Budgeting, <span className='gradient-text text-transparent animate-gradient '>Reimagined</span>
            </h1>

          </main>
  
          {/* Footer Section */}
          <footer className="relative z-10 bg-gray-600 text-white py-4 text-center mt-auto opacity-80">
            <p className="text-sm">© 2024 Holofund. All rights reserved.</p>
          </footer>
        </div>
      </>
    );
}
  
export default function Homepage() {
  return (
    <div>
        <LandingPage/>
    </div>
  )
}
