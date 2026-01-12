import React from 'react';
import { motion } from 'motion/react';

const EnergyOrb = () => {
    return (
        <div className="orb-container">
            <div className="orb-wrapper">
                {/* Core Orb */}
                <motion.div
                    className="orb-core"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.8, 1, 0.8],
                        filter: ['blur(10px)', 'blur(15px)', 'blur(10px)']
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                {/* Outer Ring */}
                <motion.div
                    className="orb-ring"
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 180, 360],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>
            <div className="orb-text">
                <span>Budget Guardian</span>
            </div>

            <style>{`
        .orb-container {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            margin-bottom: 12px;
            overflow: hidden;
            border-radius: 16px;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .orb-wrapper {
            position: relative;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 8px;
        }

        .orb-core {
            position: absolute;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, var(--accent-primary), var(--accent-secondary));
            box-shadow: 0 0 20px var(--accent-primary);
            z-index: 2;
        }

        .orb-ring {
            position: absolute;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 2px solid var(--accent-secondary);
            border-top-color: transparent;
            border-bottom-color: transparent;
            z-index: 1;
        }

        .orb-text {
            font-size: 0.7rem;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: var(--text-secondary);
            font-weight: 500;
            opacity: 0.8;
        }
      `}</style>
        </div>
    );
};

export default EnergyOrb;
