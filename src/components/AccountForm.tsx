"use client";

import { useState } from "react";

export default function AccountForm() {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, balance }), // Send name and balance fields
      });

      if (res.ok) {
        setMessage("Account added successfully!");
        setName("");
        setBalance("");
      } else {
        const errorData = await res.json();
        setMessage(errorData.error || "Failed to add account");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">Add Account</h2>

      <input
        type="text"
        placeholder="Account name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="number"
        placeholder="Initial balance"
        value={balance}
        onChange={(e) => setBalance(Number(e.target.value))}
        className="w-full border p-2 rounded"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Saving..." : "Add Account"}
      </button>

      {message && <p className="text-sm text-green-600">{message}</p>}
    </form>
  );
}