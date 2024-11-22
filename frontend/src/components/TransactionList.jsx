import React, { useState, useEffect, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import TransactionRow from "./TransactionRow.jsx"

const TransactionList = ({ mergeData = [], title = "Transaction List" }) => {
  const { transactions, loading, error, removeTransaction, updateTransaction } =
    useContext(TransactionContext);
  const [categories, setCategories] = useState(["Direct Payment", "Deposit"]);
  const [filterType, setFilterType] = useState("All");
  const [sortOption, setSortOption] = useState("date");

  const handleDeleteTransaction = (transactionId) => {
    removeTransaction(transactionId);
  };

  //Note: not currently in use
  //There is a greater delay when updateTransaction is called in the list
  const handleSaveTransaction = (transactionId, editedTransaction) => {
    updateTransaction(transactionId, editedTransaction);
  };

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const uniqueCategories = [
        ...new Set(transactions.map((t) => t.category || "Uncategorized")),
      ];
      setCategories(
        uniqueCategories.length > 0
          ? uniqueCategories
          : ["Direct Payment", "Deposit"]
      );
    }
  }, [transactions]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Format dates and ensure group_name in mergeData
  const formattedMergeData = mergeData.map((item) => ({
    ...item,
    start_date: new Date(item.date).toISOString(), // Convert date to ISO format
    group_name: item.group_name || "LLM Generated", // Default group name
  }));

  // Combine transactions and formattedMergeData
  const combinedTransactions = [...transactions, ...formattedMergeData];

  // Filter and sort the combined transactions
  const filteredTransactions = combinedTransactions
    .filter(
      (transaction) =>
        filterType === "All" || transaction.category === filterType
    )
    .sort((a, b) =>
      sortOption === "date"
        ? new Date(b.start_date) - new Date(a.start_date)
        : parseFloat(b.amount) - parseFloat(a.amount)
    );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5 text-black">{title}</h1>
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
      <div className="w-full overflow-x-auto">
        <div className="min-w-[640px] flex flex-row py-2 pl-9 border-b font-semibold text-left bg-dodger-blue text-white">
          <div className="text-right w-20">Date</div>
          <div className="text-right w-36">Description</div>
          <div className="text-right w-[120px]">Amount</div>
          <div className="text-right w-[92px]">Category</div>
          <div className="text-left pl-[120px]">Group</div>
        </div>
        <div className="min-w-[640px] overflow-y-auto max-h-[390px]">
          {filteredTransactions && filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <TransactionRow
                key={index}
                transaction={transaction}
                mergeData={mergeData}
                onDelete={handleDeleteTransaction}
                onSave={handleSaveTransaction}
              />
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              No transactions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
