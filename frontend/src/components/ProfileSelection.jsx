import React from 'react';
import './ProfileSelection.css';

const ProfileSelection = ({ onProfileSelect }) => {
  // Generate random gradient for each profile button
  const generateRandomGradient = () => {
    const randomColor1 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const randomColor2 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return `linear-gradient(145deg, ${randomColor1}, ${randomColor2})`;
  };

  // This array would later be populated from your SQL database
  // CHANGE THIS PART LATER: Replace with data from your SQL query
  const profiles = [
    { id: 1, name: 'Anupam' },
    { id: 2, name: 'Ayush' },
    { id: 3, name: 'Nathan' },
    { id: 4, name: 'Emily' },
    { id: 5, name: 'Michael' }
  ];

  return (
    <div className="profile-selection-container">
      <div className="content">
        <h1 className="welcome">Welcome to FamilyFund!</h1>
        <h2 className="description">Who's Budgeting?</h2>
        
        <div className="profiles-grid">
          {/* Render profile buttons using map with random gradients */}
          {profiles.map((profile) => (
            <button 
              key={profile.id}
              className="profile-button"
              style={{ background: generateRandomGradient() }}
              onClick={() => onProfileSelect(profile.name)}
            >
              {profile.name}
            </button>
          ))}
          
          {/* Add Profile button */}
          <button 
            className="profile-button add-profile"
            style={{ background: generateRandomGradient() }}
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