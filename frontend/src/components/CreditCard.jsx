import React from "react";
import { motion } from "framer-motion";
import chipImg from "../assets/chip.png";
import amexCenturion from "../assets/amex-centurion.png";
import amexLogo from "../assets/amex-logo.png";
import "../styles/CreditCard.css";

const CreditCard = ({ profileName }) => {
  const balance = 4520.75;
  const creditCardNumber = "" + Math.floor(1000 + Math.random() * 9000);

  return (
    <motion.div
      className="credit-card"
      whileHover={{ scale: 1.05, rotateY: 10 }} // 3D tilt effect
      transition={{ duration: 0.3 }}
    >
      {/* Top Section */}
      <div className="top">
        {/* <h3 className="card-type">AMERICAN EXPRESS</h3> */}
        <img src={amexLogo} alt="Card Lego" className="card-logo" />
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
          <h2 className="card-balance">${balance.toFixed(2)}</h2>
        </div>
      </div>
    </motion.div>
  );
};

export default CreditCard;