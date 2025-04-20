"use client";

import { useEffect, useState } from "react";

type Debtor = {
  _id: string;
  name: string;
};

export default function DebtorList() {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/debtors");
        const data = await res.json();

        if (data.success) {
          setDebtors(data.data); // Use the `data` field from the API response
        } else {
          console.error("Failed to load debtors:", data.error);
        }
      } catch (err) {
        console.error("Failed to load debtors", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Debtor</h3>
      {loading ? (
        <p>Loading...</p>
      ) : debtors.length === 0 ? (
        <p>No debtors found.</p>
      ) : (
        <ul className="space-y-2">
          {debtors.map((cat) => (
            <li key={cat._id} className="border p-2 rounded bg-gray-50">
              <span>{cat.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}