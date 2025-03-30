'use client';

import { useRef, useState } from 'react';
import { Sphere, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Transaction, useTransactionStore } from "../lib/store";
import { Card } from '../components/ui/card';

interface TransactionNodeProps {
  transaction: Transaction;
}

export function TransactionNode({ transaction }: TransactionNodeProps) {
  const nodeRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const setSelectedTransaction = useTransactionStore((state) => state.setSelectedTransaction);

  useFrame((state) => {
    if (nodeRef.current && hovered) {
      nodeRef.current.rotation.x += 0.01;
      nodeRef.current.rotation.y += 0.01;
    }
  });

  const getColorByType = (type: string) => {
    const colors = {
      Income: '#4CAF50',
      Housing: '#F44336',
      Food: '#F44336',
      Bills: '#F44336',
      Savings: '#F44336',
    };
    return colors[type as keyof typeof colors] || '#757575';
  };

  return (
    <group position={transaction.position as [number, number, number]}>
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
          <Card className="p-2 w-48 bg-opacity-90 backdrop-blur-sm">
            <p className="font-semibold text-sm">{transaction.name}</p>
            <p className="text-xs text-muted-foreground">{transaction.type}</p>
            <p className="text-sm">${transaction.amount.toLocaleString()}</p>
          </Card>
        </Html>
      )}
    </group>
  );
}