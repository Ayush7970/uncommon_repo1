// // Path: /Users/anupamsai/Desktop/UncommonAnupam/uncommon_repo1/frontend/lib/store.js
// import { create } from 'zustand';

// // Sample transaction data
// const sampleTransactions = [
//   { 
//     id: '1', 
//     amount: 1500, 
//     type: 'deposit', 
//     date: new Date().toISOString(),
//     connections: ['2', '3'],
//     position: [0, 0, 0] 
//   },
//   { 
//     id: '2', 
//     amount: 500, 
//     type: 'withdrawal', 
//     date: new Date().toISOString(),
//     connections: ['1'],
//     position: [-2, 1, 0] 
//   },
//   { 
//     id: '3', 
//     amount: 1000, 
//     type: 'transfer', 
//     date: new Date().toISOString(),
//     connections: ['1'],
//     position: [2, -1, 0] 
//   }
// ];

// // Create the store with sample data
// export const useTransactionStore = create((set) => ({
//   transactions: sampleTransactions,
//   addTransaction: (transaction) => 
//     set((state) => ({ 
//       transactions: [...state.transactions, transaction] 
//     })),
//   updateTransaction: (id, updates) => 
//     set((state) => ({
//       transactions: state.transactions.map(t => 
//         t.id === id ? { ...t, ...updates } : t
//       )
//     })),
//   // Add other methods as needed
// }));



// Path: /Users/anupamsai/Desktop/UncommonAnupam/uncommon_repo1/frontend/lib/store.js
import { create } from 'zustand';


const generateRandomPosition = () => {
  // Create a range of -10 to 10 for better scattering
  // Avoid values too close to zero to prevent clustering in the middle
  const generateCoordinate = () => {
    const min = -10;
    const max = 10;
    const value = Math.random() * (max - min) + min;
    
    // Avoid the middle region (-3 to 3) to ensure scattering
    if (value > -3 && value < 3) {
      // Push values outside the middle
      return value > 0 ? value + 3 : value - 3;
    }
    return value;
  };
  
  return [
    generateCoordinate(),
    generateCoordinate(),
    generateCoordinate()
  ];
};


// Using your exact data structure from store.ts
export const useTransactionStore = create((set) => ({
  transactions: [
    {
      id: '1',
      name: 'Salary Deposit',
      amount: 5000,
      type: 'Income',
      position: generateRandomPosition(),
      connections: ['2'],  // Each node connects to only one other node
      size: 0.5
    },
    {
      id: '2',
      name: 'Rent Payment',
      amount: 1500,
      type: 'Housing',
      position: generateRandomPosition(),
      connections: ['3'],
      size: 0.5
    },
    {
      id: '3',
      name: 'Grocery Shopping',
      amount: 200,
      type: 'Food',
      position: generateRandomPosition(),
      connections: ['4'],
      size: 0.3
    },
    {
      id: '4',
      name: 'Utilities',
      amount: 150,
      type: 'Bills',
      position: generateRandomPosition(),
      connections: ['5'],
      size: 0.2
    },
    {
      id: '5',
      name: 'Investment',
      amount: 1000,
      type: 'Savings',
      position: generateRandomPosition(),
      connections: ['6'],
      size: 0.4
    },
    {
      id: '6',
      name: 'Health Insurance',
      amount: 350,
      type: 'Healthcare',
      position: generateRandomPosition(),
      connections: ['7'],
      size: 0.3
    },
    {
      id: '7',
      name: 'Car Payment',
      amount: 450,
      type: 'Transportation',
      position: generateRandomPosition(),
      connections: ['8'],
      size: 0.35
    },
    {
      id: '8',
      name: 'Internet Bill',
      amount: 80,
      type: 'Utilities',
      position: generateRandomPosition(),
      connections: ['9'],
      size: 0.2
    },
    {
      id: '9',
      name: 'Restaurant Dining',
      amount: 120,
      type: 'Food',
      position: generateRandomPosition(),
      connections: ['10'],
      size: 0.25
    },
    {
      id: '10',
      name: 'Streaming Services',
      amount: 30,
      type: 'Entertainment',
      position: generateRandomPosition(),
      connections: ['11'],
      size: 0.15
    },
    {
      id: '11',
      name: 'Gym Membership',
      amount: 50,
      type: 'Health',
      position: generateRandomPosition(),
      connections: ['12'],
      size: 0.2
    },
    {
      id: '12',
      name: 'Cell Phone',
      amount: 70,
      type: 'Communication',
      position: generateRandomPosition(),
      connections: ['13'],
      size: 0.2
    },
    {
      id: '13',
      name: 'Shopping',
      amount: 200,
      type: 'Personal',
      position: generateRandomPosition(),
      connections: ['14'],
      size: 0.3
    },
    {
      id: '14',
      name: 'Home Maintenance',
      amount: 100,
      type: 'Housing',
      position: generateRandomPosition(),
      connections: ['15'],
      size: 0.25
    },
    {
      id: '15',
      name: 'Education Loan',
      amount: 300,
      type: 'Education',
      position: generateRandomPosition(),
      connections: ['1'],  // Last node connects back to first, forming a cycle
      size: 0.3
    },
  ],
  selectedTransaction: null,
  setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction }),
}));