import React, { useRef, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";

const PieChart = () => {
  const pieRef = useRef(null);
  
  // Expense categories data
  const expenseData = [
    { category: "Rent", amount: 1200, color: "#FF6384" },
    { category: "Food", amount: 600, color: "#36A2EB" },
    { category: "Transport", amount: 300, color: "#FFCE56" },
    { category: "Entertainment", amount: 250, color: "#4CAF50" },
    { category: "Savings", amount: 500, color: "#9C27B0" }
  ];
  
  // Calculate total
  const total = expenseData.reduce((sum, item) => sum + item.amount, 0);
  
  // Prepare data for Chart.js
  const pieData = {
    labels: expenseData.map(item => item.category),
    datasets: [
      {
        data: expenseData.map(item => item.amount),
        backgroundColor: expenseData.map(item => item.color),
        borderWidth: 1,
        borderColor: '#242424'
      },
    ],
  };

  // Pie chart options - simplified without legend since we're using custom legend
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide default legend as we're using custom one
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw || 0;
            const percentage = Math.round((value / total) * 100);
            return `$${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pieRef.current) {
        pieRef.current.destroy();
      }
    };
  }, []);

  // Custom legend component
  const Legend = () => (
    <div className="pie-legend">
      <h3>Expense Breakdown</h3>
      <ul>
        {expenseData.map((item, index) => (
          <li key={index}>
            <span 
              className="legend-color" 
              style={{backgroundColor: item.color}}
            ></span>
            <span>{item.category}: ${item.amount} ({Math.round((item.amount / total) * 100)}%)</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="pie-chart-section">
      <Legend />
      <div className="pie-chart-wrapper">
        <Pie ref={pieRef} data={pieData} options={pieOptions} />
      </div>
    </div>
  );
};

export default PieChart;