import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { ACCESS_TOKEN } from "../constants";
import api from "../api";

const TransactionAdd = ({ groupUuid, transactions = [] }) => {
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    description: '',
    type: '',
    amount: '',
    status: 'Pending',
  });

  const [customCategory, setCustomCategory] = useState('');
  const [isCustomSelected, setIsCustomSelected] = useState(false);

  // Use unique categories or default options
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(transactions.map((t) => t.category || 'Uncategorized')),
    ];
    return uniqueCategories.length > 0
      ? uniqueCategories
      : ['Direct Payment', 'Deposit'];
  }, [transactions]);

  const currentBalance = transactions.reduce(
    (acc, transaction) =>
      acc + (transaction.status !== 'Failed' ? transaction.amount : 0),
    0
  );

  const addTransaction = async (e) => {
    e.preventDefault();
    const transactionAmount = parseFloat(newTransaction.amount);
    let updatedBalance = currentBalance;

    if (newTransaction.status !== 'Failed') {
      updatedBalance += transactionAmount;
    }

    const category = isCustomSelected ? customCategory : newTransaction.type;

    const transactionData = {
      category,
      amount: transactionAmount,
      description: newTransaction.description,
      start_date: newTransaction.date,
      end_date: null,
      is_recurrent: false,
      frequency: 0,
    };

    try {
      const response = await api.post(
        `/api/groups/${groupUuid}/transactions/`,
        transactionData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ACCESS_TOKEN}`, 
          },
        }
      );

      setNewTransaction({
        date: '',
        description: '',
        type: '',
        amount: '',
        status: 'Pending',
      });

      if (isCustomSelected && customCategory && !categories.includes(customCategory)) {
        categories.push(customCategory); // Dynamically add custom category
      }

      setCustomCategory('');
      setIsCustomSelected(false);
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form className="mt-8" onSubmit={addTransaction}>
        <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
        <div className="grid grid-cols-4 gap-4 items-start">
          <input
            type="date"
            value={newTransaction.date}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, date: e.target.value })
            }
            required
            className="border rounded p-2 bg-white text-black"
          />
          <input
            type="text"
            placeholder="Description"
            value={newTransaction.description}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                description: e.target.value,
              })
            }
            required
            className="border rounded p-2 bg-white text-black"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, amount: e.target.value })
            }
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
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4 items-center">
          <button
            type="submit"
            className="bg-green-300 hover:bg-green-400 text-black px-8 py-2 rounded col-span-3"
          >
            Add Transaction
          </button>

          {isCustomSelected && (
            <input
              type="text"
              placeholder="Custom Category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="border rounded p-2"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default TransactionAdd;
