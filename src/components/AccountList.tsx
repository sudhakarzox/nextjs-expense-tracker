"use client";

import { useEffect, useState } from "react";

type Account = {
  _id: string;
  name: string;
  balance: number;
};

export default function AccountList() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await fetch("/api/accounts");
        const data = await res.json();

        if (data.success) {
          setAccounts(data.data); // Use the `data` field from the API response
        } else {
          console.error("Failed to load accounts:", data.error);
        }
      } catch (err) {
        console.error("Failed to load accounts", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, []);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Accounts</h3>
      {loading ? (
        <p>Loading...</p>
      ) : accounts.length === 0 ? (
        <p>No accounts found.</p>
      ) : (
        <ul className="space-y-2">
          {accounts.map((acc) => (
            <li key={acc._id} className="border p-2 rounded bg-gray-50">
              <div className="flex justify-between">
                <span>{acc.name}</span>
                <span>Rs. {acc.balance.toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}