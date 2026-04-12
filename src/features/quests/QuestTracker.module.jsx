/**
 * Quest Tracker Component
 * 
 * Compact quest display for the HUD showing current active quest
 */

import { motion } from 'framer-motion';
import { useQuests } from './useQuests';
import './QuestTracker.css';

export default function QuestTracker({ onOpenPanel }) {
    const { nextQuest, completedCount, totalQuests } = useQuests();

    if (!nextQuest) {
        return (
            <motion.div
                className="quest-tracker quest-tracker--all-complete"
                onClick={onOpenPanel}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="quest-tracker__icon">✓</div>
                <div className="quest-tracker__content">
                    <div className="quest-tracker__title">All Quests Complete!</div>
                    <div className="quest-tracker__progress">
                        {completedCount} / {totalQuests}
                    </div>
                </div>
            </motion.div>
        );
    }

    const progressPercentage = (nextQuest.current / nextQuest.target) * 100;

    return (
        <motion.div
            className="quest-tracker"
            onClick={onOpenPanel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Quest Icon */}
            <div className="quest-tracker__icon">
                {getQuestIcon(nextQuest.type)}
            </div>

            {/* Quest Content */}
            <div className="quest-tracker__content">
                <div className="quest-tracker__title">{nextQuest.title}</div>
                <div className="quest-tracker__progress">
                    {nextQuest.current} / {nextQuest.target}
                </div>

                {/* Progress Bar */}
                <div className="quest-tracker__bar">
                    <motion.div
                        className="quest-tracker__bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Click hint */}
            <div className="quest-tracker__hint">
                Click for details
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
