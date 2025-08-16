'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import SelectWrapper from './Wrapper/SelectWrapper';

type Transaction = {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  category: { _id: string; name: string };
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#d0ed57', '#a4de6c'];

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

  const chartData = Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">📊 Report Overview</h1>

      {/* Toggle Chart Type */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded border ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
          onClick={() => setChartType('bar')}
        >
          Bar Chart
        </button>
        <button
          className={`px-4 py-2 rounded border ${chartType === 'pie' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
          onClick={() => setChartType('pie')}
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
                onChange={(e) => setTypeFilter(e.target.value as 'all' | 'income' | 'expense')}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'income', label: 'Income' },
                  { value: 'expense', label: 'Expense' },
                ]}
              />
            <SelectWrapper
                label="Group by Category/Date"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as 'category' | 'month')}
                options={[
                  { value: 'category', label: 'Group by Category' },
                  { value: 'month', label: 'Group by Month' },
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
              <span className="text-sm mb-1">From Date</span>
                  <input
                      type="date"
                      className="border px-4 py-2 rounded"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                  />
              </div>
          </div>

          {chartData.length > 0 && (
            <p className="text-center text-lg font-semibold mt-4">
              Total: ₹{total.toLocaleString()}
            </p>
          )}
        </div>
        )}
      </div>

      {/* Chart */}
      <div className="w-full h-[400px]">
        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
            <div className="w-full h-[400px] max-w-full sm:max-w-[600px] mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={window.innerWidth < 640 ? 80 : 140} // adapt radius for small screens
                label//</PieChart>={window.innerWidth >= 640} // hide label on small screens
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          </div>
        )}
      </div>

      
    </div>
  );
}
