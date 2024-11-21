import React, { useState, useEffect, useContext } from "react";
import { FaPencil } from "react-icons/fa6";
import { TransactionContext } from "../context/TransactionContext";

// Since transaction context is already in the list I might pass a var which can provide data and merge it with the data here
// for chart it will follow a different form so I will probably need a new chart for that
const TransactionRow = ({ transaction }) => (
  <div className="flex">
    <div className="flex items-center">
      <button
        type="button"
        className="flex font-bold text-white text-l bg-coral mr-3 size-5 justify-center items-center rounded p-1 hover:bg-deep-coral focus:outline-none"
      >
        -
      </button>
      <button
        type="button"
        className="flex font-bold border-2 border-gray-400 text-l mr-3 size-5 justify-center items-center rounded p-1 focus:outline-none"
      >
        <FaPencil />
      </button>
    </div>
    <div>
      <div className="grid grid-cols-5 py-3 pl-2 border-b hover:bg-gray-100 transition text-black min-w-[640px] min-h-[60px]">
        <div className="truncate">
          {transaction.start_date
            ? new Date(transaction.start_date).toLocaleDateString()
            : "N/A"}
        </div>
        <div className="truncate">
          {transaction.description || "No description"}
        </div>
        <div
          className={`truncate ${
            parseFloat(transaction.amount) > 0
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {transaction.amount
            ? parseFloat(transaction.amount) > 0
              ? `+${parseFloat(transaction.amount).toFixed(2)}`
              : parseFloat(transaction.amount).toFixed(2)
            : "0.00"}
        </div>
        <div className="truncate">
          {transaction.category || "Uncategorized"}
        </div>
        <div className="truncate">{transaction.group_name || "No Group"}</div>
      </div>
    </div>
  </div>
);

const TransactionList = ({ mergeData = [], title = "Transaction List" }) => {
  const { transactions, loading, error } = useContext(TransactionContext);
  const [categories, setCategories] = useState(["Direct Payment", "Deposit"]);
  const [filterType, setFilterType] = useState("All");
  const [sortOption, setSortOption] = useState("date");

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

      <div className="overflow-y-auto	max-h-[390px]">
        <div className="grid grid-cols-6 py-2 pl-20 border-b font-semibold text-left bg-dodger-blue text-white min-w-[640px]">
          <div>Date</div>
          <div>Description</div>
          <div>Amount</div>
          <div>Category</div>
          <div>Group</div>
        </div>
        {filteredTransactions && filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, index) => (
            <TransactionRow key={index} transaction={transaction} />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
