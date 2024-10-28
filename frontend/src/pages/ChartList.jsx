import React, { useState, useEffect } from 'react';
import Charts from "../components/Charts";
import TransactionAdd from "../components/TransactionAdd";
import TransactionList from "../components/TransactionList";
import 'tailwindcss/tailwind.css'; // Make sure Tailwind CSS is properly imported :)
import ToggleList from "../components/toggle";
import api from "../api";

function ChartList({ groupUUIDs }) {
  const [transactions, setTransactions] = useState([]);
  // TODO
  const [loading, setLoading] = useState(true);
  // TODO
  const [error, setError] = useState(null);
  const style = "bg-white p-8 rounded-xl";


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
    <div className="grid grid-cols-2 gap-4 w-full p-8 bg-custom-gradient animate-gradient">
      {/* List Section */}
      <div className={style}>
         <TransactionList transactions={transactions} />
      </div>
      
      {/* Chart Section */}
      <div  className={style}>
        <Charts transactions={transactions} />
      </div>
      
      {/* Form Section */}
      <div className="col-span-2 bg-white p-8 rounded-xl">
        <TransactionAdd transactions={transactions} />
      </div>
      {/* <div>
        <ToggleList/>
      </div> */}
    </div>
  );
}

export default ChartList;
