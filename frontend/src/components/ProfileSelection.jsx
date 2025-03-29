import React from 'react';
import './ProfileSelection.css';

const ProfileSelection = ({ onProfileSelect }) => {
  return (
    <div className="profile-selection-container">
      <div className="content">
        <h1 className="welcome">Welcome to FamilyBudget!</h1>
        <h2 className="description">Who's Budgeting?</h2>
        
        <div className="profiles-grid">
          <button 
            className="profile-button" 
            onClick={() => onProfileSelect('Anupam')}
          >
            Anupam
          </button>
          
          <button 
            className="profile-button" 
            onClick={() => onProfileSelect('Ayush')}
          >
            Ayush
          </button>
          
          <button 
            className="profile-button" 
            onClick={() => onProfileSelect('Nathan')}
          >
            Nathan
          </button>
          
          <button 
            className="profile-button add-profile" 
            onClick={() => onProfileSelect('new')}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSelection;