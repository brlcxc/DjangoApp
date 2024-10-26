import React, { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

const TransactionRow = ({ transaction }) => (
  <div className="grid grid-cols-5 py-3 border-b hover:bg-gray-100 transition text-black">
    <div>{transaction.date}</div>
    <div>{transaction.description}</div>
    <div>{transaction.type}</div>
    <div className={transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}>
      {transaction.amount > 0 ? `+${transaction.amount.toFixed(2)}` : transaction.amount.toFixed(2)}
    </div>
    <div>{transaction.balance.toFixed(2)}</div>
  </div>
);

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  const [categories, setCategories] = useState(['Direct Payment', 'Deposit']);
  const [filterType, setFilterType] = useState('All');
  const [sortOption, setSortOption] = useState('date');

  const currentBalance = transactions.reduce(
    (acc, transaction) =>
      acc + (transaction.status !== 'Failed' ? transaction.amount : 0),
    0
  );

  const filteredTransactions = transactions
    .filter((transaction) => filterType === 'All' || transaction.type === filterType)
    .sort((a, b) => (sortOption === 'date' ? new Date(a.date) - new Date(b.date) : b.amount - a.amount));

  const activeCategories = categories.filter((category) =>
    transactions.some((t) => t.type === category)
  );

  const categoryData = activeCategories.map((category) => {
    const totalAmount = transactions
    .filter((t) => t.type === category)
    .reduce((sum, t) => sum + t.amount, 0);
  return totalAmount;
});

return (
  <div>
    <div>
      <h1 className="text-2xl font-bold mb-5 text-black">Transaction List</h1>

      <div className="flex justify-between mb-5">
        <div>
          <label className="mr-2">Filter by Category:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded p-2 bg-white text-black"
          >
            <option value="All">All</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-2">Sort by:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded p-2 bg-white text-black"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-5 py-2 border-b font-semibold text-left bg-blue-500 text-white">
        <div>Date</div>
        <div>Description</div>
        <div>Category</div>
        <div>Amount</div>
        <div>Current Balance</div>
      </div>

      {filteredTransactions.length > 0 ? (
        filteredTransactions.map((transaction, index) => (
          <TransactionRow key={index} transaction={transaction} />
        ))
      ) : (
        <div className="text-center py-10 text-gray-500">No transactions found</div>
      )}
    </div>
  </div>
);
};

export default TransactionList;