/**
 * Quest Panel Component
 * 
 * Displays active quests, progress, and rewards
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useQuests } from './useQuests';
import { getRewardDescription } from './quests.service';
import './QuestPanel.css';

export default function QuestPanel({ isOpen, onClose }) {
    const {
        activeQuests,
        completedQuests,
        incompleteQuests,
        currentQuest,
        selectQuest,
        progressPercentage,
    } = useQuests();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="quest-panel-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="quest-panel"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="quest-panel__header">
                        <h2 className="quest-panel__title">Quests</h2>
                        <button
                            className="quest-panel__close"
                            onClick={onClose}
                            aria-label="Close quest panel"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Overall Progress */}
                    <div className="quest-panel__progress">
                        <div className="quest-panel__progress-text">
                            {completedQuests.length} / {activeQuests.length} Completed
                        </div>
                        <div className="quest-panel__progress-bar">
                            <motion.div
                                className="quest-panel__progress-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    {/* Quest List */}
                    <div className="quest-panel__list">
                        {/* Incomplete Quests */}
                        {incompleteQuests.length > 0 && (
                            <div className="quest-panel__section">
                                <h3 className="quest-panel__section-title">Active Quests</h3>
                                {incompleteQuests.map((quest) => (
                                    <QuestCard
                                        key={quest.id}
                                        quest={quest}
                                        isActive={currentQuest?.id === quest.id}
                                        onClick={() => selectQuest(quest.id)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Completed Quests */}
                        {completedQuests.length > 0 && (
                            <div className="quest-panel__section">
                                <h3 className="quest-panel__section-title">Completed</h3>
                                {completedQuests.map((quest) => (
                                    <QuestCard
                                        key={quest.id}
                                        quest={quest}
                                        isCompleted
                                    />
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {activeQuests.length === 0 && (
                            <div className="quest-panel__empty">
                                <p>No quests available yet.</p>
                                <p>Start farming to unlock quests!</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * Individual Quest Card Component
 */
function QuestCard({ quest, isActive, isCompleted, onClick }) {
    const progressPercentage = (quest.current / quest.target) * 100;
    const rewardText = getRewardDescription(quest.reward);

    return (
        <motion.div
            className={`quest-card ${isActive ? 'quest-card--active' : ''} ${isCompleted ? 'quest-card--completed' : ''}`}
            onClick={onClick}
            whileHover={!isCompleted ? { scale: 1.02 } : {}}
            whileTap={!isCompleted ? { scale: 0.98 } : {}}
        >
            {/* Quest Icon/Status */}
            <div className="quest-card__icon">
                {isCompleted ? '✓' : getQuestIcon(quest.type)}
            </div>

            {/* Quest Content */}
            <div className="quest-card__content">
                <h4 className="quest-card__title">{quest.title}</h4>
                <p className="quest-card__description">{quest.description}</p>

                {/* Progress Bar */}
                {!isCompleted && (
                    <div className="quest-card__progress">
                        <div className="quest-card__progress-text">
                            {quest.current} / {quest.target}
                        </div>
                        <div className="quest-card__progress-bar">
                            <motion.div
                                className="quest-card__progress-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                )}

                {/* Reward */}
                <div className="quest-card__reward">
                    <span className="quest-card__reward-label">Reward:</span>
                    <span className="quest-card__reward-value">{rewardText}</span>
                </div>
            </div>
        </motion.div>
    );
}

/**
 * Get icon for quest type
 */
function getQuestIcon(type) {
    const icons = {
        plant: '🌱',
        harvest: '🌾',
        diversity: '🌈',
        sustainability: '♻️',
    };
    return icons[type] || '📋';
}
