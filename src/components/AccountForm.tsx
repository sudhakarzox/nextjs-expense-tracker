"use client";

import { useState } from "react";
import FormWrapper from "./Wrapper/FormWrapper";
import InputWrapper from "./Wrapper/InputWrapper";
import Button from "./Wrapper/Button";

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
    <FormWrapper title="Add Account" onSubmit={handleSubmit}>
      <InputWrapper
        label="Account Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter account name"
        required
      />

      <InputWrapper
        label="Initial Balance"
        type="number"
        value={balance}
        onChange={(e) => setBalance(Number(e.target.value))}
        placeholder="Enter initial balance"
        required
      />

      <Button
        type="submit"
        loading={loading}
      >
        {loading ? "Saving..." : "Add Account"}
      </Button>

      {message && <p className="text-sm text-green-600">{message}</p>}
    </FormWrapper>
  );
}