import { useState } from 'react';
import './App.css';
import LogoAnimation from "./components/LogoAnimation";
import ProfileSelection from "./components/ProfileSelection";

function App() {
  const [showLogo, setShowLogo] = useState(true);
  const [fadeInContent, setFadeInContent] = useState(false);

  const handleAnimationComplete = () => {
    setShowLogo(false);
    setTimeout(() => setFadeInContent(true), 500); // Delay main content fade-in
  };

  const handleProfileSelect = (profileName) => {
    if (profileName === 'new') {
      // Handle creating a new profile
      console.log('Creating new profile');
    } else {
      // Handle selecting an existing profile
      console.log(`Selected profile: ${profileName}`);
    }
  };

  return (
    <>
      {showLogo ? (
        <LogoAnimation onAnimationComplete={handleAnimationComplete} />
      ) : (
        <div className={`main-content ${fadeInContent ? "fade-in" : ""}`}>
          <ProfileSelection onProfileSelect={handleProfileSelect} />
        </div>
      )}
    </>
  );
}

export default App;