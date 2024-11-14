import React, { useContext, useMemo, useState } from 'react';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { TransactionContext } from '../context/TransactionContext';
import { stringToSkewedPaletteColor } from './colorUtils';
ChartJS.register(...registerables);

// Utility function to map categories to colors
const mapCategoryColors = (categories) => {
  const categoryColors = {};
  categories.forEach((category, index) => {
    categoryColors[category] = stringToSkewedPaletteColor(category, 0.7);
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
    labels: activeCategories.length ? activeCategories : ['No Data'],
    datasets: [
      {
        label: 'Total Amount per Category',
        data: activeCategories.length ? categoryData : [0],
        backgroundColor: activeCategories.length 
          ? activeCategories.map((category) => categoryColors[category])
          : ['#D3D3D3'], // Grey color for placeholder
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
