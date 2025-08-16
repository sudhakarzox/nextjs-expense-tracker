"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormWrapper from "./Wrapper/FormWrapper";
import InputWrapper from "./Wrapper/InputWrapper";
import SelectWrapper from "./Wrapper/SelectWrapper";
import Button from "./Wrapper/Button";

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

type TransactionFormProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transaction?: any; // Pass transaction for edit, undefined for create
};

export default function TransactionForm({ transaction }: TransactionFormProps) {
  const isEdit = !!transaction?._id;
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
  const router = useRouter();

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

  // Set initial values for edit mode
  useEffect(() => {
    if (isEdit && transaction) {
      setLoading(true);
      setType(transaction.type?? "expense");
      setAmount(transaction.amount);
      setAccount(transaction.account?._id || "");
      setDate(new Date(transaction.date).toISOString().split("T")[0]);
      setTo(transaction.to || "");
      setCategory(transaction.category?._id || "");
      setStatus(transaction.status);
      setLoading(false);
    }
  }, [
    isEdit,transaction]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !category || !account || !date) return;

    setLoading(true);
    setMessage("");

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `/api/transactions/${transaction._id}` : "/api/transaction-with-dtrans";

    try {
      const res = await fetch(url, {
        method,
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
        setMessage(isEdit ? "Transaction updated!" : "Transaction added!");
        if (isEdit) {
          setTimeout(() => {
            router.back();
          }, 500); // Wait 1s to show message before going back
        }
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
    <FormWrapper
      title={isEdit ? "Edit Transaction" : "Add Transaction"}
      onSubmit={handleSubmit}
    >
      <SelectWrapper
        label="Transaction Type"
        value={type}
        onChange={(e) => setType(e.target.value as "income" | "expense")}
        options={[
          { value: "income", label: "Income" },
          { value: "expense", label: "Expense" },
        ]}
        disabled={loading}
        required
      />

      <InputWrapper
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Enter amount"
        disabled={loading}
        required
      />

      <SelectWrapper
        label="Account"
        value={account}
        onChange={(e) => setAccount(e.target.value)}
        options={accounts.map((acc) => ({ value: acc._id, label: acc.name }))}
        disabled={loading}
        required
      />

      <InputWrapper
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        disabled={loading}
        required
      />

      <InputWrapper
        label="To (Optional)"
        type="text"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        disabled={loading}
        placeholder="Enter recipient"
      />

      <SelectWrapper
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        options={categories.map((cat) => ({ value: cat._id, label: cat.name }))}
        disabled={loading}
        required
      />

      <SelectWrapper
        label="Status"
        value={status}
        onChange={(e) =>
          setStatus(e.target.value as "pending" | "completed" | "open")
        }
        options={[
          { value: "completed", label: "Completed" },
          { value: "pending", label: "Pending" },
          { value: "open", label: "Open" },
        ]}
        disabled={loading}
        required
      />

      {!isEdit && (
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
      )}

      {debtorTransaction && (
        <>
          <SelectWrapper
            label="Debtor"
            value={selectedDebtor}
            onChange={(e) => setSelectedDebtor(e.target.value)}
            options={debtors.map((debtor) => ({
              value: debtor._id,
              label: debtor.name,
            }))}
            disabled={loading}
            required
          />

          {selectedDebtor && type !== "expense" && (
            <SelectWrapper
              label="Select Existing DTrans Entry"
              value={selecteddtransId}
              onChange={(e) => setSelecteddtransId(e.target.value)}
              options={dtransEntries.map((entry) => ({
                value: entry._id,
                label: `${new Date(entry.date).toDateString()} - ₹${
                  entry.amount
                }`,
              }))}
              disabled={loading}
            />
          )}

          {type === "expense" && (
            <InputWrapper
              label="Expected Return Date"
              type="date"
              value={expectedReturnDate}
              onChange={(e) => setExpectedReturnDate(e.target.value)}
              disabled={loading}
              required
            />
          )}
        </>
      )}

      <Button type="submit" loading={loading}>
        {loading
          ? "Saving..."
          : isEdit
          ? "Update Transaction"
          : "Add Transaction"}
      </Button>

      {message && <p className="text-sm text-green-600">{message}</p>}
    </FormWrapper>
  );
}