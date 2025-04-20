"use client";

import { useEffect, useState } from "react";

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
  const [categories, setcategories] = useState<Category[]>([]);
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
          fetch("/api/accounts"), // Assuming there's an endpoint for accounts
          fetch("/api/debtors"),
        ]);

        const categoriesData = await categoriesRes.json();
        const accountsData = await accountsRes.json();
        const debtorsData = await debtorsRes.json();
        
        if (categoriesData.success) setcategories(categoriesData.data);
        if (debtorsData.success) setDebtors(debtorsData.data);
        if (accountsData.success) setAccounts(accountsData.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    }

    fetchData();
  }, []);

  // Fetch filtered DTrans transactions when debtor is selected
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
      // const res = await fetch("/api/transactions", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     type,
      //     amount,
      //     account,
      //     date,
      //     to,
      //     category,
      //     status,
      //   }),
      // });
      
      // const transactionData = await res.json();

      // if (res.ok) {
      //   if (debtorTransaction && selectedDebtor) {
      //     // Add transaction ID to the debtor's DTrans
          
      //     await fetch(`/api/dtrans`, {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({
      //         debtor: selectedDebtor, //id of the debtor
      //         transaction: transactionData.data._id,
      //         expectedReturnDate: expectedReturnDate || null,
      //         status: status,
      //         transType: type,
      //         selecteddtransId: selecteddtransId ,
      //         amount: amount,
      //       }),
      //     });
      //   }

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
      //const transactionData = await res.json();

      if(res.ok) {
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
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto bg-white shadow-md rounded space-y-4 mt-0">
      <h2 className="text-xl font-bold">Add Transaction</h2>

      <select
        value={type}
        onChange={(e) => setType(e.target.value as "income" | "expense")}
        className="w-full border p-2 rounded"
        required
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full border p-2 rounded"
        required
      />

      <select
        value={account}
        onChange={(e) => setAccount(e.target.value)}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Select account</option>
        {accounts.map((acc) => (
          <option key={acc._id} value={acc._id}>
            {acc.name}
          </option>
        ))}
      </select>
      
      <div className="flex flex-col items-start">
          <span className="text-sm mb-1">From Date</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <input
        type="text"
        placeholder="To (optional)"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Select category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as "pending" | "completed" | "open")}
        className="w-full border p-2 rounded"
        required
      >
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
        <option value="open">Open</option>
      </select>

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
        <select
          value={selectedDebtor}
          onChange={(e) => setSelectedDebtor(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select debtor</option>
          {debtors.map((debtor) => (
            <option key={debtor._id} value={debtor._id}>
              {debtor.name}
            </option>
          ))}
        </select>

        {selectedDebtor && type!=='expense' && (
        <>
          <label className="block mb-2 text-sm font-medium">Select Existing DTrans Entry</label>
          <select className="w-full p-2 mb-4 border rounded"
            value={selecteddtransId}
            onChange={(e) => {
              //console.log("Selected DTrans ID:", e.target.value); // Debug log
              setSelecteddtransId(e.target.value);
            }}
          >
            <option value="">Select transaction...</option>
            {dtransEntries.map((entry) => (
              <option key={entry._id} value={entry._id}>
                {new Date(entry.date).toDateString().toLocaleString()} - ₹{entry.amount}
              </option>
            ))}
          </select>
        </>
      )}

        {type==='expense' && (<>
          <label htmlFor="debtorTransactiondate" className="text-sm font-medium">
            Expected date of return?
          </label>
          <input
          type="date"
          id="debtorTransactiondate"
          value={expectedReturnDate}
          onChange={(e) => setExpectedReturnDate(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Expected Return Date"
          required
          />
        </>)}
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
    </form>
  );
}