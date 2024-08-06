'use client'
import { useAnimations, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';
import spacemanScene from "../assets/3D/spaceman.glb";
import CanvasLoader from "./loader";

const Spaceman = ({ scale, position, rotation, setRotation }) => {
  const spacemanRef = useRef();
  const { scene, animations } = useGLTF(spacemanScene);
  const { actions } = useAnimations(animations, spacemanRef);

  useEffect(() => {
    if (actions && actions["Idle"]) {
      actions["Idle"].play();
    }
  }, [actions]);

  // Handle drag gesture
  const bind = useDrag(({ delta: [dx, dy] }) => {
    setRotation(prev => [
      prev[0] + dy * 0.01,
      prev[1] + dx * 0.01,
      prev[2]
    ]);
  });

  useFrame(() => {
    if (spacemanRef.current) {
      spacemanRef.current.rotation.x = rotation[0];
      spacemanRef.current.rotation.y = rotation[1];
      spacemanRef.current.rotation.z = rotation[2];
    }
  });

  return (
    <group ref={spacemanRef} position={position} scale={scale} {...bind()}>
      <primitive object={scene} />
    </group>
  );
};

const SpacemanCanvas = () => {
  const initialRotation = [0, Math.PI / 2, 0]; // 90 degrees around Y-axis
  const [rotation, setRotation] = useState(initialRotation);
  const [scale, setScale] = useState([2, 2, 2]);
  const [position, setPosition] = useState([0.2, -0.7, 0]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScale([2, 2, 2]);
        setPosition([0.2, -0.1, 0]);
      } else if (window.innerWidth < 1024) {
        setScale([1.8, 1.8, 1.8]);
        setPosition([0.2, -0.3, 0]);
      } else if (window.innerWidth < 1280) {
        setScale([1.4, 1.4, 1.4]);
        setPosition([0.2, -0.4, 0]);
      } else if (window.innerWidth < 1536) {
        setScale([1.66, 1.66, 1.66]);
        setPosition([0.2, -0.5, 0]);
      } else {
        setScale([1.8, 1.8, 1.8]);
        setPosition([0.2, -0.7, 0]);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Canvas className={`w-full h-screen bg-transparent z-10`} camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 1000 }}>
      <Suspense fallback={<CanvasLoader />}>
        <directionalLight position={[1, 1, 1]} intensity={2} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 5, 10]} intensity={2} />
        <spotLight position={[0, 50, 10]} angle={0.15} penumbra={1} intensity={2} />
        <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />
        <Spaceman rotation={rotation} scale={scale} position={position} setRotation={setRotation} />
      </Suspense>
    </Canvas>
  );
};

export default SpacemanCanvas;