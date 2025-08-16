'use client';

import { useEffect, useState } from 'react';
import SelectWrapper from './Wrapper/SelectWrapper';
import LoadingAnime from './LoadingAnim';

type TransactionItem = {
  _id: string;
  transaction: {
    _id: string;
    to: string;
    amount: number;
    type: 'income' | 'expense';
    category: {
      name: string;
      _id: string;
    };
    status: 'pending' | 'completed' | 'open';
  };
  expectedReturnDate?: string;
  actualReturnDate?: string;
  creditedTillDate?: number;
};

export default function DTransactions({ debtorId }: { debtorId: string }) {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('open');

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'open', label: 'Open' },
  ];

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch(`/api/dtrans/${debtorId}`);
        const data = await res.json();
        setTransactions(data.transactions || []);
      } catch (err) {
        console.error('Failed to load transactions:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [debtorId]);

  const filteredTransactions = statusFilter
    ? transactions.filter((item) => item.transaction.status === statusFilter)
    : transactions;

  if (loading) return <LoadingAnime title='Loading transactions...'/>;

  if (!filteredTransactions.length) return <p>No transactions found for this debtor.</p>;

  return (
    <div className="w-full max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Debtor Transactions</h2>
      <SelectWrapper
        label="Status"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        options={statusOptions}
        className="mb-4"
      />
      <div className="space-y-4">
        {filteredTransactions.map((item) => (
          <div key={item._id} className="p-4 border bg-white dark:bg-gray-700 rounded shadow-sm">
            <div className="flex justify-between">
              <span className="font-medium">Type:</span>
              <span>
                {item.transaction.type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount:</span>
              <span>₹{item.transaction.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className={item.transaction.status === 'completed' ? 'text-green-600' : 'text-red-600'}>
                {item.transaction.status.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Category:</span>
              <span>{item.transaction.category?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Expected Return:</span>
              <span>{item.expectedReturnDate ? new Date(item.expectedReturnDate).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Actual Return:</span>
              <span>{item.actualReturnDate ? new Date(item.actualReturnDate).toLocaleDateString() : 'Pending'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Credited Till Date:</span>
              <span>₹{item.creditedTillDate ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Reason: </span>
              <span>{item.transaction.to}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
