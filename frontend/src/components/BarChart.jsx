// import React, { useState, useEffect, useRef } from "react";
// import { Pie } from "react-chartjs-2";
// import Chart from "chart.js/auto";

// const PieChart = ({ profileId, familyId }) => {
//   const pieRef = useRef(null);
//   const [expenseData, setExpenseData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Colors for the pie chart segments
//   const colorPalette = [
//     "#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0", 
//     "#FF9800", "#795548", "#607D8B", "#E91E63", "#2196F3"
//   ];
  
//   // Fetch expense data from the backend
//   useEffect(() => {
//     const fetchExpenseData = async () => {
//       setIsLoading(true);
//       try {
//         // Replace with your actual API endpoint
//         const response = await fetch(`http://localhost:5001/api/expenses/${profileId}`);
        
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch expense data: ${response.statusText}`);
//         }
        
//         const data = await response.json();

//         console.log("Fetched expense data:", data);
        
//         // Process and format the expense data
//         const formattedData = data.map((expense, index) => ({
//           category: expense.expense_type,
//           amount: parseFloat(expense.amount),
//           color: colorPalette[index % colorPalette.length]
//         }));
        
//         setExpenseData(formattedData);
//       } catch (err) {
//         console.error("Error fetching expense data:", err);

//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     if (profileId) {
//       fetchExpenseData();
//     }
//   }, [profileId]);
  
//   // Calculate total
//   const total = expenseData.reduce((sum, item) => sum + item.amount, 0);
  
//   // Prepare data for Chart.js
//   const pieData = {
//     labels: expenseData.map(item => item.category),
//     datasets: [
//       {
//         data: expenseData.map(item => item.amount),
//         backgroundColor: expenseData.map(item => item.color),
//         borderWidth: 1,
//         borderColor: '#242424'
//       },
//     ],
//   };

//   // Pie chart options
//   const pieOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false, // Hide default legend as we're using custom one
//       },
//       tooltip: {
//         callbacks: {
//           label: function(context) {
//             const value = context.raw || 0;
//             const percentage = Math.round((value / total) * 100);
//             return `$${value} (${percentage}%)`;
//           }
//         }
//       }
//     }
//   };

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (pieRef.current) {
//         pieRef.current.destroy();
//       }
//     };
//   }, []);

//   // Custom legend component
//   const Legend = () => (
//     <div className="pie-legend">
//       <h3>Expense Breakdown</h3>
//       {isLoading ? (
//         <p>Loading expense data...</p>
//       ) : error ? (
//         <p className="error-message">Error: {error}</p>
//       ) : expenseData.length === 0 ? (
//         <p>No expense data available</p>
//       ) : (
//         <ul>
//           {expenseData.map((item, index) => (
//             <li key={index}>
//               <span 
//                 className="legend-color" 
//                 style={{backgroundColor: item.color}}
//               ></span>
//               <span>
//                 {item.category}: ${item.amount.toFixed(2)} 
//                 ({Math.round((item.amount / total) * 100)}%)
//               </span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );

//   // Show loading or error states
//   if (isLoading) {
//     return <div className="loading">Loading expense data...</div>;
//   }
  
//   if (error) {
//     return <div className="error">Error loading expense data: {error}</div>;
//   }
  
//   if (expenseData.length === 0) {
//     return <div className="no-data">No expense data available</div>;
//   }

//   return (
//     <div className="pie-chart-section">
//       <Legend />
//       <div className="pie-chart-wrapper">
//         <Pie ref={pieRef} data={pieData} options={pieOptions} />
//       </div>
//     </div>
//   );
// };

// export default PieChart;

import React, { useState, useEffect, useRef } from "react";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";

const PieChart = ({ profileId, familyId }) => {
  const pieRef = useRef(null);
  const [expenseData, setExpenseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isParent, setIsParent] = useState(false);
  
  // Colors for the pie chart segments
  const colorPalette = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0", 
    "#FF9800", "#795548", "#607D8B", "#E91E63", "#2196F3"
  ];
  
  // Fetch expense data from the backend
  useEffect(() => {
    const fetchExpenseData = async () => {
      setIsLoading(true);
      
      // Determine if this is a parent profile
      const isParentUser = profileId === familyId;
  
      setIsParent(isParentUser);
      
      try {
        // Choose endpoint based on whether this is a parent or child
        const endpoint = isParentUser 
          ? `http://localhost:5001/api/family-expenses/${profileId}` 
          : `http://localhost:5001/api/expenses/${profileId}`;
          
        console.log("Fetching from:", endpoint);
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch expense data: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Fetched expense data:", data);
        
        if (data.length === 0) {
          setExpenseData([]);
          return;
        }
        
        // Group expenses by category
        const expensesByCategory = {};
        
        data.forEach(expense => {
          const category = expense.expense_type;
          const amount = parseFloat(expense.amount);
          
          if (expensesByCategory[category]) {
            expensesByCategory[category] += amount;
          } else {
            expensesByCategory[category] = amount;
          }
        });
        
        // Convert to array format for the chart
        const formattedData = Object.entries(expensesByCategory).map(([category, amount], index) => ({
          category,
          amount,
          color: colorPalette[index % colorPalette.length]
        }));
        
        // Sort by amount (largest first)
        formattedData.sort((a, b) => b.amount - a.amount);
        
        setExpenseData(formattedData);
      } catch (err) {
        console.error("Error fetching expense data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (profileId) {
      fetchExpenseData();
    }
  }, [profileId, familyId]);
  
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

  // Pie chart options
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
            return `$${value.toFixed(2)} (${percentage}%)`;
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
      <h3>{isParent ? "Family Expense Breakdown" : "Expense Breakdown"}</h3>
      {isLoading ? (
        <p>Loading expense data...</p>
      ) : error ? (
        <p className="error-message">Error: {error}</p>
      ) : expenseData.length === 0 ? (
        <p>No expense data available</p>
      ) : (
        <ul>
          {expenseData.map((item, index) => (
            <li key={index}>
              <span 
                className="legend-color" 
                style={{backgroundColor: item.color}}
              ></span>
              <span>
                {item.category}: ${item.amount.toFixed(2)} 
                ({Math.round((item.amount / total) * 100)}%)
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // Show loading or error states
  if (isLoading) {
    return <div className="loading">Loading expense data...</div>;
  }
  
  if (error) {
    return <div className="error">Error loading expense data: {error}</div>;
  }
  
  if (expenseData.length === 0) {
    return <div className="no-data">No expense data available</div>;
  }

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