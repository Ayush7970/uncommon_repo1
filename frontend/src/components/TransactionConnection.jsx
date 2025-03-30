// // Path: /Users/anupamsai/Desktop/UncommonAnupam/uncommon_repo1/frontend/src/components/TransactionConnection.jsx
// import React, { useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

// export function TransactionConnection({ start, end }) {
//   const ref = useRef();
  
//   // Create points for the line
//   const points = useMemo(() => {
//     const startPoint = new THREE.Vector3(...start.position);
//     const endPoint = new THREE.Vector3(...end.position);
    
//     // Create a slight curve
//     const midPoint = new THREE.Vector3().addVectors(startPoint, endPoint).divideScalar(2);
//     midPoint.y += 0.5; // Add some height to the midpoint for a curve effect
    
//     // Create a curve with these points
//     const curve = new THREE.QuadraticBezierCurve3(startPoint, midPoint, endPoint);
    
//     // Sample points along the curve
//     return curve.getPoints(20);
//   }, [start.position, end.position]);
  
//   // Create the geometry
//   const lineGeometry = useMemo(() => {
//     return new THREE.BufferGeometry().setFromPoints(points);
//   }, [points]);
  
//   // Animation
//   useFrame(({ clock }) => {
//     if (ref.current) {
//       ref.current.material.dashOffset = -clock.getElapsedTime() * 0.5;
//     }
//   });
  
//   return (
//     <line ref={ref} geometry={lineGeometry}>
//       <lineDashedMaterial
//         color="#ffffff"
//         linewidth={1}
//         scale={1}
//         dashSize={0.2}
//         gapSize={0.1}
//       />
//     </line>
//   );
// }



// Path: /Users/anupamsai/Desktop/UncommonAnupam/uncommon_repo1/frontend/src/components/TransactionConnection.jsx
// Path: /Users/anupamsai/Desktop/UncommonAnupam/uncommon_repo1/frontend/src/components/TransactionConnection.jsx
// Path: /Users/anupamsai/Desktop/UncommonAnupam/uncommon_repo1/frontend/src/components/TransactionConnection.jsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function TransactionConnection({ start, end }) {
  const lineRef = useRef(null);
  const arrowRef = useRef(null);
  
  // Create a curved path for the arrow
  const curve = useMemo(() => {
    const startVec = new THREE.Vector3(...start.position);
    const endVec = new THREE.Vector3(...end.position);
    
    // Calculate midpoint with a slight arc
    const midPoint = new THREE.Vector3(
      (start.position[0] + end.position[0]) / 2,
      (start.position[1] + end.position[1]) / 2 + 1.5,
      (start.position[2] + end.position[2]) / 2
    );
    
    // Create a curve with 3 points
    return new THREE.CatmullRomCurve3([
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
    return new THREE.TubeGeometry(curve, 20, 0.03, 8, false);
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
    const quaternion = new THREE.Quaternion();
    
    // Default cone in three.js points in the y-direction (0,1,0)
    // We need to rotate it to match the tangent vector
    const upVector = new THREE.Vector3(0, 1, 0);
    quaternion.setFromUnitVectors(upVector, tangent.normalize());
    
    // Convert quaternion to Euler angles for React Three Fiber
    const euler = new THREE.Euler().setFromQuaternion(quaternion);
    
    return [euler.x, euler.y, euler.z];
  }, [curve]);
  
  // Animate the flow along the arrow
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