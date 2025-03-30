import React, { useRef, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

const BarChart = ({ profileId }) => {
  const barRef = useRef(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isParent, setIsParent] = useState(false);

  // Fetch profile and expense data
  useEffect(() => {
    const fetchMonthlyExpenses = async () => {
      setIsLoading(true);
      
      try {
        // First get the profile to check if they're an earner/parent
        const profileResponse = await fetch(`http://localhost:5001/api/profiles/${profileId}`);
        
        if (!profileResponse.ok) {
          throw new Error(`Failed to fetch profile: ${profileResponse.statusText}`);
        }
        
        const profileData = await profileResponse.json();
        console.log("Profile data:", profileData);
        
        // Check if the current profile is the earner
        const currentProfile = profileData.find(profile => profile.id === parseInt(profileId));
        const userIsParent = currentProfile && (currentProfile.is_earner === 1 || currentProfile.is_earner === true);
        
        console.log("Current profile:", currentProfile);
        console.log("Is parent/earner:", userIsParent);
        
        setIsParent(userIsParent);
        
        // Choose endpoint based on whether they're a parent or dependant
        const endpoint = userIsParent 
          ? `http://localhost:5001/api/family-monthly-expenses/${profileId}` 
          : `http://localhost:5001/api/monthly-expenses/${profileId}`;
          
        console.log("Fetching monthly expenses from:", endpoint);
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch monthly expense data: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Fetched monthly expense data:", data);
        
        // Group expenses by month
        const expensesByMonth = {};
        
        // Initialize with specific months (Nov to Mar)
        const monthNames = ["Nov", "Dec", "Jan", "Feb", "Mar"];
        const monthOffsets = [4, 3, 2, 1, 0]; // Counting back from current month
        const currentDate = new Date();

        monthOffsets.forEach((offset, index) => {
          const date = new Date();
          date.setMonth(currentDate.getMonth() - offset);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          expensesByMonth[monthKey] = { month: monthNames[index], total: 0 };
        });
        
        // Fill with actual data
        data.forEach(expense => {
          // Extract month from expense date
          const expenseDate = new Date(expense.due_date);
          const monthKey = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;
          
          // Only include if it's in our 5-month window
          if (expensesByMonth[monthKey]) {
            expensesByMonth[monthKey].total += parseFloat(expense.amount);
          }
        });
        
        // Convert to array format for the chart
        const formattedData = Object.values(expensesByMonth);
        console.log("Monthly expense data:", formattedData);
        
        setMonthlyData(formattedData);
      } catch (err) {
        console.error("Error fetching monthly data:", err);
        setError(err.message);
        
        // Fallback to sample data if there's an error
        setMonthlyData([
          { month: "Nov", total: 2100 },
          { month: "Dec", total: 2200 },
          { month: "Jan", total: 2300 },
          { month: "Feb", total: 2000 },
          { month: "Mar", total: 2500 }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (profileId) {
      fetchMonthlyExpenses();
    }
  }, [profileId]);
  
  // Prepare data for Chart.js
  const barData = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: isParent ? "Family Monthly Expenses ($)" : "Monthly Expenses ($)",
        data: monthlyData.map(item => item.total),
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

  if (isLoading) {
    return <div className="loading">Loading expense data...</div>;
  }
  
  if (error && monthlyData.length === 0) {
    return <div className="error">Error loading expense data: {error}</div>;
  }

  return (
    <div className="chart-container">
      <h3>{isParent ? "Family Monthly Expenses" : "Monthly Expenses"}</h3>
      <div style={{ height: "300px" }}>
        <Bar ref={barRef} data={barData} options={barOptions} />
      </div>
    </div>
  );
};

export default BarChart;