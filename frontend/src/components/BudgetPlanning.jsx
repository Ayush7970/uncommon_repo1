import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import CreditCard from "./CreditCard";
import LoansInfo from "./LoansInfo";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import "../styles/BudgetPlanning.css";

const BudgetPlanning = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profileId, profileName, familyId } = location.state || {};

  // Handle going back to profile selection
  const handleBackToProfiles = () => {
    navigate('/profiles', { state: familyId });
  };

  return (
    <div className="budget-container">
      {/* Header with back button */}
      <div className="budget-header">
        <h1>{profileName}'s Budget Dashboard</h1>
        <button className="back-button" onClick={handleBackToProfiles}>
          Back to Profiles
        </button>
      </div>
      
      {/* Top section: Credit Card and Pie Chart side by side */}
      <div className="top-section">
        <div className="card-wrapper">
          <CreditCard profileName={profileName || "User"} />
        </div>
        <PieChart />
      </div>
      
      {/* Bottom section: Loans and Bar Chart */}
      <div className="bottom-section">
        <div className="loans-section">
          <LoansInfo />
        </div>
        <div className="bar-chart-section">
          <BarChart />
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanning;