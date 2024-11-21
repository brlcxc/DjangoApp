import React, { useState, useContext } from "react";
import { FaPencil, FaCheck, FaXmark } from "react-icons/fa6";
import { TransactionContext } from "../context/TransactionContext";

// Also, just pass a boolean for merge data instead of the whole thing
// Note: this still kind of breaks in smaller sizes
// It also needs components with relative sizes rather than hard set sizes

const TransactionRow = ({ transaction, mergeData, onDelete, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableTransaction, setEditableTransaction] = useState({
    ...transaction,
  });
  const { updateTransaction } =
    useContext(TransactionContext);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditableTransaction({ ...transaction }); // Reset changes when entering edit mode
    }
  };

  const handleInputChange = (field, value) => {
    setEditableTransaction((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateTransaction(editableTransaction.transaction_id, editableTransaction); // Update the transaction via context
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  return (
    <div className="flex w-full">
      <div className="w-full">
        <div className="flex flex-row py-3 gap-2 pl-2 border-b hover:bg-gray-100 transition text-black h-[60px] items-center">
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
              <div className="flex flex-col gap-1">
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
                  <FaXmark />
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
              !isEditing
                ? parseFloat(transaction.amount) > 0
                  ? "text-green-500"
                  : "text-red-500"
                : ""
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

export default TransactionRow;
