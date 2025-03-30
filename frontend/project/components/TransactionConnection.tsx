'use client';

import { useRef, useMemo } from 'react';
import { Line, useGLTF } from '@react-three/drei';
import { Vector3, CatmullRomCurve3, BufferGeometry, TubeGeometry, Quaternion, Euler } from 'three';
import { useFrame } from '@react-three/fiber';
import { Transaction } from '@/lib/store';

interface TransactionConnectionProps {
  start: Transaction;
  end: Transaction;
}

export function TransactionConnection({ start, end }: TransactionConnectionProps) {
  const lineRef = useRef<THREE.Mesh>(null);
  const arrowRef = useRef<THREE.Mesh>(null);
  
  // Create a curved path for the arrow
  const curve = useMemo(() => {
    const startVec = new Vector3(...start.position);
    const endVec = new Vector3(...end.position);
    
    // Calculate midpoint with a slight arc
    const midPoint = new Vector3(
      (start.position[0] + end.position[0]) / 2,
      (start.position[1] + end.position[1]) / 2 + 1.5,
      (start.position[2] + end.position[2]) / 2
    );
    
    // Create a curve with 3 points
    return new CatmullRomCurve3([
      startVec,
      midPoint,
      endVec
    ]);
  }, [start.position, end.position]);
  
  // Generate points along the curve for visualization
  const curvePoints = useMemo(() => {
    return curve.getPoints(20);
  }, [curve]);
  
  // Create tube geometry for the curved line
  const tubeGeometry = useMemo(() => {
    return new TubeGeometry(curve, 20, 0.03, 8, false);
  }, [curve]);
  
  // The position where we'll place the arrow (closer to end than before)
  const arrowT = 0.9; // Changed from 0.85 to get closer to end point
  
  // Calculate arrow position and rotation at the end of the curve
  const arrowPosition = useMemo(() => {
    // Get the position near the end of the curve
    const point = curve.getPointAt(arrowT);
    return [point.x, point.y, point.z];
  }, [curve]);
  
  // Calculate proper arrow rotation to align with the curve direction
  const arrowRotation = useMemo(() => {
    // Get the tangent direction at the specified position
    const tangent = curve.getTangentAt(arrowT);
    
    // Create a quaternion that rotates from (0,1,0) to the tangent direction
    // This is the key change - properly orienting the cone to point along the curve
    const quaternion = new Quaternion();
    
    // Default cone in three.js points in the y-direction (0,1,0)
    // We need to rotate it to match the tangent vector
    const upVector = new Vector3(0, 1, 0);
    quaternion.setFromUnitVectors(upVector, tangent.normalize());
    
    // Convert quaternion to Euler angles for React Three Fiber
    const euler = new Euler().setFromQuaternion(quaternion);
    
    return [euler.x, euler.y, euler.z];
  }, [curve]);
  
  // Optional: animate the flow along the arrow
  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.material.dashOffset = state.clock.getElapsedTime() * 0.5;
    }
  });
  
  return (
    <>
      {/* Curved line using TubeGeometry */}
      <mesh ref={lineRef} geometry={tubeGeometry}>
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.8}
          dashSize={0.1}
          gapSize={0.1}
          dashOffset={0}
        />
      </mesh>
      
      {/* Arrow head at the end */}
      <mesh 
        ref={arrowRef}
        position={arrowPosition}
        rotation={arrowRotation}
        scale={[0.2, 0.2, 0.2]}
      >
        {/* Rotated cone to match the tangent direction */}
        <coneGeometry args={[0.5, 1, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
    </>
  );
}