/**
 * Goals Service
 * 
 * Business logic for goal tracking and completion checking
 */

import { GOALS } from './goals.config';

/**
 * Initialize goals state
 */
export function initializeGoals() {
    const goals = {};
    GOALS.forEach(goal => {
        goals[goal.id] = {
            completed: false,
            progress: 0,
            target: goal.target,
            completedAt: null,
        };
    });
    return goals;
}

/**
 * Update goal progress based on current game state
 */
export function updateGoalProgress(goals, gameState) {
    const updatedGoals = { ...goals };
    let newlyCompleted = [];

    GOALS.forEach(goal => {
        const currentProgress = goal.getProgress(gameState);
        const goalState = updatedGoals[goal.id];

        // Update progress
        goalState.progress = currentProgress;

        // Check for completion
        if (!goalState.completed && currentProgress >= goal.target) {
            goalState.completed = true;
            goalState.completedAt = Date.now();
            newlyCompleted.push(goal);
        }
    });

    return { updatedGoals, newlyCompleted };
}

/**
 * Check if a specific goal is completed
 */
export function isGoalCompleted(goals, goalId) {
    return goals[goalId]?.completed || false;
}

/**
 * Get progress percentage for a goal
 */
export function getGoalProgressPercentage(goals, goalId) {
    const goal = goals[goalId];
    if (!goal) return 0;
    return Math.min(100, Math.round((goal.progress / goal.target) * 100));
}

/**
 * Get all completed goals
 */
export function getCompletedGoals(goals) {
    return Object.keys(goals).filter(goalId => goals[goalId].completed);
}

/**
 * Get completion summary
 */
export function getGoalsSummary(goals) {
    const completed = getCompletedGoals(goals);
    const total = GOALS.length;

    return {
        completed: completed.length,
        total,
        percentage: Math.round((completed.length / total) * 100),
        completedGoals: completed.map(goalId => {
            const goalConfig = GOALS.find(g => g.id === goalId);
            return {
                id: goalId,
                title: goalConfig?.title,
                reward: goalConfig?.reward,
                completedAt: goals[goalId].completedAt,
            };
        }),
    };
}

/**
 * Get goals with progress for display
 */
export function getGoalsWithProgress(goals, gameState) {
    return GOALS.map(goal => {
        const goalState = goals[goal.id] || {
            completed: false,
            progress: 0,
            target: goal.target,
        };

        return {
            ...goal,
            ...goalState,
            progressPercentage: getGoalProgressPercentage(goals, goal.id),
        };
    });
}
