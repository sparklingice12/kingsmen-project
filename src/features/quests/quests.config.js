/**
 * Quest System Configuration
 * 
 * Defines all available quests in the Heritage Harvest game.
 * Quest types: plant, harvest, diversity, sustainability
 */

export const QUEST_TYPES = {
    PLANT: 'plant',
    HARVEST: 'harvest',
    DIVERSITY: 'diversity',
    SUSTAINABILITY: 'sustainability',
};

export const REWARD_TYPES = {
    COINS: 'coins',
    CODEX: 'codex',
    SEEDS: 'seeds',
};

/**
 * Quest definitions
 * Each quest has:
 * - id: unique identifier
 * - title: display name
 * - description: objective text
 * - type: quest category
 * - target: goal value
 * - reward: what player receives on completion
 */
export const QUESTS_CONFIG = [
    {
        id: 'first_plant',
        title: 'First Steps',
        description: 'Plant your first crop to begin your farming journey',
        type: QUEST_TYPES.PLANT,
        target: 1,
        reward: {
            type: REWARD_TYPES.COINS,
            value: 20,
        },
        order: 1,
    },
    {
        id: 'diverse_farm',
        title: 'Crop Diversity',
        description: 'Plant 3 different types of crops',
        type: QUEST_TYPES.DIVERSITY,
        target: 3,
        reward: {
            type: REWARD_TYPES.CODEX,
            value: 'crop-rotation', // Codex entry ID
        },
        order: 2,
    },
    {
        id: 'harvest_five',
        title: 'Bountiful Harvest',
        description: 'Harvest 5 mature crops',
        type: QUEST_TYPES.HARVEST,
        target: 5,
        reward: {
            type: REWARD_TYPES.COINS,
            value: 50,
        },
        order: 3,
    },
    {
        id: 'harvest_tomatoes',
        title: 'Tomato Farmer',
        description: 'Harvest 3 tomatoes',
        type: QUEST_TYPES.HARVEST,
        target: 3,
        reward: {
            type: REWARD_TYPES.SEEDS,
            value: { tomato: 2 }, // 2 tomato seeds
        },
        order: 4,
    },
    {
        id: 'full_garden',
        title: 'Full Garden',
        description: 'Have 10 crops growing at the same time',
        type: QUEST_TYPES.PLANT,
        target: 10,
        reward: {
            type: REWARD_TYPES.COINS,
            value: 100,
        },
        order: 5,
    },
];

/**
 * Get quest by ID
 */
export function getQuestById(id) {
    return QUESTS_CONFIG.find(q => q.id === id);
}

/**
 * Get all quests sorted by order
 */
export function getAllQuests() {
    return [...QUESTS_CONFIG].sort((a, b) => a.order - b.order);
}

/**
 * Get next available quest (first incomplete quest)
 */
export function getNextQuest(completedQuestIds = []) {
    return QUESTS_CONFIG
        .sort((a, b) => a.order - b.order)
        .find(q => !completedQuestIds.includes(q.id));
}
