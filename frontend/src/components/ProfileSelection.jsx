// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import '../styles/ProfileSelection.css';

// const ProfileSelection = ({ onProfileSelect }) => {
//   const location = useLocation();
//   const receivedData = location.state;
//   const navigate = useNavigate();
//   const [profiles, setProfiles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Generate random gradient for each profile button
//   const generateRandomGradient = () => {
//     const randomColor1 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
//     const randomColor2 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
//     return `linear-gradient(145deg, ${randomColor1}, ${randomColor2})`;
//   };

//   // Handle profile selection
//   const handleProfileSelect = (profileId, profileName) => {
//     if (profileId === 'new') {
//       // Navigate to registration form if user clicks the "+" button
//       navigate('/register');
//     } else {
//       // Handle existing profile selection
//       console.log(`Selected profile: ${profileId}`);
//       // If you have an onProfileSelect prop, use it
//       // if (onProfileSelect) {
//       //   onProfileSelect(profileId);
//       // }

//       navigate('/budget-planning', {
//         state: {
//           profileId: profileId,
//           profileName: profileName,
//           // You can pass any additional data needed by the BudgetPlanning component
//           familyId: receivedData
//         }
//       });
//     }
//   };

//   // Fetch profiles from the API
//   useEffect(() => {
//     const fetchProfiles = async () => {
//       try {
//         const response = await fetch(`http://localhost:5001/api/profiles/${receivedData}`);
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         setProfiles(data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching profiles:", err);
//         setError('Failed to load profiles');
//         setLoading(false);
//       }
//     };

//     fetchProfiles();
//   }, [receivedData]);

//   if (loading) return <div className="loading">Loading profiles...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="profile-selection-container">
//       <div className="content">
//         <h1 className="welcome">Welcome to FamilyFund!</h1>
//         <h2 className="description">Who's Budgeting?</h2>
        
//         <div className="profiles-grid">
//           {/* Render profile buttons using map with random gradients */}
//           {profiles.map((profile) => (
//             <button 
//               key={profile.id}
//               className="profile-button"
//               style={{ background: generateRandomGradient() }}
//               onClick={() => handleProfileSelect(profile.id, profile.name)}
//             >
//               {profile.name}
//             </button>
//           ))}
          
//           {/* Add Profile button */}
//           <button 
//             className="profile-button add-profile"
//             style={{ background: generateRandomGradient() }}
//             onClick={() => handleProfileSelect('new')}
//           >
//             +
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileSelection;


import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import '../styles/ProfileSelection.css';

const ProfileSelection = ({ onProfileSelect }) => {
  const location = useLocation();
  const receivedData = location.state;
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [splineLoading, setSplineLoading] = useState(true);

  // Generate random gradient for each profile button
  const generateRandomGradient = () => {
    const randomColor1 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const randomColor2 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return `linear-gradient(145deg, ${randomColor1}, ${randomColor2})`;
  };

  // Handle profile selection
  const handleProfileSelect = (profileId, profileName) => {
    if (profileId === 'new') {
      // Navigate to registration form if user clicks the "+" button
      navigate('/register');
    } else {
      // Handle existing profile selection
      console.log(`Selected profile: ${profileId}`);
      // If you have an onProfileSelect prop, use it
      // if (onProfileSelect) {
      //   onProfileSelect(profileId);
      // }

      navigate('/budget-planning', {
        state: {
          profileId: profileId,
          profileName: profileName,
          // You can pass any additional data needed by the BudgetPlanning component
          familyId: receivedData
        }
      });
    }
  };

  // Handle when Spline scene is loaded
  const handleSplineLoad = () => {
    setSplineLoading(false);
  };

  // Fetch profiles from the API
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/profiles/${receivedData}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProfiles(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profiles:", err);
        setError('Failed to load profiles');
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [receivedData]);

  if (loading) return <div className="loading">Loading profiles...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-selection-container">
      {/* Spline background */}
      <div className="spline-background">
        {splineLoading && <div className="spline-loading">Loading 3D scene...</div>}
        <Spline 
          scene="https://prod.spline.design/0hJE38e5IrdN4j3k/scene.splinecode"
          onLoad={handleSplineLoad}
        />
      </div>
      
      {/* Content overlay */}
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
              onClick={() => handleProfileSelect(profile.id, profile.name)}
            >
              {profile.name}
            </button>
          ))}
          
          {/* Add Profile button */}
          <button 
            className="profile-button add-profile"
            style={{ background: generateRandomGradient() }}
            onClick={() => handleProfileSelect('new')}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSelection;