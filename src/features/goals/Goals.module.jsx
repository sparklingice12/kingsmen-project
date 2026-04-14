/**
 * Goals Module
 * 
 * Displays achievement goals and progress in a modal
 */

import React from 'react';
import { useStore } from '@/state/store';
import { motion, AnimatePresence } from 'framer-motion';
import { GOALS } from './goals.config';
import { getGoalsWithProgress } from './goals.service';
import './Goals.css';

/**
 * Goals Modal Component
 * 
 * Shows all goals with progress bars and completion status
 */
function Goals() {
    const modalOpen = useStore((s) => s.ui.modalOpen);
    const closeGameModal = useStore((s) => s.ui.closeGameModal);
    const pauseGame = useStore((s) => s.game.pauseGame);
    const resumeGame = useStore((s) => s.game.resumeGame);
    const goals = useStore((s) => s.session.goals);
    const gameState = useStore();

    // Pause game when modal is open
    React.useEffect(() => {
        if (modalOpen === 'goals') {
            pauseGame();
        } else {
            resumeGame();
        }
    }, [modalOpen, pauseGame, resumeGame]);

    // Handle backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeGameModal();
        }
    };

    // Handle close button
    const handleClose = () => {
        closeGameModal();
    };

    if (modalOpen !== 'goals') {
        return null;
    }

    // Get goals with current progress
    const goalsWithProgress = getGoalsWithProgress(goals, gameState);

    // Group goals by category
    const goalsByCategory = {
        sustainability: goalsWithProgress.filter(g => g.category === 'sustainability'),
        farming: goalsWithProgress.filter(g => g.category === 'farming'),
        learning: goalsWithProgress.filter(g => g.category === 'learning'),
    };

    // Calculate overall completion
    const completedCount = goalsWithProgress.filter(g => g.completed).length;
    const totalCount = goalsWithProgress.length;
    const overallPercentage = Math.round((completedCount / totalCount) * 100);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="goals__backdrop"
                onClick={handleBackdropClick}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="goals__container"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        className="goals__close"
                        onClick={handleClose}
                        aria-label="Close Goals"
                    >
                        ✕
                    </button>

                    {/* Header */}
                    <div className="goals__header">
                        <h1 className="goals__title">
                            🏆 Achievement Goals
                        </h1>
                        <p className="goals__subtitle">
                            Complete goals to earn badges and rewards
                        </p>
                        <div className="goals__overall-progress">
                            <div className="goals__overall-stats">
                                <span className="goals__overall-count">
                                    {completedCount}/{totalCount} Goals Completed
                                </span>
                                <span className="goals__overall-percentage">
                                    {overallPercentage}%
                                </span>
                            </div>
                            <div className="goals__overall-bar">
                                <div
                                    className="goals__overall-fill"
                                    style={{ width: `${overallPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Goals Content */}
                    <div className="goals__content">
                        {/* Sustainability Goals */}
                        {goalsByCategory.sustainability.length > 0 && (
                            <div className="goals__category">
                                <h2 className="goals__category-title">♻️ Sustainability</h2>
                                <div className="goals__list">
                                    {goalsByCategory.sustainability.map(goal => (
                                        <GoalCard key={goal.id} goal={goal} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Farming Goals */}
                        {goalsByCategory.farming.length > 0 && (
                            <div className="goals__category">
                                <h2 className="goals__category-title">🌾 Farming</h2>
                                <div className="goals__list">
                                    {goalsByCategory.farming.map(goal => (
                                        <GoalCard key={goal.id} goal={goal} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Learning Goals */}
                        {goalsByCategory.learning.length > 0 && (
                            <div className="goals__category">
                                <h2 className="goals__category-title">📚 Learning</h2>
                                <div className="goals__list">
                                    {goalsByCategory.learning.map(goal => (
                                        <GoalCard key={goal.id} goal={goal} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * Goal Card Component
 * 
 * Displays individual goal with progress
 */
function GoalCard({ goal }) {
    const { icon, title, description, progress, target, completed, progressPercentage, reward } = goal;

    return (
        <motion.div
            className={`goals__card ${completed ? 'completed' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="goals__card-header">
                <span className="goals__card-icon">{icon}</span>
                <div className="goals__card-info">
                    <h3 className="goals__card-title">
                        {title}
                        {completed && <span className="goals__card-badge">✓</span>}
                    </h3>
                    <p className="goals__card-description">{description}</p>
                </div>
            </div>

            <div className="goals__card-progress">
                <div className="goals__progress-header">
                    <span className="goals__progress-text">
                        {progress}/{target}
                    </span>
                    <span className="goals__progress-percentage">
                        {progressPercentage}%
                    </span>
                </div>
                <div className="goals__progress-bar">
                    <motion.div
                        className="goals__progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {completed && (
                <div className="goals__card-reward">
                    <span className="goals__reward-icon">🎁</span>
                    <span className="goals__reward-text">{reward}</span>
                </div>
            )}
        </motion.div>
    );
}

export default Goals;
