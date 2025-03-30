import React, { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import chipImg from "../assets/chip.png";
import amexCenturion from "../assets/amex-centurion.png";
import amexLogo from "../assets/amex-logo.png";
import "../styles/CreditCard.css";

const CreditCard = ({ profileName }) => {
  const balance = "09/27";
  const creditCardNumber = "" + Math.floor(1000 + Math.random() * 9000);

  // Motion values for mouse tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transform the x and y motion values into rotation angles
  const rotateX = useTransform(y, [-50, 50], [15, -15], { damping: 20 });
  const rotateY = useTransform(x, [-50, 50], [-15, 15], { damping: 20 });

  const cardRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!cardRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    
    // Calculate x and y positions relative to the card center
    const xPos = (event.clientX - left - width / 2) / (width / 2);
    const yPos = (event.clientY - top - height / 2) / (height / 2);

    x.set(xPos * 50); // Scale to motion value range
    y.set(yPos * 50);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="credit-card"
      style={{
        rotateX, // Apply tilt effect on X-axis
        rotateY, // Apply tilt effect on Y-axis
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top Section */}
      <div className="top">
        <img src={amexLogo} alt="Card Logo" className="card-logo" />
      </div>

      {/* Center Section */}
      <div className="center">
        <div className="left">
          <img src={chipImg} alt="Card Chip" className="card-chip" />
        </div>
        <div className="center-logo">
          <img
            src={amexCenturion}
            alt="Amex Centurion"
            className="amex-centurion"
          />
        </div>
        <div className="right">
          <h3>{creditCardNumber}</h3>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom">
        <div className="left">
          <h3>{profileName.toUpperCase()}</h3>
        </div>
        <div className="right">
          <h2 className="card-balance">{balance}</h2>
        </div>
      </div>
    </motion.div>
  );
};

export default CreditCard;
