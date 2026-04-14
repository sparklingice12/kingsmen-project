/**
 * Goal Completion Notification
 * 
 * Shows a celebration animation when a goal is completed
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Goal Completion Notification Component
 * 
 * Displays a celebratory notification when a goal is completed
 */
function GoalCompletionNotification({ goal, onClose }) {
    const [confetti, setConfetti] = useState([]);

    // Generate confetti particles
    useEffect(() => {
        const particles = [];
        for (let i = 0; i < 30; i++) {
            particles.push({
                id: i,
                x: Math.random() * 100,
                y: -10,
                rotation: Math.random() * 360,
                color: ['#b09060', '#c4a06a', '#e8d5b0', '#4ade80', '#22c55e'][Math.floor(Math.random() * 5)],
                delay: Math.random() * 0.3,
            });
        }
        setConfetti(particles);

        // Auto-close after 5 seconds
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!goal) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[2000] pointer-events-none">
                {/* Confetti */}
                {confetti.map((particle) => (
                    <motion.div
                        key={particle.id}
                        initial={{
                            x: `${particle.x}vw`,
                            y: '-10vh',
                            rotate: particle.rotation,
                            opacity: 1,
                        }}
                        animate={{
                            y: '110vh',
                            rotate: particle.rotation + 720,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 3,
                            delay: particle.delay,
                            ease: 'easeIn',
                        }}
                        style={{
                            position: 'absolute',
                            width: '10px',
                            height: '10px',
                            backgroundColor: particle.color,
                            borderRadius: '2px',
                        }}
                    />
                ))}

                {/* Notification Card */}
                <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-auto">
                    <motion.div
                        initial={{ scale: 0, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0, opacity: 0, y: -50 }}
                        transition={{
                            type: 'spring',
                            damping: 15,
                            stiffness: 200,
                        }}
                        className="relative max-w-md w-full"
                        style={{
                            background: 'linear-gradient(to bottom, #3a2518, #2e1e14)',
                            border: '3px solid #b09060',
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-all"
                            style={{
                                background: 'rgba(46, 30, 20, 0.9)',
                                border: '2px solid #b09060',
                                color: '#e8d5b0',
                            }}
                        >
                            ✕
                        </button>

                        {/* Content */}
                        <div className="text-center">
                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: 'spring',
                                    damping: 10,
                                    stiffness: 100,
                                    delay: 0.2,
                                }}
                                className="text-6xl mb-4"
                            >
                                {goal.icon}
                            </motion.div>

                            {/* Title */}
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl font-bold mb-2"
                                style={{ color: '#e8d5b0' }}
                            >
                                🎉 Goal Complete!
                            </motion.h2>

                            {/* Goal Title */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl font-semibold mb-3"
                                style={{ color: '#c4a06a' }}
                            >
                                {goal.title}
                            </motion.p>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-sm mb-4"
                                style={{ color: '#b09060' }}
                            >
                                {goal.description}
                            </motion.p>

                            {/* Reward */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6, type: 'spring' }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
                                style={{
                                    background: 'rgba(176, 144, 96, 0.2)',
                                    border: '2px solid rgba(176, 144, 96, 0.4)',
                                }}
                            >
                                <span className="text-2xl">🎁</span>
                                <span className="font-semibold" style={{ color: '#e8d5b0' }}>
                                    {goal.reward}
                                </span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
}

export default GoalCompletionNotification;
