'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { TransactionNode } from './TransactionNode';
import { TransactionConnection } from './TransactionConnection';
import { useTransactionStore } from "../lib/store";

export function TransactionVisualization() {
  const { transactions } = useTransactionStore();

  return (
    <div className="w-full h-screen bg-black">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade />
        
        {/* Render connections */}
        {transactions.map((transaction) =>
          transaction.connections.map((connectedId) => {
            const connectedTransaction = transactions.find((t) => t.id === connectedId);
            if (connectedTransaction) {
              return (
                <TransactionConnection
                  key={`${transaction.id}-${connectedId}`}
                  start={transaction}
                  end={connectedTransaction}
                />
              );
            }
            return null;
          })
        )}

        {/* Render nodes */}
        {transactions.map((transaction) => (
          <TransactionNode key={transaction.id} transaction={transaction} />
        ))}
      </Canvas>
    </div>
  );
}