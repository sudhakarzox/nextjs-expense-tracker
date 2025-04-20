'use client';

import { useEffect, useState } from 'react';
import DTransactions from '@/components/DTransactions';

type Debtor = {
  _id: string;
  name: string;
};

export default function DebtorSelectPage() {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [selectedDebtorId, setSelectedDebtorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDebtors() {
      const res = await fetch('/api/debtors');
      const data = await res.json();
      setDebtors(data.data || []);
      setLoading(false);
    }
    fetchDebtors();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading debtors...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-0">
      <h2 className="text-2xl font-bold mb-4">Select a Debtor</h2>

      <select
        className="w-full p-2 border rounded mb-6"
        onChange={(e) => setSelectedDebtorId(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>Select debtor...</option>
        {debtors.map((debtor) => (
          <option key={debtor._id} value={debtor._id}>
            {debtor.name}
          </option>
        ))}
      </select>

      {selectedDebtorId && <DTransactions debtorId={selectedDebtorId} />}
    </div>
  );
}
