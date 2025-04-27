"use client";

import { useEffect, useState } from "react";
import FormWrapper from "./Wrapper/FormWrapper";
import InputWrapper from "./Wrapper/InputWrapper";
import SelectWrapper from "./Wrapper/SelectWrapper";

type Category = {
  _id: string;
  name: string;
};

type Debtor = {
  _id: string;
  name: string;
};

type Account = {
  _id: string;
  name: string;
};

type TransactionEntry = {
  amount: number;
  date: Date;
  _id: string;
};

export default function TransactionForm() {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState<number | "">("");
  const [account, setAccount] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<"pending" | "completed" | "open">("completed");
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [debtorTransaction, setDebtorTransaction] = useState(false);
  const [selectedDebtor, setSelectedDebtor] = useState<string>("");
  const [expectedReturnDate, setExpectedReturnDate] = useState<string>("");
  const [dtransEntries, setDtransEntries] = useState<TransactionEntry[]>([]);
  const [selecteddtransId, setSelecteddtransId] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, accountsRes, debtorsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/accounts"),
          fetch("/api/debtors"),
        ]);

        const categoriesData = await categoriesRes.json();
        const accountsData = await accountsRes.json();
        const debtorsData = await debtorsRes.json();

        if (categoriesData.success) setCategories(categoriesData.data);
        if (accountsData.success) setAccounts(accountsData.data);
        if (debtorsData.success) setDebtors(debtorsData.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedDebtor) return;
    async function loadTransactions() {
      const res = await fetch(`/api/dtrans/filter/${selectedDebtor}`);
      const data = await res.json();
      setDtransEntries(data.transactions || []);
    }
    loadTransactions();
  }, [selectedDebtor]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !category || !account || !date) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/transaction-with-dtrans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount,
          account,
          date,
          to,
          category,
          status,
          debtorTransaction,
          selectedDebtor,
          expectedReturnDate,
          selecteddtransId,
        }),
      });

      if (res.ok) {
        setType("income");
        setAmount("");
        setAccount("");
        setDate("");
        setTo("");
        setCategory("");
        setStatus("completed");
        setSelectedDebtor("");
        setDebtorTransaction(false);
        setExpectedReturnDate("");
        setMessage("Transaction added!");
      } else {
        setMessage("Failed to add transaction.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormWrapper title="Add Transaction" onSubmit={handleSubmit}>
      <SelectWrapper
        label="Transaction Type"
        value={type}
        onChange={(e) => setType(e.target.value as "income" | "expense")}
        options={[
          { value: "income", label: "Income" },
          { value: "expense", label: "Expense" },
        ]}
        required
      />

      <InputWrapper
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Enter amount"
        required
      />

      <SelectWrapper
        label="Account"
        value={account}
        onChange={(e) => setAccount(e.target.value)}
        options={accounts.map((acc) => ({ value: acc._id, label: acc.name }))}
        required
      />

      <InputWrapper
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <InputWrapper
        label="To (Optional)"
        type="text"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="Enter recipient"
      />

      <SelectWrapper
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        options={categories.map((cat) => ({ value: cat._id, label: cat.name }))}
        required
      />

      <SelectWrapper
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value as "pending" | "completed" | "open")}
        options={[
          { value: "completed", label: "Completed" },
          { value: "pending", label: "Pending" },
          { value: "open", label: "Open" },
        ]}
        required
      />

      <div className="flex items-center space-x-2">
        <label htmlFor="debtorTransaction" className="text-sm font-medium">
          Is this a debtor transaction?
        </label>
        <input
          type="checkbox"
          id="debtorTransaction"
          checked={debtorTransaction}
          onChange={(e) => setDebtorTransaction(e.target.checked)}
          className="w-4 h-4"
        />
      </div>

      {debtorTransaction && (
        <>
          <SelectWrapper
            label="Debtor"
            value={selectedDebtor}
            onChange={(e) => setSelectedDebtor(e.target.value)}
            options={debtors.map((debtor) => ({ value: debtor._id, label: debtor.name }))}
            required
          />

          {selectedDebtor && type !== "expense" && (
            <SelectWrapper
              label="Select Existing DTrans Entry"
              value={selecteddtransId}
              onChange={(e) => setSelecteddtransId(e.target.value)}
              options={dtransEntries.map((entry) => ({
                value: entry._id,
                label: `${new Date(entry.date).toDateString()} - ₹${entry.amount}`,
              }))}
            />
          )}

          {type === "expense" && (
            <InputWrapper
              label="Expected Return Date"
              type="date"
              value={expectedReturnDate}
              onChange={(e) => setExpectedReturnDate(e.target.value)}
              required
            />
          )}
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? "Saving..." : "Add Transaction"}
      </button>

      {message && <p className="text-sm text-green-600">{message}</p>}
    </FormWrapper>
  );
}