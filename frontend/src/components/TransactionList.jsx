import React, { useState } from 'react';

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
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    description: '',
    type: '', // Category input
    amount: '',
    status: 'Pending',
  });

  const [categories, setCategories] = useState(['Direct Payment', 'Deposit']);
  const [customCategory, setCustomCategory] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortOption, setSortOption] = useState('date');
  const [isCustomSelected, setIsCustomSelected] = useState(false);

  const currentBalance = transactions.reduce(
    (acc, transaction) =>
      acc + (transaction.status !== 'Failed' ? transaction.amount : 0),
    0
  );

  const addTransaction = (e) => {
    e.preventDefault();
    const transactionAmount = parseFloat(newTransaction.amount);
    let updatedBalance = currentBalance;

    if (newTransaction.status !== 'Failed') {
      updatedBalance += transactionAmount;
    }

    const category = isCustomSelected ? customCategory : newTransaction.type;

    const updatedTransactions = [
      ...transactions,
      {
        ...newTransaction,
        type: category,
        amount: transactionAmount,
        balance: updatedBalance,
      },
    ];

    setTransactions(updatedTransactions);
    setNewTransaction({ date: '', description: '', type: '', amount: '', status: 'Pending' });

    // Add the custom category if it's new
    if (isCustomSelected && customCategory && !categories.includes(customCategory)) {
      setCategories([...categories, customCategory]);
    }

    // Reset custom category input
    setCustomCategory('');
    setIsCustomSelected(false);
  };

  const filteredTransactions = transactions
    .filter((transaction) => filterType === 'All' || transaction.type === filterType)
    .sort((a, b) => (sortOption === 'date' ? new Date(a.date) - new Date(b.date) : b.amount - a.amount));

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg grid grid-cols-1 gap-4">
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

        <form className="mt-8" onSubmit={addTransaction}>
          <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
          <div className="grid grid-cols-4 gap-4">
            <input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              required
              className="border rounded p-2 bg-white text-black"
            />
            <input
              type="text"
              placeholder="Description"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              required
              className="border rounded p-2 bg-white text-black"
            />
            <div className="relative">
              <select
                value={newTransaction.type}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewTransaction({ ...newTransaction, type: value });
                  setIsCustomSelected(value === 'custom');
                }}
                className="border rounded p-2 bg-white text-black w-full"
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
                <option value="custom">Add Custom Category</option>
              </select>
              {isCustomSelected && (
                <input
                  type="text"
                  placeholder="Custom Category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="border rounded p-2 mt-2 w-full"
                />
              )}
            </div>
            <input
              type="number"
              placeholder="Amount"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
              required
              className="border rounded p-2 bg-white text-black"
            />
          </div>

          <button
            type="submit"
            className="bg-green-300 hover:bg-green-400 text-black px-4 py-2 rounded mt-4"
          >
            Add Transaction
          </button>
        </form>

        <div className="mt-8 text-xl">
          <span className="font-semibold text-black">Current Balance: </span>
          <span className={currentBalance >= 0 ? 'text-green-500' : 'text-red-500'}>
            {currentBalance.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;


