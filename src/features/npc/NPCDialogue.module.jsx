import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/state/store';
import { useQuests } from '@/features/quests';
import { getRewardDescription } from '@/features/quests/quests.service';
import './NPCDialogue.css';

/**
 * NPCDialogue Module
 * 
 * Renders NPC dialogue as a React overlay with speech bubble design.
 * Features:
 * - Welcome message on session start
 * - Contextual hints for first-time actions
 * - Speech bubble UI with pixel art styling
 * - Shows active quest when NPC is tapped
 * 
 * Requirements: 2.4.2, 2.4.3, 2.4.6, 2.4.7
 */

// Dialogue content configuration
const DIALOGUE_CONTENT = {
    welcome: {
        title: '🌾 Welcome, Farmer!',
        message: 'I\'m Scarecrow, your guide! Plant crops, water them daily, and watch them grow. Tap me anytime for help!',
        type: 'welcome'
    },
    firstTill: {
        title: '🌾 First Steps',
        message: 'Great! You\'ve tilled the soil. Now select a seed and plant it on this tile.',
        type: 'hint'
    },
    firstPlant: {
        title: '🌱 Seeds in the Ground',
        message: 'Excellent! Your crop is planted. Remember to water it daily to help it grow faster.',
        type: 'hint'
    },
    firstWater: {
        title: '💧 Hydration Station',
        message: 'Perfect watering! Crops need water to grow. Keep them hydrated for faster growth.',
        type: 'hint'
    },
    firstHarvest: {
        title: '🌾 Harvest Time!',
        message: 'Wonderful! You\'ve harvested your first crop. Sell it for coins or use it for quests.',
        type: 'hint'
    },
    activeQuest: {
        title: '📋 Current Quest',
        message: 'Complete this quest to earn rewards and unlock Codex entries!',
        type: 'quest'
    }
};

function NPCDialogue() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentDialogue, setCurrentDialogue] = useState(null);
    const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
    const [firstActions, setFirstActions] = useState({
        tilled: false,
        planted: false,
        watered: false,
        harvested: false
    });

    const isPlaying = useStore((s) => s.game.isPlaying);
    const tiles = useStore((s) => s.farm.tiles);
    const npcDialogueOpen = useStore((s) => s.ui.npcDialogueOpen);
    const setNPCDialogueOpen = useStore((s) => s.ui.setNPCDialogueOpen);

    // Get quest information
    const { nextQuest, completedCount, totalQuests } = useQuests();

    // Show welcome message on session start
    useEffect(() => {
        if (isPlaying && !hasSeenWelcome) {
            setCurrentDialogue(DIALOGUE_CONTENT.welcome);
            setIsVisible(true);
            setHasSeenWelcome(true);

            // Auto-hide after 5 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isPlaying, hasSeenWelcome]);

    // Track first-time actions for contextual hints
    useEffect(() => {
        if (!isPlaying) return;

        // Check for first tilled tile
        const hasTilled = tiles.some(t => t.state === 'tilled');
        if (hasTilled && !firstActions.tilled) {
            setFirstActions(prev => ({ ...prev, tilled: true }));
            setCurrentDialogue(DIALOGUE_CONTENT.firstTill);
            setIsVisible(true);

            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 4000);

            return () => clearTimeout(timer);
        }

        // Check for first planted crop
        const hasPlanted = tiles.some(t => t.crop);
        if (hasPlanted && !firstActions.planted) {
            setFirstActions(prev => ({ ...prev, planted: true }));
            setCurrentDialogue(DIALOGUE_CONTENT.firstPlant);
            setIsVisible(true);

            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 4000);

            return () => clearTimeout(timer);
        }

        // Check for first watered crop
        const hasWatered = tiles.some(t => t.isWatered);
        if (hasWatered && !firstActions.watered) {
            setFirstActions(prev => ({ ...prev, watered: true }));
            setCurrentDialogue(DIALOGUE_CONTENT.firstWater);
            setIsVisible(true);

            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [tiles, isPlaying, firstActions]);

    // Handle NPC tap to show active quest
    useEffect(() => {
        if (npcDialogueOpen) {
            // Show quest information if available
            if (nextQuest) {
                const rewardText = getRewardDescription(nextQuest.reward);
                setCurrentDialogue({
                    title: `📋 ${nextQuest.title}`,
                    message: `${nextQuest.description}\n\nProgress: ${nextQuest.current} / ${nextQuest.target}\nReward: ${rewardText}`,
                    type: 'quest',
                    quest: nextQuest
                });
            } else if (completedCount === totalQuests && totalQuests > 0) {
                setCurrentDialogue({
                    title: '🎉 All Quests Complete!',
                    message: `Congratulations! You've completed all ${totalQuests} quests. Keep farming and exploring!`,
                    type: 'quest'
                });
            } else {
                setCurrentDialogue(DIALOGUE_CONTENT.activeQuest);
            }
            setIsVisible(true);
            setNPCDialogueOpen(false);
        }
    }, [npcDialogueOpen, setNPCDialogueOpen, nextQuest, completedCount, totalQuests]);

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && currentDialogue && (
                <motion.div
                    className="npc-dialogue-container"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    <div className="npc-dialogue-bubble">
                        {/* NPC Avatar */}
                        <div className="npc-avatar">
                            <span className="avatar-emoji">🌾</span>
                        </div>

                        {/* Dialogue Content */}
                        <div className="dialogue-content">
                            <h3 className="dialogue-title">{currentDialogue.title}</h3>
                            <p className="dialogue-message">{currentDialogue.message}</p>

                            {/* Quest Progress Bar (if quest type) */}
                            {currentDialogue.type === 'quest' && currentDialogue.quest && (
                                <div className="dialogue-quest-progress">
                                    <div className="dialogue-progress-bar">
                                        <motion.div
                                            className="dialogue-progress-fill"
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${(currentDialogue.quest.current / currentDialogue.quest.target) * 100}%`
                                            }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Close Button */}
                            <button
                                className="dialogue-close-btn"
                                onClick={handleClose}
                                aria-label="Close dialogue"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Speech Bubble Tail */}
                        <div className="speech-bubble-tail" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default NPCDialogue;
