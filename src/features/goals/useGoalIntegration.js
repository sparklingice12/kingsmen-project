/**
 * Goal Integration Hook
 * 
 * Manages goal progress tracking and completion notifications
 */

import { useEffect, useState, useCallback } from 'react';
import { useStore } from '@/state/store';

/**
 * Hook to integrate goals with gameplay
 * 
 * Automatically tracks goal progress and shows completion notifications
 */
export function useGoalIntegration() {
    const [completedGoal, setCompletedGoal] = useState(null);
    const isPlaying = useStore((s) => s.game.isPlaying);
    const updateGoals = useStore((s) => s.session.updateGoals);
    const goals = useStore((s) => s.session.goals);

    // Track when goals are updated
    const [previousGoals, setPreviousGoals] = useState(goals);

    // Check for newly completed goals
    useEffect(() => {
        if (!isPlaying) return;

        // Compare current goals with previous goals
        const newlyCompleted = Object.keys(goals).find(goalId => {
            const wasCompleted = previousGoals[goalId]?.completed || false;
            const isCompleted = goals[goalId]?.completed || false;
            return !wasCompleted && isCompleted;
        });

        if (newlyCompleted) {
            // Find the goal config
            const { GOALS } = require('./goals.config');
            const goalConfig = GOALS.find(g => g.id === newlyCompleted);

            if (goalConfig) {
                setCompletedGoal({
                    ...goalConfig,
                    ...goals[newlyCompleted],
                });
            }
        }

        // Update previous goals
        setPreviousGoals(goals);
    }, [goals, previousGoals, isPlaying]);

    // Clear completed goal notification
    const clearCompletedGoal = useCallback(() => {
        setCompletedGoal(null);
    }, []);

    return {
        completedGoal,
        clearCompletedGoal,
    };
}
