import React from "react";

const LoansInfo = () => {
  // Sample loan data - in a real app, this would come from props or an API
  const loans = [
    { type: "Mortgage", amount: 1200, term: "30-year fixed" },
    { type: "Student Loan", amount: 400, term: "10-year fixed" },
    { type: "Car Loan", amount: 350, term: "5-year fixed" }
  ];

  // Calculate total monthly payments
  const totalMonthly = loans.reduce((total, loan) => total + loan.amount, 0);

  return (
    <div className="loans-info">
      <h3>Loans & Mortgage</h3>
      
      <div className="loans-summary">
        <div className="loan-total">
          <span className="label">Total Monthly Payments</span>
          <span className="amount">${totalMonthly}/month</span>
        </div>
      </div>
      
      <div className="loans-list">
        {loans.map((loan, index) => (
          <div key={index} className="loan-item">
            <div className="loan-type">{loan.type}</div>
            <div className="loan-details">
              <span className="loan-amount">${loan.amount}/month</span>
              <span className="loan-term">{loan.term}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoansInfo;