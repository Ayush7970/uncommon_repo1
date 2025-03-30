
import React, { useRef, useState } from 'react';
import { Sphere, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useTransactionStore } from '../../lib/store';

export function TransactionNode({ transaction }) {
  const nodeRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const setSelectedTransaction = useTransactionStore((state) => state.setSelectedTransaction);

  useFrame((state) => {
    if (nodeRef.current && hovered) {
      nodeRef.current.rotation.x += 0.01;
      nodeRef.current.rotation.y += 0.01;
    }
  });

  const getColorByType = (type) => {
    const colors = {
      Income: '#4CAF50',
      Housing: '#F44336',
      Food: '#F44336',
      Bills: '#F44336',
      Savings: '#F44336',
    };
    return colors[type] || '#757575';
  };

  return (
    <group position={transaction.position}>
      <Sphere
        ref={nodeRef}
        args={[transaction.size, 32, 32]}
        onClick={() => setSelectedTransaction(transaction)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={getColorByType(transaction.type)}
          roughness={0.3}
        />
      </Sphere>
      {hovered && (
        <Html distanceFactor={10}>
          <div style={{
            padding: '0.5rem',
            width: '12rem',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            borderRadius: '0.375rem',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
          }}>
            <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>{transaction.name}</p>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{transaction.type}</p>
            <p style={{ fontSize: '0.875rem' }}>${transaction.amount.toLocaleString()}</p>
          </div>
        </Html>
      )}
    </group>
  );
}