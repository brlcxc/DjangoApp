import React, { useContext, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { TransactionContext } from "../context/TransactionContext";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register the Chart.js components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const TransactionLineChart = ({ mergeData = [] }) => {
  const { transactions } = useContext(TransactionContext);

  // Combine transactions and mergeData, then format the data
  const chartData = useMemo(() => {
    const formattedMergeData = mergeData.map(item => ({
      ...item,
      start_date: item.date,
      amount: parseFloat(item.amount) || 0,
    }));

    const combinedTransactions = [...transactions, ...formattedMergeData];

    // Sort by date for chronological order
    combinedTransactions.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    // Map data for Chart.js
    return {
      labels: combinedTransactions.map(transaction => 
        transaction.start_date ? new Date(transaction.start_date).toLocaleDateString() : "N/A"
      ),
      datasets: [
        {
          label: "Transaction Amount",
          data: combinedTransactions.map(transaction => transaction.amount || 0),
          fill: false,
          borderColor: "rgba(75,192,192,1)",
          tension: 0.1,
        },
      ],
    };
  }, [transactions, mergeData]);

  // Chart options
  const options = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Amount' } },
    },
    plugins: {
      legend: { display: true, position: 'top' },
    },
  };

  return (
    <div className="mb-5">
      <h2 className="text-xl font-bold mb-3">Transaction Trend</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TransactionLineChart;
