import React, { useState, useEffect, useMemo } from 'react';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

// Predefined color palette for the first 5 categories (including the 2 predefined categories :) 
const palette = ['#F1E3F3', '#C2BBF0', '#F699BB', '#62BFED', '#3590F3'];

// generate random colors for the rest after 5
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Utility function to map categories to colors from the palette
const mapCategoryColors = (categories) => {
  const categoryColors = {};
  categories.forEach((category, index) => {
    // Use palette for the first 5 categories, random colors for the rest (keep it on theme!!!!)
    categoryColors[category] = index < palette.length 
      ? palette[index] 
      : generateRandomColor();
  });
  return categoryColors;
};

const Charts = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(['Direct Payment', 'Deposit']);
  const [chartType, setChartType] = useState('bar');

  const categoryColors = useMemo(() => mapCategoryColors(categories), [categories]);
  const activeCategories = categories.filter((category) =>
    transactions.some((t) => t.type === category)
  );

  const categoryData = activeCategories.map((category) => {
    const totalAmount = transactions
    .filter((t) => t.type === category)
    .reduce((sum, t) => sum + t.amount, 0);
  return totalAmount;
});

const chartData = {
  labels: activeCategories,
  datasets: [
    {
      data: categoryData,
      backgroundColor: activeCategories.map(
        (category) => categoryColors[category]
      ),
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
          {/* Chart Section */}
      <label className="mr-2">Select Chart Type:</label>
      <select
        value={chartType}
        onChange={(e) => setChartType(e.target.value)}
        className="border rounded p-2 bg-white text-black"
      >
        <option value="bar">Bar Chart</option>
        <option value="pie">Pie Chart</option>
        <option value="line">Line Chart</option>
        <option value="doughnut">Doughnut Chart</option>
      </select>
      <div className="mt-4">{renderChart()}</div>
    </div>
);
};

export default Charts;