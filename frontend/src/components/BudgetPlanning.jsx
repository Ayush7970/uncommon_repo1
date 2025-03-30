import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CreditCard from "./CreditCard";
import LoansInfo from "./LoansInfo";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import Spline from '@splinetool/react-spline';
import "../styles/BudgetPlanning.css";

const BudgetPlanning = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profileId, profileName, familyId } = location.state || {};
  const [splineLoading, setSplineLoading] = useState(true);

  // Handle going back to profile selection
  const handleBackToProfiles = () => {
    navigate('/profiles', { state: familyId });
  };

  // Handle going back to graphic view
  const handleBackToGraphicView = () => {
    navigate('/graphic-view', { state: { profileId, profileName, familyId } }); //only if profileId is the same as familyId then we give cummulative data
  };

  const handleSplineLoad = () => {
    setSplineLoading(false);
  };
  
  return (
    <div className="budget-container">
      <div className="spline-background">
        {splineLoading && <div className="spline-loading">Loading 3D scene...</div>}
        <Spline 
          scene="https://prod.spline.design/QQX4SAqTgPONyiR3/scene.splinecode"
          onLoad={handleSplineLoad}
        />
      </div>
      {/* Header with back button */}
      <div className="budget-header">
        <h1>{profileName}'s Budget Dashboard</h1>
        <div className="header-buttons">
          <button className="graphic-view-button" onClick={handleBackToGraphicView}>
            Go to Graphic View
          </button>
          <button className="back-button" onClick={handleBackToProfiles}>
            Back to Profiles
          </button>
        </div>
      </div>
      
      {/* Top section: Credit Card and Pie Chart side by side */}
      <div className="top-section">
        <div className="card-wrapper">
          <CreditCard profileName={profileName || "User"} />
        </div>
        <div className="pie-chart-section">
          <PieChart profileId={profileId}/>
        </div>
      </div>
      
      {/* Bottom section: Loans and Bar Chart */}
      <div className="bottom-section">
        <div className="loans-section">
          <LoansInfo profileId={profileId}/>
        </div>
        <div className="bar-chart-section">
          <BarChart profileId={profileId}/>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanning;