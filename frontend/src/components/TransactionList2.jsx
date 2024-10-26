import React, { useState, useEffect, useMemo } from 'react';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

// Predefined color palette for the first 5 categories (including the 2 predefined categories :) 
const palette = ['#F1E3F3', '#C2BBF0', '#F699BB', '#62BFED', '#3590F3'];

// generate random colors for the rest after 5
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Utility function to map categories to colors from the palette
const mapCategoryColors = (categories) => {
  const categoryColors = {};
  categories.forEach((category, index) => {
    // Use palette for the first 5 categories, random colors for the rest (keep it on theme!!!!)
    categoryColors[category] = index < palette.length 
      ? palette[index] 
      : generateRandomColor();
  });
  return categoryColors;
};


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
    type: '',
    amount: '',
    status: 'Pending',
  });

  const [categories, setCategories] = useState(['Direct Payment', 'Deposit']);
  const [customCategory, setCustomCategory] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortOption, setSortOption] = useState('date');
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [chartType, setChartType] = useState('bar');

  const categoryColors = useMemo(() => mapCategoryColors(categories), [categories]);

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

    if (isCustomSelected && customCategory && !categories.includes(customCategory)) {
      setCategories((prevCategories) => [...prevCategories, customCategory]);
    }

    setCustomCategory('');
    setIsCustomSelected(false);
  };

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

const chartData = {
  labels: activeCategories,
  datasets: [
    {
      data: categoryData,
      backgroundColor: activeCategories.map(
        (category) => categoryColors[category]
      ),
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  plugins: {
    legend: {
      display: chartType === 'pie' || chartType === 'doughnut',
    },
  },
  scales:
    chartType === 'bar' || chartType === 'line'
      ? {
          y: {
            beginAtZero: true,
          },
        }
      : {},
};
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