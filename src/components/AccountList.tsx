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
    <div className="mt-6 p-2">
      <h3 className="text-lg font-semibold mb-2">Accounts</h3>
      {loading ? (
        <p>Loading...</p>
      ) : accounts.length === 0 ? (
        <p>No accounts found.</p>
      ) : (
        <ul className="space-y-2">
          {accounts.map((acc) => (
            <li key={acc._id} className="p-2 rounded bg-gray-700">
              <div className="flex justify-between">
                <span>{acc.name}</span>
                <span>Rs. {acc.balance.toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-between p-2 mt-4 font-semibold">
        <span>Total:</span>
        <span>Rs. {accounts.reduce((total, acc) => total + acc.balance, 0).toFixed(2)}</span>
      </div>
    </div>
  );
}