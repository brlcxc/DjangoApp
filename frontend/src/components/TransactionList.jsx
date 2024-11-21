import React, { useState, useEffect, useContext } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { TransactionContext } from "../context/TransactionContext";

// Note: this still kind of breaks in smaller sizes
// It also needs components with relative sizes rather than hard set sizes
const TransactionRow = ({ transaction, mergeData, onDelete, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableTransaction, setEditableTransaction] = useState({
    ...transaction,
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditableTransaction({ ...transaction }); // Reset changes if canceled
    }
  };

  const handleInputChange = (field, value) => {
    setEditableTransaction((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(editableTransaction); // Pass the updated transaction to the parent
    setIsEditing(false);
  };

  return (
    <div className="flex w-full">
      <div className="w-full">
        <div className="flex flex-row py-3 gap-2 pl-2 border-b hover:bg-gray-100 transition text-black min-h-[60px]">
          <div
            className={`flex items-center w-16 ${
              mergeData.length > 0 ? "invisible" : ""
            }`}
          >
            <button
              type="button"
              onClick={async () => {
                const confirmDelete = await new Promise((resolve) => {
                  const userConfirmed = window.confirm(
                    "Are you sure you want to delete this transaction?"
                  );
                  resolve(userConfirmed);
                });

                if (confirmDelete) {
                  onDelete(transaction.transaction_id); // Call onDelete only if confirmed
                }
              }}
              className="flex font-bold text-white text-l bg-coral mr-3 size-5 justify-center items-center rounded p-1 hover:bg-deep-coral focus:outline-none"
            >
              -
            </button>
            {isEditing ? (
              <div>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex font-bold border-2 border-green-400 text-l mr-1 size-5 justify-center items-center rounded p-1 focus:outline-none bg-green-100 hover:bg-green-300"
                >
                  <FaCheck />
                </button>
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="flex font-bold border-2 border-red-400 text-l size-5 justify-center items-center rounded p-1 focus:outline-none bg-red-100 hover:bg-red-300"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleEditToggle}
                className="flex font-bold border-2 border-gray-400 text-l mr-3 size-5 justify-center items-center rounded p-1 focus:outline-none"
              >
                <FaPencil />
              </button>
            )}
          </div>
          <div className="truncate w-24">
            {isEditing ? (
              <input
                type="date"
                value={editableTransaction.start_date || ""}
                onChange={(e) =>
                  handleInputChange("start_date", e.target.value)
                }
                className="border border-gray-300 rounded p-1 w-[91px]"
              />
            ) : transaction.start_date ? (
              new Date(transaction.start_date).toLocaleDateString()
            ) : (
              "N/A"
            )}
          </div>
          <div className="truncate w-32">
            {isEditing ? (
              <input
                type="text"
                value={editableTransaction.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="border border-gray-300 rounded p-1 w-[123px]"
              />
            ) : (
              transaction.description || "No description"
            )}
          </div>
          <div
            className={`truncate w-20 ${
              parseFloat(transaction.amount) > 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {isEditing ? (
              <input
                type="number"
                value={editableTransaction.amount || ""}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="border border-gray-300 rounded p-1 w-[75px] "
              />
            ) : transaction.amount ? (
              parseFloat(transaction.amount) > 0 ? (
                `+${parseFloat(transaction.amount).toFixed(2)}`
              ) : (
                parseFloat(transaction.amount).toFixed(2)
              )
            ) : (
              "0.00"
            )}
          </div>
          <div className="truncate w-44">
            {isEditing ? (
              <input
                type="text"
                value={editableTransaction.category || ""}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="border border-gray-300 rounded p-1 w-[171px]"
              />
            ) : (
              transaction.category || "Uncategorized"
            )}
          </div>
          <div className="truncate">
            {isEditing ? (
              <input
                type="text"
                value={editableTransaction.group_name || ""}
                onChange={(e) =>
                  handleInputChange("group_name", e.target.value)
                }
                className="border border-gray-300 rounded p-1"
              />
            ) : (
              transaction.group_name || "No Group"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionList = ({ mergeData = [], title = "Transaction List" }) => {
  const { transactions, loading, error, removeTransaction } =
    useContext(TransactionContext);
  const [categories, setCategories] = useState(["Direct Payment", "Deposit"]);
  const [filterType, setFilterType] = useState("All");
  const [sortOption, setSortOption] = useState("date");

  const handleDeleteTransaction = (transactionId) => {
    // Call the removeTransaction function from the context or API
    removeTransaction(transactionId);
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
