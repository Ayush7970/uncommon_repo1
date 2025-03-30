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

// Using your exact data structure from store.ts
export const useTransactionStore = create((set) => ({
  transactions: [
    {
      id: '1',
      name: 'Salary Deposit',
      amount: 5000,
      type: 'Income',
      position: [2, 1, -3],
      connections: ['2', '3'],
      size: 0.5
    },
    {
      id: '2',
      name: 'Rent Payment',
      amount: 1500,
      type: 'Housing',
      position: [-1, -2, 2],
      connections: ['1', '4'],
      size: 0.5
    },
    {
      id: '3',
      name: 'Grocery Shopping',
      amount: 200,
      type: 'Food',
      position: [3, -1, 1],
      connections: ['1', '5'],
      size: 0.3
    },
    {
      id: '4',
      name: 'Utilities',
      amount: 150,
      type: 'Bills',
      position: [-2, 2, -1],
      connections: ['2', '5'],
      size: 0.2
    },
    {
      id: '5',
      name: 'Investment',
      amount: 1000,
      type: 'Savings',
      position: [1, -3, -2],
      connections: ['3', '4'],
      size: 0.1
    },
  ],
  selectedTransaction: null,
  setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction }),
}));