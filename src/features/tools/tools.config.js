/**
 * Tools Configuration
 * 
 * Defines available tools, their properties, and valid state transitions.
 */

export const TOOLS_CONFIG = {
    // Tool types
    TOOL_TYPES: {
        NONE: 'none',
        INFO: 'info',
        HOE: 'hoe',
        WATERING_CAN: 'watering_can',
        SEED_BAG: 'seed_bag',
        HARVEST_TOOL: 'harvest_tool',
    },

    // Tool metadata
    TOOLS: {
        none: {
            id: 'none',
            name: 'Hand',
            icon: '✋',
            iconImage: '/sprites/hand.png', // Use PNG sprite instead of emoji
            description: 'Walk around and inspect crops',
            validStates: [],
            resultState: null,
        },
        info: {
            id: 'info',
            name: 'Info',
            icon: 'ℹ️',
            iconImage: '/sprites/info.png', // Use PNG sprite instead of emoji
            description: 'Learn about crops',
            validStates: [],
            resultState: null,
            isInfoTool: true,
        },
        hoe: {
            id: 'hoe',
            name: 'Hoe',
            icon: '🔨',
            iconImage: '/sprites/hoe.png', // Use PNG sprite instead of emoji
            description: 'Till untilled soil',
            validStates: ['untilled'],
            resultState: 'tilled',
        },
        watering_can: {
            id: 'watering_can',
            name: 'Watering Can',
            icon: '💧',
            iconImage: '/sprites/watering-can.png', // Use PNG sprite instead of emoji
            description: 'Water tilled soil or crops',
            validStates: ['tilled', 'planted', 'growing'],
            resultState: 'watered',
        },
        seed_bag: {
            id: 'seed_bag',
            name: 'Seed Bag',
            icon: '🌱',
            iconImage: '/sprites/seed-bag.png', // Use PNG sprite instead of emoji
            description: 'Plant seeds on watered soil',
            validStates: ['watered'],
            resultState: 'planted',
            requiresSeed: true,
        },
        harvest_tool: {
            id: 'harvest_tool',
            name: 'Harvest Tool',
            icon: '🌾',
            iconImage: '/sprites/harvesting-tool.png', // Use PNG sprite instead of emoji
            description: 'Harvest ready crops',
            validStates: ['ready'],
            resultState: 'tilled',
        },
    },

    // State transition rules
    STATE_TRANSITIONS: {
        untilled: {
            hoe: 'tilled',
        },
        tilled: {
            watering_can: 'watered',
        },
        watered: {
            seed_bag: 'planted', // Requires seed selection
        },
        planted: {
            // No direct transitions - grows to 'growing'
        },
        growing: {
            // No direct transitions - grows to 'ready'
        },
        ready: {
            harvest_tool: 'tilled',
        },
    },

    // Visual feedback
    FEEDBACK: {
        SUCCESS_DURATION: 300, // ms
        ERROR_DURATION: 500, // ms
        SUCCESS_COLOR: '#4ADE80', // Green
        ERROR_COLOR: '#EF4444', // Red
    },
};

/**
 * Get tool by ID
 */
export function getToolById(toolId) {
    return TOOLS_CONFIG.TOOLS[toolId] || null;
}

/**
 * Get all available tools
 */
export function getAllTools() {
    return Object.values(TOOLS_CONFIG.TOOLS);
}
