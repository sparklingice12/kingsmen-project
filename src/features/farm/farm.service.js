/**
 * Farm Service
 * 
 * Utility functions for farm grid operations and tile management.
 */

import { FARM_CONFIG, generateTileId, getTilePosition, parseTileId } from './farm.config';

/**
 * Initialize the farm grid with 64 tiles
 * Returns an array of tile objects with initial state
 */
export function initializeFarmGrid() {
    const tiles = [];

    for (let row = 0; row < FARM_CONFIG.GRID_SIZE; row++) {
        for (let col = 0; col < FARM_CONFIG.GRID_SIZE; col++) {
            const id = generateTileId(row, col);
            const position = getTilePosition(row, col);

            tiles.push({
                id,
                row,
                col,
                position,
                state: FARM_CONFIG.TILE_STATES.UNTILLED,
                crop: null,
                growthStage: 0,
                daysPlanted: 0,
                isWatered: false,
                wateredDaysRemaining: 0,
            });
        }
    }

    return tiles;
}

/**
 * Find a tile by its ID
 */
export function findTileById(tiles, tileId) {
    return tiles.find(tile => tile.id === tileId);
}

/**
 * Find a tile by row and column
 */
export function findTileByPosition(tiles, row, col) {
    return tiles.find(tile => tile.row === row && tile.col === col);
}

/**
 * Get all tiles in a specific state
 */
export function getTilesByState(tiles, state) {
    return tiles.filter(tile => tile.state === state);
}

/**
 * Get all tiles with a specific crop
 */
export function getTilesByCrop(tiles, cropType) {
    return tiles.filter(tile => tile.crop === cropType);
}

/**
 * Check if a tile can be tilled
 */
export function canTillTile(tile) {
    return tile.state === FARM_CONFIG.TILE_STATES.UNTILLED;
}

/**
 * Check if a tile can be watered
 */
export function canWaterTile(tile) {
    return (
        tile.state === FARM_CONFIG.TILE_STATES.TILLED ||
        tile.state === FARM_CONFIG.TILE_STATES.PLANTED ||
        tile.state === FARM_CONFIG.TILE_STATES.GROWING
    ) && !tile.isWatered;
}

/**
 * Check if a tile can be planted
 */
export function canPlantTile(tile) {
    return tile.state === FARM_CONFIG.TILE_STATES.TILLED && tile.crop === null;
}

/**
 * Check if a tile is ready to harvest
 */
export function canHarvestTile(tile) {
    return tile.state === FARM_CONFIG.TILE_STATES.READY;
}

/**
 * Calculate crop growth progress (0-1)
 */
export function getCropGrowthProgress(tile) {
    if (!tile.crop) return 0;

    const growthTime = FARM_CONFIG.GROWTH_TIMES[tile.crop];
    return Math.min(tile.daysPlanted / growthTime, 1);
}

/**
 * Check if crop is ready to harvest
 */
export function isCropReady(tile) {
    if (!tile.crop) return false;

    const growthTime = FARM_CONFIG.GROWTH_TIMES[tile.crop];
    return tile.daysPlanted >= growthTime;
}

/**
 * Get the value of a harvested crop
 */
export function getCropValue(cropType) {
    return FARM_CONFIG.CROP_VALUES[cropType] || 0;
}

/**
 * Get the cost of seeds
 */
export function getSeedCost(cropType) {
    return FARM_CONFIG.SEED_COSTS[cropType] || 0;
}

/**
 * Update tile state after a day passes
 * Handles crop growth and water depletion
 */
export function updateTileForNewDay(tile) {
    const updatedTile = { ...tile };

    // Update water status
    if (updatedTile.isWatered) {
        updatedTile.wateredDaysRemaining -= 1;
        if (updatedTile.wateredDaysRemaining <= 0) {
            updatedTile.isWatered = false;
            updatedTile.wateredDaysRemaining = 0;
        }
    }

    // Update crop growth
    if (updatedTile.crop && updatedTile.state !== FARM_CONFIG.TILE_STATES.READY) {
        updatedTile.daysPlanted += 1;

        // Check if crop is ready
        if (isCropReady(updatedTile)) {
            updatedTile.state = FARM_CONFIG.TILE_STATES.READY;
        } else {
            updatedTile.state = FARM_CONFIG.TILE_STATES.GROWING;
        }
    }

    return updatedTile;
}

/**
 * Get statistics about the farm
 */
export function getFarmStats(tiles) {
    return {
        total: tiles.length,
        untilled: getTilesByState(tiles, FARM_CONFIG.TILE_STATES.UNTILLED).length,
        tilled: getTilesByState(tiles, FARM_CONFIG.TILE_STATES.TILLED).length,
        planted: tiles.filter(t => t.crop !== null).length,
        ready: getTilesByState(tiles, FARM_CONFIG.TILE_STATES.READY).length,
        watered: tiles.filter(t => t.isWatered).length,
    };
}

/**
 * Validate tile data structure
 */
export function validateTile(tile) {
    return (
        tile &&
        typeof tile.id === 'string' &&
        typeof tile.row === 'number' &&
        typeof tile.col === 'number' &&
        tile.position &&
        typeof tile.position.x === 'number' &&
        typeof tile.position.y === 'number' &&
        typeof tile.position.z === 'number' &&
        typeof tile.state === 'string' &&
        Object.values(FARM_CONFIG.TILE_STATES).includes(tile.state)
    );
}

/**
 * Get adjacent tiles in an area around a center tile
 * @param {Array} tiles - All farm tiles
 * @param {number} centerRow - Center tile row
 * @param {number} centerCol - Center tile column
 * @param {number} areaSize - Size of area (1=1x1, 3=3x3, 5=5x5)
 * @returns {Array} Array of tile IDs in the area
 */
export function getAdjacentTiles(tiles, centerRow, centerCol, areaSize) {
    const adjacentTiles = [];
    const radius = Math.floor(areaSize / 2);

    for (let row = centerRow - radius; row <= centerRow + radius; row++) {
        for (let col = centerCol - radius; col <= centerCol + radius; col++) {
            // Check if within grid bounds
            if (row >= 0 && row < FARM_CONFIG.GRID_SIZE && col >= 0 && col < FARM_CONFIG.GRID_SIZE) {
                const tile = findTileByPosition(tiles, row, col);
                if (tile) {
                    adjacentTiles.push(tile.id);
                }
            }
        }
    }

    return adjacentTiles;
}
