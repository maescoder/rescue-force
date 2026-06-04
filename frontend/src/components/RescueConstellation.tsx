"use client";
import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, Icosahedron, MeshWobbleMaterial, Html, Float, Line } from "@react-three/drei";
import * as THREE from "three";

// Biome Definitions
const biomes = [
  { id: "forest", position: [-3, 1, -2], color: "#10b981", name: "Forest Canopy" },
  { id: "ocean", position: [3, -1, 1], color: "#0ea5e9", name: "Micro Ocean" },
  { id: "savannah", position: [0, 2.5, 2], color: "#f59e0b", name: "Arid Savannah" },
];

// Animal Nodes (Live Rescue Cases)
const animalNodes = [
  { id: 1, biome: "forest", orbitRadius: 1.5, speed: 0.5, name: "Siberian Wolf - Case #402", color: "#10b981", status: "Tracking" },
  { id: 2, biome: "ocean", orbitRadius: 1.2, speed: 0.8, name: "Sea Turtle - Case #118", color: "#0ea5e9", status: "Critical" },
  { id: 3, biome: "savannah", orbitRadius: 1.8, speed: 0.3, name: "Eagle - Case #79", color: "#f59e0b", status: "Stable" },
];

function AnimalNode({ data, center }: { data: any, center: number[] }) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);
  const offsetAngle = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * data.speed + offsetAngle;
      ref.current.position.x = center[0] + Math.cos(t) * data.orbitRadius;
      ref.current.position.z = center[2] + Math.sin(t) * data.orbitRadius;
      // Slight vertical bobbing
      ref.current.position.y = center[1] + Math.sin(t * 2) * 0.2;
      
      ref.current.rotation.y += 0.02;
    }
  });

  return (
    <group ref={ref}>
      <mesh
        onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
        onPointerOut={(e) => setHover(false)}
        onClick={() => console.log("Trigger GSAP Zoom for", data.name)}
      >
        <icosahedronGeometry args={[0.15, 1]} />
        <meshBasicMaterial color={data.color} wireframe />
      </mesh>

      {/* Holographic UI Label on Hover */}
      <Html distanceFactor={10} zIndexRange={[100, 0]} className="pointer-events-none">
        <div className={`transition-all duration-300 ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-90"} bg-[#0B0F12]/80 backdrop-blur-md border border-[${data.color}]/50 p-3 rounded-lg flex flex-col gap-1 w-48 -translate-x-1/2 -translate-y-[120%]`}>
          <div className="text-[10px] uppercase tracking-widest" style={{ color: data.color }}>{data.status}</div>
          <div className="text-white text-xs font-mono">{data.name}</div>
        </div>
      </Html>
    </group>
  );
}

export function ConstellationNetwork({ adoptions = [] }: { adoptions?: any[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  // Map real database adoptions to 3D nodes. If empty, fallback to the placeholder nodes.
  const liveNodes = adoptions.length > 0 
    ? adoptions.map((a, i) => ({
        id: a.id,
        biome: biomes[i % biomes.length].id, // Assign to random biome
        orbitRadius: 1.2 + (Math.random() * 0.8),
        speed: 0.3 + (Math.random() * 0.5),
        name: a.pet_type ? a.pet_type.toUpperCase() : "UNKNOWN",
        color: biomes[i % biomes.length].color,
        status: a.status.toUpperCase()
      }))
    : animalNodes;

  useFrame(() => {
    if (groupRef.current) {
      // Continuous slow rotation
      groupRef.current.rotation.y += 0.002;
      
      // Mouse tilt mechanics
      const targetRotationX = (mouse.y * Math.PI) / 10;
      const targetRotationY = (mouse.x * Math.PI) / 10;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotationY * -1, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Draw lines connecting biomes */}
      <Line
        points={[biomes[0].position as any, biomes[1].position as any, biomes[2].position as any, biomes[0].position as any]}
        color="rgba(255,255,255,0.1)"
        lineWidth={1}
      />

      {biomes.map((biome) => (
        <Float key={biome.id} speed={2} rotationIntensity={0.5} floatIntensity={0.5} position={biome.position as any}>
          {/* Biome Core */}
          <Sphere args={[0.6, 16, 16]}>
            <MeshWobbleMaterial 
              color={biome.color} 
              emissive={biome.color} 
              emissiveIntensity={0.5} 
              wireframe={biome.id !== "ocean"} 
              transparent 
              opacity={0.8}
              factor={0.4} 
              speed={2} 
            />
          </Sphere>
          
          <Html distanceFactor={15}>
            <div className="text-white/40 text-[10px] tracking-widest uppercase font-mono mt-8 -translate-x-1/2">
              {biome.name}
            </div>
          </Html>
        </Float>
      ))}

      {liveNodes.map((animal) => {
        const center = biomes.find(b => b.id === animal.biome)!.position;
        return <AnimalNode key={animal.id} data={animal} center={center} />;
      })}
    </group>
  );
}

export default function RescueConstellation() {
  return (
    <div className="w-full h-full cursor-crosshair">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <ConstellationNetwork />
      </Canvas>
    </div>
  );
}
