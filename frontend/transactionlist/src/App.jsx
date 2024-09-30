// src/App.jsx
import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TransactionRow = ({ transaction }) => {
  return (
    <div className="grid grid-cols-6 py-3 border-b hover:bg-gray-100 transition text-black">
      <div>{transaction.date}</div>
      <div>{transaction.description}</div>
      <div>{transaction.type}</div>
      <div className={transaction.amount > 0 ? "text-green-500" : "text-red-500"}>
        {transaction.amount > 0 ? `+${transaction.amount.toFixed(2)}` : transaction.amount.toFixed(2)}
      </div>
      <div>{transaction.status}</div>
      <div>{transaction.balance.toFixed(2)}</div>
    </div>
  );
};

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    description: '',
    type: 'Direct Payment',
    amount: '',
    status: 'Pending',
  });
  const [filterType, setFilterType] = useState('All');
  const [sortOption, setSortOption] = useState('date');

  const currentBalance = transactions.reduce((acc, transaction) => acc + (transaction.status !== 'Failed' ? transaction.amount : 0), 0);

  const addTransaction = (e) => {
    e.preventDefault();
    
    const transactionAmount = parseFloat(newTransaction.amount);
    let updatedBalance = currentBalance;

    // Only update the balance if the status is NOT "Failed"
    if (newTransaction.status !== 'Failed') {
      updatedBalance += transactionAmount;
    }

    const updatedTransactions = [
      ...transactions,
      {
        ...newTransaction,
        amount: transactionAmount,
        balance: updatedBalance,
      },
    ];

    setTransactions(updatedTransactions);
    setNewTransaction({ date: '', description: '', type: 'Direct Payment', amount: '', status: 'Pending' });
  };

  const transactionTypeCounts = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'Direct Payment') {
        acc.directPayment += Math.abs(transaction.amount);
      } else if (transaction.type === 'Deposit') {
        acc.deposit += Math.abs(transaction.amount);
      }
      return acc;
    },
    { directPayment: 0, deposit: 0 }
  );

  const data = {
    labels: ['Direct Payment', 'Deposit'],
    datasets: [
      {
        label: 'Transactions',
        data: [transactionTypeCounts.directPayment, transactionTypeCounts.deposit],
        backgroundColor: ['#ff6384', '#36a2eb'],
        hoverBackgroundColor: ['#ff6384', '#36a2eb'],
      },
    ],
  };

  const onPieClick = (elems) => {
    if (elems && elems.length > 0) {
      const clickedIndex = elems[0].index;
      const clickedLabel = data.labels[clickedIndex];
      setFilterType(clickedLabel);
    }
  };

  const filteredTransactions = transactions
    .filter(transaction => filterType === 'All' || transaction.type === filterType)
    .sort((a, b) => {
      if (sortOption === 'date') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortOption === 'amount') {
        return b.amount - a.amount;
      } else if (sortOption === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg grid grid-cols-2 gap-4">
      {/* Left Column - Transaction Table */}
      <div>
        <h1 className="text-2xl font-bold mb-5 text-black">Transaction List</h1>

        {/* Advanced Filters */}
        <div className="flex justify-between mb-5">
          <div>
            <label className="mr-2">Filter by Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded p-2 bg-white text-black"
            >
              <option value="All" className="bg-white text-black">All</option>
              <option value="Direct Payment" className="bg-white text-black">Direct Payment</option>
              <option value="Deposit" className="bg-white text-black">Deposit</option>
            </select>
          </div>
          <div>
            <label className="mr-2">Sort by:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border rounded p-2 bg-white text-black"
            >
              <option value="date" className="bg-white text-black">Date</option>
              <option value="amount" className="bg-white text-black">Amount</option>
              <option value="status" className="bg-white text-black">Status</option>
            </select>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="grid grid-cols-6 py-2 border-b font-semibold text-left bg-blue-500 text-white">
          <div>Date</div>
          <div>Description</div>
          <div>Type</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Current Balance</div>
        </div>

        {/* Display transactions or empty state */}
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, index) => (
            <TransactionRow key={index} transaction={transaction} />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">No transactions found</div>
        )}

        {/* Add Transaction Form */}
        <form className="mt-8" onSubmit={addTransaction}>
          <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
          <div className="grid grid-cols-4 gap-4">
            {/* Date Input */}
            <input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              required
              placeholder="mm/dd/yyyy"
              className="border rounded p-2 bg-white text-black w-full appearance-none"
            />
            {/* Description Input */}
            <input
              type="text"
              placeholder="Description"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              required
              className="border rounded p-2 bg-white text-black"
            />
            {/* Transaction Type Select */}
            <select
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
              className="border rounded p-2 bg-white text-black"
            >
              <option value="Direct Payment" className="bg-white text-black">Direct Payment</option>
              <option value="Deposit" className="bg-white text-black">Deposit</option>
            </select>
            {/* Amount Input */}
            <input
              type="number"
              placeholder="Amount"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
              required
              className="border rounded p-2 bg-white text-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Status Select */}
            <select
              value={newTransaction.status}
              onChange={(e) => setNewTransaction({ ...newTransaction, status: e.target.value })}
              className="border rounded p-2 bg-white text-black"
            >
              <option value="Pending" className="bg-white text-black">Pending</option>
              <option value="Completed" className="bg-white text-black">Completed</option>
              <option value="Failed" className="bg-white text-black">Failed</option>
            </select>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-green-300 hover:bg-green-400 text-black px-4 py-2 rounded"
            >
              Add Transaction
            </button>
          </div>
        </form>

        {/* Current Balance */}
        <div className="mt-8 text-xl">
          <span className="font-semibold text-black">Current Balance: </span>
          <span className={currentBalance >= 0 ? 'text-green-500' : 'text-red-500'}>
            {currentBalance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Right Column - Pie Chart */}
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold mb-5">Transaction Overview</h2>
        <Pie
          data={data}
          onClick={(evt, elems) => onPieClick(elems)}
        />
      </div>
    </div>
  );
};

export default App;




