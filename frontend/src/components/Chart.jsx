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
        {/* Display transactions or empty state */}
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, index) => (
            <TransactionRow key={index} transaction={transaction} />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500"></div>
        )}

        {/* Add Transaction Form */}
        <form className="mt-8" onSubmit={addTransaction}>
          <div className="grid grid-cols-4 gap-4">
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
          </div>
        </form>
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