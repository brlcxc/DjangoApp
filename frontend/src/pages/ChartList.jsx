import React, { useState, useEffect } from "react";
import Charts from "../components/Charts";
import TransactionAdd from "../components/TransactionAdd";
import TransactionList from "../components/TransactionList";
import "tailwindcss/tailwind.css"; // Make sure Tailwind CSS is properly imported :)
import ToggleList from "../components/toggle";

import api from "../api";
const testGroups = [
  {
    group_id: "1",
    group_name: "Finance Enthusiasts",
    description: "A group focused on financial planning and budgeting.",
  },
  {
    group_id: "2",
    group_name: "Investment Gurus",
    description:
      "A group for discussions on investment strategies and market trends.",
  },
  {
    group_id: "3",
    group_name: "Crypto Analysts",
    description: "Members analyze and discuss the latest in cryptocurrency.",
  },
  {
    group_id: "4",
    group_name: "Savings Squad",
    description:
      "A group dedicated to sharing tips and tricks for effective saving.",
  },
  {
    group_id: "5",
    group_name: "Budgeting Beginners",
    description:
      "A beginner-friendly group for learning the basics of budgeting.",
  },
  {
    group_id: "6",
    group_name: "Wealth Builders",
    description:
      "A community for those interested in long-term wealth building strategies.",
  },
  {
    group_id: "7",
    group_name: "Debt-Free Journey",
    description:
      "Support group for individuals working towards a debt-free life.",
  },
  {
    group_id: "8",
    group_name: "Retirement Planners",
    description: "For those planning and preparing for a secure retirement.",
  },
];

function ChartList({ groupUUIDs }) {
  const [transactions, setTransactions] = useState([]);
  // TODO
  const [loading, setLoading] = useState(true);
  // TODO
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get(
          "/api/transactions/c72d0191-c970-4c55-b943-178d564300d7/"
        );
        console.log("API Response:", response.data);
        setTransactions(response.data); // Update state with fetched transactions
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTransactions();
  }, []);
  
  const style = "bg-white p-8 mb-8 rounded-xl shadow-lg mb-8 ";

  return (
    <div className="grid grid-cols-2 gap-8 size-full p-8 bg-custom-gradient animate-gradient">
      <div>
        {/* List Section */}
        <div className={`${style} h-[70%]`}>
          <TransactionList transactions={transactions} />
        </div>
        {/* Form Section */}
        <div className={`${style} h-[25%]`}>
          <TransactionAdd transactions={transactions} />
        </div>
      </div>
      <div>
        {/* Chart Section */}
        <div className={`${style} h-[70%]`}>
          <Charts transactions={transactions} />
        </div>
        {/* Group Section */}
        <div className={`${style} h-[25%]`}>
          <ToggleList />
        </div>
      </div>
    </div>
  );
}

export default ChartList;
