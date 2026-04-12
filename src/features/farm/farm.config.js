/**
 * Farm Configuration
 * 
 * Defines the farm grid layout, tile properties, and game constants.
 */

export const FARM_CONFIG = {
    // Grid dimensions
    GRID_SIZE: 8, // 8×8 grid = 64 tiles
    TILE_SIZE: 1.0, // Each tile is 1 unit in 3D space

    // Grid positioning (centered at origin)
    GRID_OFFSET_X: -3.5, // Centers 8 tiles around origin
    GRID_OFFSET_Z: -3.5,

    // Tile states
    TILE_STATES: {
        UNTILLED: 'untilled',
        TILLED: 'tilled',
        WATERED: 'watered',
        PLANTED: 'planted',
        GROWING: 'growing',
        READY: 'ready',
    },

    // Crop types (matching requirements)
    CROP_TYPES: {
        BEAN: 'bean',
        WHEAT: 'wheat',
        TOMATO: 'tomato',
        CARROT: 'carrot',
    },

    // Crop growth times (in game days)
    GROWTH_TIMES: {
        bean: 4,
        wheat: 3,
        tomato: 4,
        carrot: 3,
    },

    // Crop values (coins earned on harvest)
    CROP_VALUES: {
        bean: 25,
        wheat: 10,
        tomato: 20,
        carrot: 15,
    },

    // Seed costs (coins to purchase)
    SEED_COSTS: {
        bean: 15,
        wheat: 5,
        tomato: 12,
        carrot: 8,
    },

    // Initial game state
    INITIAL_COINS: 0,
    INITIAL_SEEDS: {
        bean: 3,
        wheat: 3,
        tomato: 3,
        carrot: 3,
    },

    // Water mechanics
    WATER_DURATION_DAYS: 1, // Water lasts 1 day

    // Visual settings
    TILE_COLORS: {
        untilled: '#7a6040',
        tilled: '#5c4530',
        watered: '#3e3025',
    },
};

/**
 * Generate initial tile ID
 * Format: "tile-{row}-{col}"
 */
export function generateTileId(row, col) {
    return `tile-${row}-${col}`;
}

/**
 * Calculate 3D position for a tile based on grid coordinates
 */
export function getTilePosition(row, col) {
    return {
        x: FARM_CONFIG.GRID_OFFSET_X + col * FARM_CONFIG.TILE_SIZE,
        y: 0, // Ground level
        z: FARM_CONFIG.GRID_OFFSET_Z + row * FARM_CONFIG.TILE_SIZE,
    };
}

/**
 * Parse tile ID to get row and column
 */
export function parseTileId(tileId) {
    const parts = tileId.split('-');
    return {
        row: parseInt(parts[1], 10),
        col: parseInt(parts[2], 10),
    };
}
