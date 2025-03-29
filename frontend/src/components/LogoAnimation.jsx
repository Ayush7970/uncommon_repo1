import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import "../styles/LogoAnimation.css";

const LogoAnimation = ({ onAnimationComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Start fade-out after 1.5s (same duration as fade-in)
        setTimeout(() => setIsVisible(false), 1500);

        // Complete animation after 3s (including fade-out time)
        setTimeout(() => onAnimationComplete(), 3000);
    }, [onAnimationComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="logo-container"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                    <img src="/netflix.png" alt="Logo" className="logo" />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LogoAnimation;
