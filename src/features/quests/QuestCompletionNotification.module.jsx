/**
 * Quest Completion Notification
 * 
 * Shows a minimalist notification when a quest is completed
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getRewardDescription } from './quests.service';
import './QuestCompletionNotification.css';

export default function QuestCompletionNotification({ quest, onClose }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Auto-close after 4 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!quest || !isVisible) return null;

    const rewardText = getRewardDescription(quest.reward);

    return (
        <AnimatePresence>
            <motion.div
                className="quest-completion"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                {/* Content */}
                <div className="quest-completion__content">
                    <div className="quest-completion__title">
                        Quest Complete
                    </div>

                    <div className="quest-completion__quest-name">
                        {quest.title}
                    </div>

                    <div className="quest-completion__reward">
                        <span className="quest-completion__reward-label">Reward:</span>
                        <span className="quest-completion__reward-value">{rewardText}</span>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    className="quest-completion__close"
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    aria-label="Close notification"
                >
                    ✕
                </button>
            </motion.div>
        </AnimatePresence>
    );
}
