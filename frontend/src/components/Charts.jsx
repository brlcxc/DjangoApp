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
  const [chartType, setChartType] = useState('bar');

  // Extract categories from transaction data
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(transactions.map((t) => t.type))];
    return uniqueCategories.length > 0 ? uniqueCategories : ['Direct Payment', 'Deposit'];
  }, [transactions]);

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
