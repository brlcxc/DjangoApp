import React, { useMemo, useState } from 'react';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

// Predefined color palette for the first 5 categories
const palette = ['#F1E3F3', '#C2BBF0', '#F699BB', '#62BFED', '#3590F3'];

// Generate random colors for categories beyond the first 5
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
    // Use palette for the first 5 categories, random colors for the rest
    categoryColors[category] = index < palette.length 
      ? palette[index] 
      : generateRandomColor();
  });
  return categoryColors;
};

const Charts = ({ transactions }) => {
  // Check if transactions is an array, if not, default to an empty array
  const validTransactions = Array.isArray(transactions) ? transactions : [];

  // Debugging step: Check the type and content of transactions
  console.log('Transactions:', validTransactions);

  const [chartType, setChartType] = useState('bar');

  // Extract unique categories from transaction data or provide defaults if none exist
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(validTransactions.map((t) => t.category || 'Uncategorized'))];
    return uniqueCategories.length > 0 ? uniqueCategories : ['Direct Payment', 'Deposit'];
  }, [validTransactions]);

  // Map categories to colors
  const categoryColors = useMemo(() => mapCategoryColors(categories), [categories]);

  // Extract active categories and calculate total amounts for each
  const activeCategories = categories.filter((category) =>
    validTransactions.some((t) => t.category === category)
  );

  const categoryData = activeCategories.map((category) => {
    const totalAmount = validTransactions
      .filter((t) => t.category === category)
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0); // Fallback to 0 if amount is invalid
    return totalAmount;
  });

  // Prepare chart data
  const chartData = {
    labels: activeCategories,
    datasets: [
      {
        label: 'Total Amount per Category',
        data: categoryData,
        backgroundColor: activeCategories.map(
          (category) => categoryColors[category]
        ),
        borderWidth: 1,
      },
    ],
  };

  // Define chart options based on chart type
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

  // Render the selected chart type
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
      {/* Chart Type Selector */}
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
