import React, { useEffect, useState } from 'react';
import './LogoAnimation.css'; // Import the CSS for animation

const LogoAnimation = ({ onAnimationComplete }) => {
  const [animationStage, setAnimationStage] = useState(1);

  useEffect(() => {
    // Stage 1: Initial display
    const stageOneTimer = setTimeout(() => {
      setAnimationStage(2); // Move to scaling animation
    }, 1000);

    // Stage 2: Scale and fade out
    const stageTwoTimer = setTimeout(() => {
      setAnimationStage(3); // Fade out
    }, 2500);

    // Stage 3: Complete the animation
    const stageThreeTimer = setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 3500);

    // Clean up timers
    return () => {
      clearTimeout(stageOneTimer);
      clearTimeout(stageTwoTimer);
      clearTimeout(stageThreeTimer);
    };
  }, [onAnimationComplete]);

  return (
    <div className="logo-animation-container">
      <div className={`logo-content stage-${animationStage}`}>
        <h1 className="logo-text">
          <span className="family">Family</span>
          <span className="fund">Fund</span>
        </h1>
      </div>
    </div>
  );
};

export default LogoAnimation;