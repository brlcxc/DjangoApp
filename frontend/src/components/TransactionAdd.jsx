import React, { useState, useEffect, useMemo } from 'react';

const TransactionAdd = () => {
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

    if (isCustomSelected && customCategory && !categories.includes(customCategory)) {
      setCategories((prevCategories) => [...prevCategories, customCategory]);
    }

    setCustomCategory('');
    setIsCustomSelected(false);
  };

return (
  <div>
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
  </div>
);
};

export default TransactionAdd;