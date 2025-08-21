"use client";

import { useEffect, useState } from "react";
import SelectWrapper from "./Wrapper/SelectWrapper"; // Import SelectWrapper
import { useRouter } from "next/navigation";
import LoadingAnime from "./LoadingAnim";

type Transaction = {
  _id: string;
  type: "income" | "expense";
  status: "open" | "completed";
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
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Add rows per page state
  const [transactionsPerPage, setTransactionsPerPage] = useState(10);

  // Filter states
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Add this helper for month options
  const monthOptions = [
    { value: "", label: "All Months" },
    ...Array.from({ length: 12 }, (_, i) => ({
      value: String(i + 1).padStart(2, "0"),
      label: new Date(0, i).toLocaleString("default", { month: "long" }),
    })),
  ];

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
      const txnDate = new Date(txn.date);
      return (
        (selectedAccount ? txn.account._id === selectedAccount : true) &&
        (selectedCategory ? txn.category._id === selectedCategory : true) &&
        (selectedType ? txn.type === selectedType : true) &&
        (selectedStatus ? txn.status === selectedStatus : true) &&
        (selectedDate ? txnDate.toDateString() === new Date(selectedDate).toDateString() : true) &&
        (selectedMonth ? String(txnDate.getMonth() + 1).padStart(2, "0") === selectedMonth : true)
      );
    });

    setFilteredTransactions(filtered);
  }, [selectedAccount, selectedCategory, selectedType, selectedStatus, selectedDate, selectedMonth, transactions]);

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

  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="mt-0 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Transactions</h3>

      {/* Collapsible Filters */}
      <div className="mb-2">
        <button
          className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded text-left font-medium flex items-center justify-between"
          onClick={() => setFiltersOpen((prev) => !prev)}
        >
          <span>Filters</span>
          <span>{filtersOpen ? "▲" : "▼"}</span>
        </button>
        {filtersOpen && (
          <div className="space-y-3 mt-3 mb-4">
            <SelectWrapper
              label="Filter by Month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              options={monthOptions}
            />

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
              ]}
            />

            <input
              type="date"
              placeholder="Filter by Date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        )}
      </div>

      {/* Rows per page dropdown */}
      <div className="mb-4 flex items-center gap-2">
        <SelectWrapper
         label="Rows per page"
          value={transactionsPerPage}
          onChange={(e) => {
            setTransactionsPerPage(Number(e.target.value));
            setCurrentPage(1); // Reset to first page when changing rows
          }}
          options={[
            { value: 10, label: "10" },
            { value: 20, label: "20" },
            { value: 30, label: "30" },
          ]}
          // className="border rounded px-2 py-1"
        />
        
      </div>

      {loading ? (
        <LoadingAnime />
      ) : !Array.isArray(filteredTransactions) || filteredTransactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded shadow">
            <table className="min-w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 text-base sm:text-sm">
              <thead>
                <tr>
                  <th className="px-1 py-1 border-b w-6 text-center">⇅</th>
                  <th className="px-1 py-1 border-b text-center">Date</th>
                  <th className="px-2 py-1 border-b text-center">Acc</th>
                  <th className="px-2 py-1 border-b text-center">Cat</th>
                  <th className="px-2 py-1 border-b text-center">Amt</th>
                  <th className="px-2 py-1 border-b text-center">To</th>
                  <th className="px-2 py-1 border-b text-center">Sts</th>
                  <th className="px-2 py-1 border-b text-center">Edit</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((txn) => (
                  <tr key={txn._id} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                    <td className="px-1 py-1 border-b text-center">
                      {txn.type === "income" ? (
                        <span title="Income" className="text-green-600 font-bold text-xl">&#8593;</span>
                      ) : (
                        <span title="Expense" className="text-red-600 font-bold text-xl">&#8595;</span>
                      )}
                    </td>
                    <td className="px-0.5 py-1 border-b text-center">{new Date(txn.date).toLocaleDateString()}</td>
                    <td className="px-2 py-1 border-b text-center">{txn.account.name}</td>
                    <td className="px-2 py-1 border-b text-center">{txn.category.name}</td>
                    <td className="px-2 py-1 border-b font-bold text-center">₹{txn.amount}</td>
                    <td className="px-2 py-1 border-b text-center">{txn.to || "-"}</td>
                    <td className="px-2 py-1 border-b text-center">
                      <span className="px-1 py-0.5 rounded text-[10px] bg-gray-300 dark:bg-gray-600">
                        {txn.status[0].toUpperCase()}
                      </span>
                    </td>
                    <td className="px-2 py-1 border-b text-center">
                      <button
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => router.push(`/transactions-list/${txn._id}/edit`)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-wrap justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-yellow-500 disabled:opacity-50"
              aria-label="Previous page"
            >
              &laquo;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page =>
                totalPages <= 7 ||
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
              )
              .map((page, idx, arr) => {
                // Add ellipsis if needed
                if (
                  idx > 0 &&
                  page !== arr[idx - 1] + 1
                ) {
                  return (
                    <span key={`ellipsis-${page}`} className="px-2 text-gray-400">
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded border ${
                      currentPage === page
                        ? "bg-blue-600 text-white font-bold"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-yellow-500"
                    }`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                );
              })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-yellow-500 disabled:opacity-50"
              aria-label="Next page"
            >
              &raquo;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
