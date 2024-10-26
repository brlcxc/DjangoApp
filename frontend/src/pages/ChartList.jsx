import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API requests
import Charts from "../components/Charts";
import TransactionAdd from "../components/TransactionAdd";
import TransactionList from "../components/TransactionList";

function ChartList({ groupUUIDs }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API in a central location
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // Replace this URL with your actual API endpoint
        const response = await axios.get(`/api/transactions/c72d0191-c970-4c55-b943-178d564300d7/`);
        setTransactions(response.data);
      } catch (error) {
        setError('Error fetching transactions');
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (groupUUIDs) {
      fetchTransactions();
    }
  }, [groupUUIDs]);

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-6xl mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg">
      {/* List Section */}
      <div>
        {loading ? (
          <div>Loading transactions...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <TransactionList transactions={transactions} />
        )}
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