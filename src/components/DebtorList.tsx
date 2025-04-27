"use client";

import { useEffect, useState } from "react";
import ListWrapper from "./Wrapper/ListWrapper";

type Debtor = {
  _id: string;
  name: string;
};

export default function DebtorList() {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDebtors() {
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

    fetchDebtors();
  }, []);

  return (
    <ListWrapper
      title="Debtor"
      items={debtors}
      loading={loading}
      emptyMessage="No debtors found."
      renderItem={(debtor) => (
        <li key={debtor._id} className="p-2 rounded bg-gray-700">
          <span>{debtor.name}</span>
        </li>
      )}
    />
  );
}