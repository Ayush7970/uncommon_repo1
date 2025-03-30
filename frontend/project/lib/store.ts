import { create } from 'zustand';

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: string;
  position: [number, number, number];
  connections: string[];
  size: number;
}

interface TransactionStore {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (transaction: Transaction | null) => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
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