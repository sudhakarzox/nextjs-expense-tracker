'use client';

import { useEffect, useState } from 'react';

type TransactionItem = {
  _id: string;
  transaction: {
    _id: string;
    amount: number;
    type: 'income' | 'expense';
    //refere to category model
    // category: mongoose.Schema.Types.ObjectId;
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

  if (loading) return <p>Loading transactions...</p>;

  if (!transactions.length) return <p>No transactions found for this debtor.</p>;

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Debtor Transactions</h2>
      <div className="space-y-4">
        {transactions.map((item) => (
          <div key={item._id} className="p-4 border bg-white rounded shadow-sm">
            <div className="flex justify-between">
              <span className="font-medium">Type:</span>
              <span className={item.transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                {item.transaction.type.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount:</span>
              <span>₹{item.transaction.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span>{item.transaction.status}</span>
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
          </div>
        ))}
      </div>
    </div>
  );
}
