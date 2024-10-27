import React, { useMemo, useState } from 'react';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import 'tailwindcss/tailwind.css'; // Make sure Tailwind CSS is properly imported :)
ChartJS.register(...registerables);

// Define color names as available in Tailwind CSS
const colorNames = [
  'pale-purple',
  'periwinkle',
  'amaranth-pink',
  'deep-sky-blue',
  'dodger-blue',
];

// Utility function to map categories to Tailwind CSS color classes
const mapCategoryColors = (categories) => {
  const categoryColors = {};
  categories.forEach((category, index) => {
    // Use Tailwind CSS color names if within range, else fallback to random colors
    categoryColors[category] =
      index < colorNames.length ? colorNames[index] : generateRandomColor();
  });
  return categoryColors;
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

const Charts = ({ transactions }) => {
  const validTransactions = Array.isArray(transactions) ? transactions : [];
  const [chartType, setChartType] = useState('bar');

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(validTransactions.map((t) => t.category || 'Uncategorized')),
    ];
    return uniqueCategories.length > 0
      ? uniqueCategories
      : ['Direct Payment', 'Deposit'];
  }, [validTransactions]);

  const categoryColors = useMemo(() => mapCategoryColors(categories), [
    categories,
  ]);

  const activeCategories = categories.filter((category) =>
    validTransactions.some((t) => t.category === category)
  );

  const categoryData = activeCategories.map((category) => {
    const totalAmount = validTransactions
      .filter((t) => t.category === category)
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    return totalAmount;
  });

  // Prepare the chart data
  const chartData = {
    labels: activeCategories,
    datasets: [
      {
        label: 'Total Amount per Category',
        data: categoryData,
        backgroundColor: activeCategories.map(
          (category) => `var(--tw-${categoryColors[category]})` // Use Tailwind CSS colors
        ),
        borderWidth: 1,
      },
    ],
  };

  // Chart options based on the type
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
