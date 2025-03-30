// import React from 'react';

// const GraphicView = () => {
//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//             <h1>Graphic View Placeholder</h1>
//         </div>
//     );
// };

// export default GraphicView;


// Path: /Users/anupamsai/Desktop/UncommonAnupam/uncommon_repo1/frontend/src/components/GraphicView.jsx



// import React, { Suspense } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
// import { TransactionNode } from './TransactionNode';
// import { TransactionConnection } from './TransactionConnection';
// import { useTransactionStore } from '../../lib/store'; // Correct relative path from components folder to lib folder

// const GraphicView = () => {
//   const { transactions } = useTransactionStore();

//   return (
//     <div className="w-full h-screen bg-black">
//       <Suspense fallback={<div className="text-white text-center p-4">Loading 3D Visualization...</div>}>
//         <Canvas>
//           <PerspectiveCamera makeDefault position={[0, 0, 10]} />
//           <OrbitControls
//             enablePan={true}
//             enableZoom={true}
//             enableRotate={true}
//             minDistance={5}
//             maxDistance={20}
//           />
//           <ambientLight intensity={0.5} />
//           <pointLight position={[10, 10, 10]} intensity={1} />
//           <Stars radius={100} depth={50} count={5000} factor={4} fade />
          
//           {/* Render connections */}
//           {transactions.map((transaction) =>
//             transaction.connections.map((connectedId) => {
//               const connectedTransaction = transactions.find((t) => t.id === connectedId);
//               if (connectedTransaction) {
//                 return (
//                   <TransactionConnection
//                     key={`${transaction.id}-${connectedId}`}
//                     start={transaction}
//                     end={connectedTransaction}
//                   />
//                 );
//               }
//               return null;
//             })
//           )}

//           {/* Render nodes */}
//           {transactions.map((transaction) => (
//             <TransactionNode key={transaction.id} transaction={transaction} />
//           ))}
//         </Canvas>
//       </Suspense>
//     </div>
//   );
// };

// export default GraphicView;


// Path: /Users/anupamsai/Desktop/UncommonAnupam/uncommon_repo1/frontend/src/components/GraphicView.jsx
// Path: /Users/anupamsai/Desktop/UncommonAnupam/uncommon_repo1/frontend/src/components/GraphicView.jsx
import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Stars, 
  Html 
} from '@react-three/drei';
import { TransactionNode } from './TransactionNode';
import { TransactionConnection } from './TransactionConnection';
import { useTransactionStore } from '../../lib/store';

// Loading indicator component
function Loader() {
  return (
    <Html center>
      <div className="text-white text-xl">Loading...</div>
    </Html>
  );
}

// Main component
const GraphicView = () => {
  const { transactions, selectedTransaction, setSelectedTransaction } = useTransactionStore();
  
  // Set explicit styles to ensure full screen coverage
  useEffect(() => {
    // Apply styles to parent containers to ensure full height
    const applyFullHeightStyles = () => {
      // Get all parent elements up to the body
      let element = document.querySelector('.graphic-view-container');
      if (element) {
        while (element && element !== document.body) {
          element.style.height = '100%';
          element = element.parentElement;
        }
      }
      // Also set html and body to 100% height
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
      document.body.style.margin = '0';
      document.body.style.overflow = 'hidden';
    };
    
    // Apply styles after a short delay to ensure DOM is ready
    setTimeout(applyFullHeightStyles, 100);
  }, []);
  
  return (
    <div className="graphic-view-container" style={{
      width: '100%',
      height: '100vh', // Use viewport height
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#000',
      overflow: 'hidden'
    }}>
      {/* Selected transaction detail panel */}
      {selectedTransaction && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 10,
          width: '16rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{selectedTransaction.name}</h3>
            <button 
              onClick={() => setSelectedTransaction(null)}
              style={{ color: '#6b7280', cursor: 'pointer', background: 'none', border: 'none' }}
            >
              ✕
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p><span style={{ fontWeight: 500 }}>Type:</span> {selectedTransaction.type}</p>
            <p><span style={{ fontWeight: 500 }}>Amount:</span> ${selectedTransaction.amount.toLocaleString()}</p>
            <p><span style={{ fontWeight: 500 }}>ID:</span> {selectedTransaction.id}</p>
            <p><span style={{ fontWeight: 500 }}>Connections:</span> {selectedTransaction.connections.length}</p>
          </div>
        </div>
      )}
      
      {/* 3D Canvas with explicit styles */}
      <Canvas style={{ width: '100%', height: '100%' }}>
        <Suspense fallback={<Loader />}>
          {/* Camera and controls */}
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={20}
          />
          
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          {/* Background */}
          <Stars radius={100} depth={50} count={5000} factor={4} fade />
          
          {/* Render connections between transactions */}
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
          
          {/* Render transaction nodes */}
          {transactions.map((transaction) => (
            <TransactionNode key={transaction.id} transaction={transaction} />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GraphicView;