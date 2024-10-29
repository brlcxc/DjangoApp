import React, { useContext, useMemo, useState } from 'react';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import 'tailwindcss/tailwind.css';
import { TransactionContext } from '../TransactionContext';
ChartJS.register(...registerables);

// Tailwind color mapping
const colorMap = {
  'pale-purple': '#F1E3F3',
  'periwinkle': '#C2BBF0',
  'amaranth-pink': '#F698BB',
  'deep-sky-blue': '#62BFED',
  'dodger-blue': '#3590F3',
};

// Generate a random color for extra categories
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Utility function to map categories to colors
const mapCategoryColors = (categories) => {
  const categoryColors = {};
  categories.forEach((category, index) => {
    const colorKeys = Object.keys(colorMap);
    categoryColors[category] =
      index < colorKeys.length ? colorKeys[index] : generateRandomColor();
  });
  return categoryColors;
};
const Charts = () => {
  const { transactions, loading, error } = useContext(TransactionContext);
  const validTransactions = Array.isArray(transactions) ? transactions : [];
  const [chartType, setChartType] = useState('doughnut');

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(validTransactions.map((t) => t.category || 'Uncategorized')),
    ];
    return uniqueCategories.length > 0
      ? uniqueCategories
      : ['Direct Payment', 'Deposit'];
  }, [validTransactions]);

  const categoryColors = useMemo(() => mapCategoryColors(categories), [categories]);

  const activeCategories = categories.filter((category) =>
    validTransactions.some((t) => t.category === category)
  );

  const categoryData = activeCategories.map((category) => {
    const totalAmount = validTransactions
      .filter((t) => t.category === category)
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    return totalAmount;
  });

  // Handle loading and error states after hooks
  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error fetching transactions: {error.message}</div>;

  const chartData = {
    labels: activeCategories,
    datasets: [
      {
        label: 'Total Amount per Category',
        data: categoryData,
        backgroundColor: activeCategories.map((category) => {
          const color = categoryColors[category];
          return colorMap[color] || color;
        }),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: chartType === 'pie' || chartType === 'doughnut',
      },
    },
    scales:
      chartType === 'bar' || chartType === 'line'
        ? {
            y: {
              beginAtZero: true,
            },
          }
        : {},
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'pie':
        return <Pie data={chartData} options={chartOptions} />;
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={chartOptions} />;
      default:
        return <Bar data={chartData} options={chartOptions} />;
    }
  };

  return (
    <div>
      <label className="mr-2">Select Chart Type:</label>
      <select
        value={chartType}
        onChange={(e) => setChartType(e.target.value)}
        className="border rounded p-2 bg-white text-black"
      >
        <option value="doughnut">Doughnut Chart</option>
        <option value="bar">Bar Chart</option>
        <option value="pie">Pie Chart</option>
        <option value="line">Line Chart</option>
      </select>
      <div className="flex items-center justify-center h-[480px] mt-4">
        {renderChart()}
      </div>
    </div>
  );
};

export default Charts;
