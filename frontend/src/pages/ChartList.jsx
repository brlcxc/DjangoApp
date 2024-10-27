import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API requests
import Charts from "../components/Charts";
import TransactionAdd from "../components/TransactionAdd";
import TransactionList from "../components/TransactionList";
import api from "../api";

function ChartList({ groupUUIDs }) {
  const [transactions, setTransactions] = useState([]);
  // TODO
  const [loading, setLoading] = useState(true);
  // TODO
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const response = await api.get('/api/transactions/c72d0191-c970-4c55-b943-178d564300d7/');
      console.log('API Response:', response.data);
      setTransactions(response.data); // Update state with fetched transactions
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchTransactions();
}, []);

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-6xl mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg">
      {/* List Section */}
      <div>
        {/* {loading ? (
          <div>Loading transactions...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <TransactionList transactions={transactions} />
        )} */}
         <TransactionList transactions={transactions} />
      </div>
      
      {/* Chart Section */}
      <div>
        <Charts transactions={transactions} />
      </div>
      
      {/* Form Section */}
      <div className="col-span-2">
        <TransactionAdd />
      </div>
    </div>
  );
}

export default ChartList;
