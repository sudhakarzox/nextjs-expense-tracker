'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import SelectWrapper from './Wrapper/SelectWrapper';

type Transaction = {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  category: { _id: string; name: string };
};

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

export default function ReportPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [groupBy, setGroupBy] = useState<'category' | 'month'>('category');
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      setTransactions(data.data || []);
    }
    fetchData();
  }, []);

  const filtered = transactions.filter((txn) => {
    if (typeFilter !== 'all' && txn.type !== typeFilter) return false;

    const txnDate = new Date(txn.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    if (from && txnDate < from) return false;
    if (to && txnDate > to) return false;

    return true;
  });

  const groupKey = groupBy === 'category'
    ? (txn: Transaction) => txn.category?.name || 'Uncategorized'
    : (txn: Transaction) => {
        const date = new Date(txn.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      };

  const grouped = filtered.reduce((acc: Record<string, number>, txn) => {
    const key = groupKey(txn);
    acc[key] = (acc[key] || 0) + txn.amount;
    return acc;
  }, {});

  const Data = Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }));

  const labels = Data.map((d) => d.name);
  const values = Data.map((d) => d.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Amount',
        data: values,
        backgroundColor: [
          '#8884d8',
          '#82ca9d',
          '#ffc658',
          '#ff8042',
          '#d0ed57',
          '#a4de6c',
        ],
      },
    ],
  };

  const total = Data.reduce((sum, d) => sum + d.value, 0);

  const options = {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' as const },
          tooltip: { enabled: true },
        },
      };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        📊 Report Overview
      </h1>

      {/* Toggle Chart Type */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded border ${
            chartType === "bar"
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500"
          }`}
          onClick={() => setChartType("bar")}
        >
          Bar Chart
        </button>
        <button
          className={`px-4 py-2 rounded border ${
            chartType === "pie"
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500"
          }`}
          onClick={() => setChartType("pie")}
        >
          Pie Chart
        </button>
      </div>

      {/* Filters */}
      <div className="mb-2">
        <button
          className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded text-left font-medium flex items-center justify-between"
          onClick={() => setFiltersOpen((prev) => !prev)}
        >
          <span>Filters</span>
          <span>{filtersOpen ? "▲" : "▼"}</span>
        </button>
        {filtersOpen && (
          <div className="mt-10 space-y-4">
            <div className="flex flex-wrap gap-4 justify-center">
              <SelectWrapper
                label="Filter by Income/Expense"
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as "all" | "income" | "expense")
                }
                options={[
                  { value: "all", label: "All" },
                  { value: "income", label: "Income" },
                  { value: "expense", label: "Expense" },
                ]}
              />
              <SelectWrapper
                label="Group by Category/Date"
                value={groupBy}
                onChange={(e) =>
                  setGroupBy(e.target.value as "category" | "month")
                }
                options={[
                  { value: "category", label: "Group by Category" },
                  { value: "month", label: "Group by Month" },
                ]}
              />

              <div className="flex flex-col items-start">
                <span className="text-sm mb-1">From Date</span>
                <input
                  type="date"
                  className="border px-4 py-2 rounded"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="flex flex-col items-start">
                <span className="text-sm mb-1">To Date</span>
                <input
                  type="date"
                  className="border px-4 py-2 rounded"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>

            {chartData.labels.length > 0 && (
              <p className="text-center text-lg font-semibold mt-4">
                Total: ₹{total.toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Chart */}

      <div className="w-full flex flex-col items-center justify-center h-[400px] m-3 p-3 center">
        {chartType === "bar" ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Pie data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}
