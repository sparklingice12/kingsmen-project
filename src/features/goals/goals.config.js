/**
 * Goals Configuration
 * 
 * Defines achievement goals and win conditions for the game.
 * Goals provide players with objectives to complete during their session.
 */

export const GOALS_CONFIG = {
    // Goal IDs
    SUSTAINABILITY_MASTER: 'sustainabilityMaster',
    HARVEST_CHAMPION: 'harvestChampion',
    DIVERSE_FARMER: 'diverseFarmer',
    EGG_COLLECTOR: 'eggCollector',
    KNOWLEDGE_SEEKER: 'knowledgeSeeker',
};

/**
 * Goal Definitions
 * 
 * Each goal has:
 * - id: Unique identifier
 * - title: Display name
 * - description: What the player needs to do
 * - icon: Emoji icon
 * - target: Number to reach for completion
 * - reward: Badge/title earned
 * - category: Type of goal (sustainability, farming, learning)
 */
export const GOALS = [
    {
        id: GOALS_CONFIG.SUSTAINABILITY_MASTER,
        title: 'Sustainability Master',
        description: 'Reach a sustainability score of 80 or higher',
        icon: '♻️',
        target: 80,
        reward: 'Sustainability Master Badge',
        category: 'sustainability',
        getProgress: (state) => state.sustainability?.totalScore || 0,
    },
    {
        id: GOALS_CONFIG.HARVEST_CHAMPION,
        title: 'Harvest Champion',
        description: 'Harvest 50 crops in one session',
        icon: '🌾',
        target: 50,
        reward: 'Harvest Champion Title',
        category: 'farming',
        getProgress: (state) => state.session?.analytics?.cropsHarvested || 0,
    },
    {
        id: GOALS_CONFIG.DIVERSE_FARMER,
        title: 'Diverse Farmer',
        description: 'Plant all 4 crop types in one session',
        icon: '🌱',
        target: 4,
        reward: 'Diversity Badge',
        category: 'farming',
        getProgress: (state) => {
            const planted = state.session?.analytics?.cropTypesPlanted || [];
            return planted.length;
        },
    },
    {
        id: GOALS_CONFIG.EGG_COLLECTOR,
        title: 'Egg Collector',
        description: 'Collect 10 eggs in one session',
        icon: '🥚',
        target: 10,
        reward: 'Poultry Expert Badge',
        category: 'farming',
        getProgress: (state) => state.session?.analytics?.eggsCollected || 0,
    },
    {
        id: GOALS_CONFIG.KNOWLEDGE_SEEKER,
        title: 'Knowledge Seeker',
        description: 'Unlock 10 Codex entries',
        icon: '📚',
        target: 10,
        reward: 'Scholar Badge',
        category: 'learning',
        getProgress: (state) => {
            const unlocked = state.session?.analytics?.codexEntriesUnlocked || [];
            return unlocked.length;
        },
    },
];

/**
 * Get goal by ID
 */
export function getGoalById(id) {
    return GOALS.find(goal => goal.id === id);
}

/**
 * Get goals by category
 */
export function getGoalsByCategory(category) {
    return GOALS.filter(goal => goal.category === category);
}

/**
 * Get all goal categories
 */
export function getGoalCategories() {
    return [...new Set(GOALS.map(goal => goal.category))];
}
