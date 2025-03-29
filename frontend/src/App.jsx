import { useState } from 'react';
import './App.css';
import LogoAnimation from "./components/LogoAnimation"; // Import CSS file

function App() {
  const [showLogo, setShowLogo] = useState(true);
  const [fadeInContent, setFadeInContent] = useState(false);

  const handleAnimationComplete = () => {
      setShowLogo(false);
      setTimeout(() => setFadeInContent(true), 500); // Delay main content fade-in
  };

  return (
      <>
          {showLogo ? (
              <LogoAnimation onAnimationComplete={handleAnimationComplete} />
          ) : (
            <div>
              <div className={`main-content ${fadeInContent ? "fade-in" : ""}`}
                   style={{ backgroundColor: "#242424", textAlign: "center", padding: "20px" }}
              >
                <div className="content">
                  <h1 className="welcome">Welcome to FamilyBudget!</h1>
                  <h2 className="description">Who's Budgeting?</h2>
                  <button 
                    className="profile-button" 
                    onClick={() => alert('Profile button clicked!')}
                  >
                    Anupam
                  </button>
                  <button 
                    className="profile-button" 
                    onClick={() => alert('Profile button clicked!')}
                  >
                    Ayush
                  </button>
                  <button 
                    className="profile-button" 
                    onClick={() => alert('Profile button clicked!')}
                  >
                    Nathan
                  </button>
                  <button 
                    className="profile-button" 
                    onClick={() => alert('Profile button clicked!')}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
      </>
  );
}

export default App;