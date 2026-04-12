/**
 * useQuests Hook
 * 
 * Custom hook for managing quest state and interactions
 */

import { useEffect, useCallback } from 'react';
import { useStore } from '@/state/store';

export function useQuests() {
    const activeQuests = useStore((s) => s.quests.activeQuests);
    const completedQuestIds = useStore((s) => s.quests.completedQuestIds);
    const currentQuestId = useStore((s) => s.quests.currentQuestId);
    const initializeQuests = useStore((s) => s.quests.initializeQuests);
    const updateQuestProgress = useStore((s) => s.quests.updateQuestProgress);
    const setCurrentQuest = useStore((s) => s.quests.setCurrentQuest);

    // Initialize quests on mount if not already initialized
    useEffect(() => {
        // Only initialize if we have no quests at all
        if (activeQuests.length === 0) {
            initializeQuests();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount

    // Get current quest object
    const currentQuest = activeQuests.find(q => q.id === currentQuestId);

    // Get next incomplete quest (calculate directly)
    const nextQuest = activeQuests.find(q => !q.completed);

    // Get completed quests
    const completedQuests = activeQuests.filter(q => q.completed);

    // Get incomplete quests
    const incompleteQuests = activeQuests.filter(q => !q.completed);

    // Calculate overall progress
    const totalQuests = activeQuests.length;
    const completedCount = completedQuests.length;
    const progressPercentage = totalQuests > 0 ? (completedCount / totalQuests) * 100 : 0;

    // Update quest progress (call this after game actions)
    const checkQuestProgress = useCallback(() => {
        const newlyCompleted = updateQuestProgress();
        return newlyCompleted;
    }, [updateQuestProgress]);

    // Select a quest to view/track
    const selectQuest = useCallback((questId) => {
        setCurrentQuest(questId);
    }, [setCurrentQuest]);

    // Select next incomplete quest
    const selectNextQuest = useCallback(() => {
        const next = activeQuests.find(q => !q.completed);
        if (next) {
            setCurrentQuest(next.id);
        }
    }, [activeQuests, setCurrentQuest]);

    return {
        // Quest lists
        activeQuests,
        completedQuests,
        incompleteQuests,

        // Current quest
        currentQuest,
        nextQuest,

        // Progress tracking
        completedQuestIds,
        totalQuests,
        completedCount,
        progressPercentage,

        // Actions
        checkQuestProgress,
        selectQuest,
        selectNextQuest,
        initializeQuests,
    };
}
