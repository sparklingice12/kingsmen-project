import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/state/store';
import './DayTransition.css';

/**
 * DayTransition Component
 * 
 * Displays a fade-to-black transition effect at the end of each day.
 * Shows "Day X" text during the transition.
 * 
 * Requirements: 1.5.3
 */
function DayTransition() {
    const currentDay = useStore((s) => s.game.currentDay);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [displayDay, setDisplayDay] = useState(currentDay);

    useEffect(() => {
        // When day changes, trigger transition
        if (currentDay > displayDay) {
            setIsTransitioning(true);

            // Update display day after fade out
            setTimeout(() => {
                setDisplayDay(currentDay);
            }, 500); // Half of transition duration

            // End transition after full duration
            setTimeout(() => {
                setIsTransitioning(false);
            }, 1500); // Total transition duration
        }
    }, [currentDay, displayDay]);

    return (
        <AnimatePresence>
            {isTransitioning && (
                <motion.div
                    className="day-transition"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="day-transition__content"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.2, opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h2 className="day-transition__title">Day {displayDay}</h2>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default DayTransition;
