'use client';

import { useEffect, useState } from 'react';
import DTransactions from '@/components/DTransactions';
import SelectWrapper from '@/components/Wrapper/SelectWrapper'; // Import SelectWrapper

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
      <h2 className="text-xl font-bold mb-4">Select a Debtor</h2>

      {/* Use SelectWrapper for the dropdown */}
      <SelectWrapper
        label="Debtor"
        value={selectedDebtorId || ""}
        onChange={(e) => setSelectedDebtorId(e.target.value)}
        options={debtors.map((debtor) => ({
          value: debtor._id,
          label: debtor.name,
        }))}
      />

      {selectedDebtorId && <DTransactions debtorId={selectedDebtorId} />}
    </div>
  );
}
