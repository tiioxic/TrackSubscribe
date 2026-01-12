import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PiggyBank, Euro, Bitcoin, DollarSign } from 'lucide-react';

const PiggyBankAnim = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="piggy-spacer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="orbit-system">
                {/* Central Piggy */}
                <div className="center-pig">
                    <motion.div
                        animate={{
                            scale: isHovered ? 1.1 : 1,
                            filter: isHovered ? 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.5))' : 'drop-shadow(0 0 0px rgba(59, 130, 246, 0))'
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <PiggyBank size={48} strokeWidth={1.5} className="piggy-icon" />
                    </motion.div>
                </div>

                {/* Orbit Ring visual */}
                <motion.div
                    className="orbit-ring"
                    animate={{
                        scale: isHovered ? 1.1 : 1,
                        borderColor: isHovered ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'
                    }}
                />

                {/* Rotating Wrapper for Icons */}
                <motion.div
                    className="icons-wrapper"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: isHovered ? 5 : 15, // Speed up on hover
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {/* Euro - Top (0deg) */}
                    <div className="orbit-item item-euro">
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: isHovered ? 5 : 15, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="icon-bubble">
                                <Euro size={14} color="#fbbf24" strokeWidth={2.5} />
                            </div>
                        </motion.div>
                    </div>

                    {/* Dollar - Bottom Right (120deg) */}
                    <div className="orbit-item item-dollar">
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: isHovered ? 5 : 15, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="icon-bubble">
                                <DollarSign size={14} color="#10B981" strokeWidth={2.5} />
                            </div>
                        </motion.div>
                    </div>

                    {/* Bitcoin - Bottom Left (240deg) */}
                    <div className="orbit-item item-btc">
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: isHovered ? 5 : 15, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="icon-bubble">
                                <Bitcoin size={14} color="#F59E0B" strokeWidth={2.5} />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            <div className="piggy-text">
                <span className="save-text">Économisons !</span>
            </div>

            <style>{`
        .piggy-spacer {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center; /* Center vertically in the empty space */
            min-height: 180px;
            cursor: pointer;
            overflow: hidden;
        }

        .orbit-system {
            position: relative;
            width: 120px;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;
        }

        .center-pig {
            z-index: 10;
            position: relative;
        }

        .piggy-icon {
            color: var(--text-primary);
            transition: color 0.3s;
        }

        .piggy-spacer:hover .piggy-icon {
            color: var(--accent-primary);
        }

        .orbit-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 1px dashed rgba(255, 255, 255, 0.05);
            pointer-events: none;
        }

        .icons-wrapper {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }

        .orbit-item {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 28px;
            height: 28px;
            margin-left: -14px; /* Center offset */
            margin-top: -14px;
        }

        /* Positioning on the circle (Radius ~50px) */
        /* translateY moves it OUT from the center to the ring edge */
        .item-euro {
            transform: rotate(0deg) translateY(-50px);
        }
        
        .item-dollar {
            transform: rotate(120deg) translateY(-50px);
        }

        .item-btc {
            transform: rotate(240deg) translateY(-50px);
        }

        .icon-bubble {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-subtle);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            transition: all 0.3s;
        }

        .piggy-spacer:hover .icon-bubble {
            border-color: var(--accent-primary);
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
            background: var(--bg-secondary);
        }

        .save-text {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-secondary);
            opacity: 0.6;
            transition: opacity 0.3s, color 0.3s;
        }

        .piggy-spacer:hover .save-text {
            opacity: 1;
            color: var(--accent-primary);
        }
      `}</style>
        </div>
    );
};

export default PiggyBankAnim;
