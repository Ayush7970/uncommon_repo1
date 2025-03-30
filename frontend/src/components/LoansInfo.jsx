// import React from "react";

// const LoansInfo = () => {
//   // Sample loan data - in a real app, this would come from props or an API
//   const loans = [
//     { type: "Mortgage", amount: 1200, term: "30-year fixed" },
//     { type: "Student Loan", amount: 400, term: "10-year fixed" },
//     { type: "Car Loan", amount: 350, term: "5-year fixed" }
//   ];

//   // Calculate total monthly payments
//   const totalMonthly = loans.reduce((total, loan) => total + loan.amount, 0);

//   return (
//     <div className="loans-info">
//       <h3>Loans & Mortgage</h3>
      
//       <div className="loans-summary">
//         <div className="loan-total">
//           <span className="label">Total Monthly Payments</span>
//           <span className="amount">${totalMonthly}/month</span>
//         </div>
//       </div>
      
//       <div className="loans-list">
//         {loans.map((loan, index) => (
//           <div key={index} className="loan-item">
//             <div className="loan-type">{loan.type}</div>
//             <div className="loan-details">
//               <span className="loan-amount">${loan.amount}/month</span>
//               <span className="loan-term">{loan.term}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LoansInfo;


import React, { useState, useEffect } from "react";

const LoansInfo = ({ profileId }) => {
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isParent, setIsParent] = useState(false);

  useEffect(() => {
    const fetchLoans = async () => {
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
        
        setIsParent(userIsParent);
        
        // Choose endpoint based on whether they're a parent or dependant
        const endpoint = userIsParent 
          ? `http://localhost:5001/api/family-loans/${profileId}` 
          : `http://localhost:5001/api/loans/${profileId}`;
          
        console.log("Fetching loans from:", endpoint);
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch loan data: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Fetched loan data:", data);
        
        // Filter for loan-type expenses and take top 3 by amount
        const loanTypes = ['Mortgage', 'Student Loan', 'Car Loan', 'Personal Loan', 'Credit Card'];
        const loanExpenses = data
          .filter(expense => loanTypes.includes(expense.expense_type))
          .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
          .slice(0, 3) // Get top 3 highest loans
          .map(loan => ({
            type: loan.expense_type,
            amount: parseFloat(loan.amount),
            term: "Monthly" // Since all expenses are monthly
          }));
        
        console.log("Processed loan data:", loanExpenses);
        setLoans(loanExpenses);
      } catch (err) {
        console.error("Error fetching loan data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (profileId) {
      fetchLoans();
    }
  }, [profileId]);
  
  // Calculate total monthly payments
  const totalMonthly = loans.reduce((total, loan) => total + loan.amount, 0);

  if (isLoading) {
    return <div className="loading">Loading loan data...</div>;
  }
  
  if (error) {
    return <div className="error">Error loading loan data: {error}</div>;
  }
  
  if (loans.length === 0) {
    return <div className="loans-info">
      <h3>{isParent ? "Family Loans & Mortgage" : "Loans & Mortgage"}</h3>
      <p>No loan expenses found</p>
    </div>;
  }

  return (
    <div className="loans-info">
      <h3>{isParent ? "Family Loans & Mortgage" : "Loans & Mortgage"}</h3>
      
      <div className="loans-summary">
        <div className="loan-total">
          <span className="label">Total Monthly Payments</span>
          <span className="amount">${totalMonthly.toFixed(2)}/month</span>
        </div>
      </div>
      
      <div className="loans-list">
        {loans.map((loan, index) => (
          <div key={index} className="loan-item">
            <div className="loan-type">{loan.type}</div>
            <div className="loan-details">
              <span className="loan-amount">${loan.amount.toFixed(2)}/month</span>
              <span className="loan-term">{loan.term}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoansInfo;