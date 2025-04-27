"use client";

import { useEffect, useState } from "react";
import SelectWrapper from "./Wrapper/SelectWrapper"; // Import SelectWrapper

type Transaction = {
  _id: string;
  type: "income" | "expense";
  status: "open" | "completed" | "pending";
  amount: number;
  to?: string;
  date: string; // ISO date string
  category: {
    _id: string;
    name: string;
  };
  account: {
    _id: string;
    name: string;
  };
};

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5; // Number of transactions per page

  // Filter states
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();

        // Sort transactions by date (newest first)
        const sortedTransactions = data.data?.sort(
          (a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTransactions(sortedTransactions);
        setFilteredTransactions(sortedTransactions); // Initialize filtered transactions
      } catch (err) {
        console.error("Error fetching transactions", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  // Filter transactions based on selected filters
  useEffect(() => {
    const filtered = transactions?.filter((txn) => {
      return (
        (selectedAccount ? txn.account._id === selectedAccount : true) &&
        (selectedCategory ? txn.category._id === selectedCategory : true) &&
        (selectedType ? txn.type === selectedType : true) &&
        (selectedStatus ? txn.status === selectedStatus : true) &&
        (selectedDate ? new Date(txn.date).toDateString() === new Date(selectedDate).toDateString() : true)
      );
    });

    setFilteredTransactions(filtered);
  }, [selectedAccount, selectedCategory, selectedType, selectedStatus, selectedDate, transactions]);

  // Calculate the transactions to display for the current page
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions?.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredTransactions?.length / transactionsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate unique accounts and categories
  const uniqueAccounts = Array.from(
    new Map(transactions?.map((txn) => [txn.account._id, txn.account])).values()
  );
  const uniqueCategories = Array.from(
    new Map(transactions?.map((txn) => [txn.category._id, txn.category])).values()
  );

  return (
    <div className="mt-0 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Transactions</h3>

      {/* Filters */}
      <div className="space-y-3 mb-4">
        <SelectWrapper
          label="Filter by Account"
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          options={uniqueAccounts.map((account) => ({
            value: account._id,
            label: account.name,
          }))}
        />

        <SelectWrapper
          label="Filter by Category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={uniqueCategories.map((category) => ({
            value: category._id,
            label: category.name,
          }))}
        />

        <SelectWrapper
          label="Filter by Type"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          options={[
            { value: "income", label: "Income" },
            { value: "expense", label: "Expense" },
          ]}
        />

        <SelectWrapper
          label="Filter by Status"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          options={[
            { value: "open", label: "Open" },
            { value: "completed", label: "Completed" },
            { value: "pending", label: "Pending" },
          ]}
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : !Array.isArray(filteredTransactions) || filteredTransactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {currentTransactions.map((txn) => (
              <li
                key={txn._id}
                className=" p-3 rounded dark:bg-gray-700 shadow-sm flex flex-col"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{txn.category.name}</span>
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      txn.type === "income"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {txn.type}
                  </span>
                </div>
                <div className="text-lg font-bold mt-1">₹{txn.amount}</div>
                {txn.to && (
                  <div className="text-sm text-gray-600 mt-1">📝 {txn.to}</div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(txn.date).toDateString()}{" "}
                  <span className={`text-sm px-2 py-1 rounded`}>{txn.status}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className="flex flex-wrap justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 sm:px-3 sm:py-1 border rounded disabled:opacity-50 text-xs sm:text-sm"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-2 py-1 sm:px-3 sm:py-1 border rounded text-xs sm:text-sm ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 sm:px-3 sm:py-1 border rounded disabled:opacity-50 text-xs sm:text-sm"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
