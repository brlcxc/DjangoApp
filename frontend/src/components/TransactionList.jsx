import React, { useState, useEffect, useContext } from "react";
import { FaPencil } from "react-icons/fa6";
import { TransactionContext } from "../context/TransactionContext";

const TransactionRow = ({ transaction, mergeData }) => (
  <div className="flex w-full">
    <div className="w-full">
      <div className="flex flex-row py-3 gap-2 pl-2 border-b hover:bg-gray-100 transition text-black min-w-[640px] min-h-[60px]">
        <div className={`flex items-center w-16 ${
            mergeData.length > 0
              ? "invisible"
              : ""
          }`}>
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
        <div className="truncate w-24">
          {transaction.start_date
            ? new Date(transaction.start_date).toLocaleDateString()
            : "N/A"}
        </div>
        <div className="truncate w-32">
          {transaction.description || "No description"}
        </div>
        <div
          className={`truncate w-20 ${
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
        <div className="truncate w-44">
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
      <div>
        <div className="flex flex-row py-2 pl-9 border-b font-semibold text-left bg-dodger-blue text-white min-w-[640px]">
          <div className="text-right w-20">Date</div>
          <div className="text-right w-36">Description</div>
          <div className="text-right w-[120px]">Amount</div>
          <div className="text-right w-[92px]">Category</div>
          <div className="text-left pl-[120px]">Group</div>
        </div>
        <div className="overflow-y-auto	max-h-[390px]">
          {filteredTransactions && filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <TransactionRow key={index} transaction={transaction} mergeData={mergeData}/>
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
