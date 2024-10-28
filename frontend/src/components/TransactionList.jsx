import React, { useState, useEffect } from 'react';

const TransactionRow = ({ transaction }) => (
  <div className="grid grid-cols-6 py-3 border-b hover:bg-gray-100 transition text-black">
    <div>{transaction.start_date ? new Date(transaction.start_date).toLocaleDateString() : 'N/A'}</div>
    <div>{transaction.description || 'No description'}</div>
    <div className={parseFloat(transaction.amount) > 0 ? 'text-green-500' : 'text-red-500'}>
      {transaction.amount ? (parseFloat(transaction.amount) > 0 ? `+${parseFloat(transaction.amount).toFixed(2)}` : parseFloat(transaction.amount).toFixed(2)) : '0.00'}
    </div>
    <div>{transaction.category || 'Uncategorized'}</div>
    <div>{'group'}</div>
    <div>{0}</div>
  </div>
);

const TransactionList = ({ transactions = [] }) => {
  const [categories, setCategories] = useState(['Direct Payment', 'Deposit']);
  const [filterType, setFilterType] = useState('All');
  const [sortOption, setSortOption] = useState('date');

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const uniqueCategories = [...new Set(transactions.map((t) => t.category || 'Uncategorized'))];
      setCategories(uniqueCategories.length > 0 ? uniqueCategories : ['Direct Payment', 'Deposit']);
    }
  }, [transactions]);

  const filteredTransactions = transactions
    .filter((transaction) => filterType === 'All' || transaction.category === filterType)
    .sort((a, b) =>
      sortOption === 'date'
        ? new Date(a.start_date) - new Date(b.start_date)
        : parseFloat(b.amount) - parseFloat(a.amount)
    );

  return (
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

      <div className="grid grid-cols-6 py-2 border-b font-semibold text-left bg-blue-500 text-white">
        <div>Date</div>
        <div>Description</div>
        <div>Amount</div>
        <div>Category</div>
        <div>Group</div>
        <div>Current Balance</div>
      </div>

      <div className="overflow-y-auto max-h-[350px]">
        {filteredTransactions && filteredTransactions.length > 0 ? (
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
