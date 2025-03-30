import React, { useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

const BarChart = () => {
  const barRef = useRef(null);

  // Monthly Expenses Bar Chart Data
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Expenses ($)",
        data: [2100, 2200, 2300, 2000, 2500, 2400],
        backgroundColor: "#36A2EB",
      },
    ],
  };

  // Bar chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          },
          color: '#fff'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (barRef.current) {
        barRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="chart-container">
      <h3>Monthly Expenses</h3>
      <div style={{ height: "300px" }}>
        <Bar ref={barRef} data={barData} options={barOptions} />
      </div>
    </div>
  );
};

export default BarChart;