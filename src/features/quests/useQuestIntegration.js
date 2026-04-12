/**
 * useQuestIntegration Hook
 * 
 * Automatically checks and updates quest progress after game actions
 * Shows completion notifications when quests are completed
 */

import { useEffect, useState, useCallback } from 'react';
import { useStore } from '@/state/store';
import { useQuests } from './useQuests';

export function useQuestIntegration() {
    const [completedQuest, setCompletedQuest] = useState(null);
    const [isInitialMount, setIsInitialMount] = useState(true);
    const { checkQuestProgress, initializeQuests, activeQuests } = useQuests();

    const isPlaying = useStore((s) => s.game.isPlaying);
    const tiles = useStore((s) => s.farm.tiles);
    const inventory = useStore((s) => s.inventory);
    const session = useStore((s) => s.session);

    // Initialize quests when game starts
    useEffect(() => {
        if (isPlaying && activeQuests.length === 0) {
            initializeQuests();
        }
    }, [isPlaying, activeQuests.length, initializeQuests]);

    // Mark initial mount as complete after first render
    useEffect(() => {
        if (isPlaying && activeQuests.length > 0) {
            // Wait a bit to ensure we don't show notifications on mount
            const timer = setTimeout(() => {
                setIsInitialMount(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isPlaying, activeQuests.length]);

    // Check quest progress whenever relevant game state changes
    useEffect(() => {
        if (!isPlaying || activeQuests.length === 0 || isInitialMount) return;

        const newlyCompleted = checkQuestProgress();

        // Show notification for first completed quest
        if (newlyCompleted && newlyCompleted.length > 0) {
            setCompletedQuest(newlyCompleted[0]);
        }
    }, [
        tiles, // Farm state changes
        inventory.harvested, // Harvest changes
        session.analytics.cropsPlanted, // Plant tracking
        session.analytics.cropsHarvested, // Harvest tracking
        isPlaying,
        activeQuests.length,
        checkQuestProgress,
        isInitialMount,
    ]);

    // Clear completed quest notification
    const clearCompletedQuest = useCallback(() => {
        setCompletedQuest(null);
    }, []);

    return {
        completedQuest,
        clearCompletedQuest,
    };
}
