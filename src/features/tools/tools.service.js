/**
 * Tools Service
 * 
 * Handles tool validation and application logic.
 * Validates tool usage against tile states and applies state transitions.
 * 
 * Requirements: 1.3.1, 1.3.7
 */

import { TOOLS_CONFIG } from './tools.config';
import { FARM_CONFIG } from '@/features/farm/farm.config';
import { playSfx } from '@/features/audio/audio.service';

/**
 * Check if a tool can be used on a tile
 * 
 * @param {Object} tile - Tile object from store
 * @param {string} toolId - Tool identifier (hoe, watering_can, etc.)
 * @param {string} selectedSeed - Currently selected seed type (for seed_bag)
 * @param {Object} inventory - Inventory state (for seed availability)
 * @returns {Object} { valid: boolean, reason: string }
 */
export function canUseTool(tile, toolId, selectedSeed = null, inventory = null) {
    const tool = TOOLS_CONFIG.TOOLS[toolId];

    if (!tool) {
        return { valid: false, reason: 'Invalid tool' };
    }

    if (!tile) {
        return { valid: false, reason: 'No tile selected' };
    }

    // Special case: Hoe can be used on tiles with dead crops
    if (toolId === TOOLS_CONFIG.TOOL_TYPES.HOE && tile.crop && tile.crop.dead) {
        return { valid: true, reason: 'Can remove dead crop' };
    }

    // Check if tile state is valid for this tool
    if (!tool.validStates.includes(tile.state)) {
        return {
            valid: false,
            reason: `Cannot use ${tool.name} on ${tile.state} tile`,
        };
    }

    // Special validation for seed bag
    if (toolId === TOOLS_CONFIG.TOOL_TYPES.SEED_BAG) {
        if (!selectedSeed) {
            return { valid: false, reason: 'No seed selected' };
        }

        if (inventory && inventory.seeds[selectedSeed] <= 0) {
            return { valid: false, reason: `No ${selectedSeed} seeds available` };
        }
    }

    // Special validation for harvest tool
    if (toolId === TOOLS_CONFIG.TOOL_TYPES.HARVEST_TOOL) {
        if (tile.state !== FARM_CONFIG.TILE_STATES.READY) {
            return { valid: false, reason: 'Crop not ready to harvest' };
        }
    }

    return { valid: true, reason: 'OK' };
}

/**
 * Apply tool to a tile and return the updated tile state
 * 
 * @param {Object} tile - Tile object from store
 * @param {string} toolId - Tool identifier
 * @param {string} selectedSeed - Currently selected seed type (for seed_bag)
 * @returns {Object} Updated tile properties and success message
 */
export function applyTool(tile, toolId, selectedSeed = null) {
    const tool = TOOLS_CONFIG.TOOLS[toolId];

    if (!tool) {
        throw new Error('Invalid tool');
    }

    const updates = {};
    let message = '';
    let soundEffect = null;

    switch (toolId) {
        case TOOLS_CONFIG.TOOL_TYPES.HOE:
            // Can remove dead crops or till untilled soil
            if (tile.crop && tile.crop.dead) {
                // Remove dead crop and return to tilled state
                updates.state = FARM_CONFIG.TILE_STATES.TILLED;
                updates.crop = null;
                message = 'Dead crop removed!';
                soundEffect = 'till';
            } else {
                // Untilled → Tilled
                updates.state = FARM_CONFIG.TILE_STATES.TILLED;
                message = 'Soil tilled successfully!';
                soundEffect = 'till';
            }
            break;

        case TOOLS_CONFIG.TOOL_TYPES.WATERING_CAN:
            // Tilled → Watered, or water existing crops
            if (tile.state === FARM_CONFIG.TILE_STATES.TILLED) {
                updates.state = FARM_CONFIG.TILE_STATES.WATERED;
                message = 'Soil watered!';
                soundEffect = 'water';
            } else if (tile.crop) {
                // Cannot water dead crops
                if (tile.crop.dead) {
                    return { valid: false, reason: 'Cannot water dead crops! Use hoe to remove.' };
                }

                // Water the crop (keep current state, update crop data)
                updates.crop = {
                    ...tile.crop,
                    watered: true,
                    hoursWithoutWater: 0,
                    withered: false,
                };
                message = 'Crop watered!';
                soundEffect = 'water';
            }
            break;

        case TOOLS_CONFIG.TOOL_TYPES.SEED_BAG:
            // Watered → Planted
            if (!selectedSeed) {
                throw new Error('No seed selected');
            }
            updates.state = FARM_CONFIG.TILE_STATES.PLANTED;
            updates.crop = {
                type: selectedSeed,
                stage: 1,
                hoursGrowing: 0,
                effectiveHoursGrowing: 0,
                growthProgress: 0,
                watered: true,
                hoursWithoutWater: 0,
                withered: false,
                plantedDay: 0, // Will be set by store
            };
            message = 'Seeds planted successfully!';
            soundEffect = 'plant';
            break;

        case TOOLS_CONFIG.TOOL_TYPES.HARVEST_TOOL:
            // Ready → Tilled (crop removed)
            // Return crop data so we can add to inventory and award coins
            updates.state = FARM_CONFIG.TILE_STATES.TILLED;
            updates.crop = null;
            message = `${tile.crop.type.charAt(0).toUpperCase() + tile.crop.type.slice(1)} harvested!`;
            soundEffect = 'harvest';

            // Return the harvested crop data for inventory/coin updates
            return {
                updates,
                message,
                soundEffect,
                harvestedCrop: tile.crop // Include crop data for rewards
            };
            break;

        default:
            throw new Error(`Unknown tool: ${toolId}`);
    }

    // Play sound effect if specified
    if (soundEffect) {
        playSfx(soundEffect);
    }

    return { updates, message, soundEffect };
}

/**
 * Get valid tools for a tile state
 * 
 * @param {string} tileState - Current tile state
 * @returns {Array} Array of valid tool IDs
 */
export function getValidToolsForState(tileState) {
    return Object.values(TOOLS_CONFIG.TOOLS)
        .filter((tool) => tool.validStates.includes(tileState))
        .map((tool) => tool.id);
}

/**
 * Get next state after applying a tool
 * 
 * @param {string} currentState - Current tile state
 * @param {string} toolId - Tool to apply
 * @returns {string|null} Next state or null if invalid
 */
export function getNextState(currentState, toolId) {
    const transitions = TOOLS_CONFIG.STATE_TRANSITIONS[currentState];
    return transitions ? transitions[toolId] || null : null;
}

/**
 * Validate tool usage and return detailed feedback
 * 
 * @param {Object} tile - Tile object
 * @param {string} toolId - Tool identifier
 * @param {string} selectedSeed - Selected seed type
 * @param {Object} inventory - Inventory state
 * @returns {Object} { success: boolean, message: string, updates: Object }
 */
export function validateAndApplyTool(tile, toolId, selectedSeed, inventory) {
    // Validate tool usage
    const validation = canUseTool(tile, toolId, selectedSeed, inventory);

    if (!validation.valid) {
        // Play error sound for invalid actions
        playSfx('error');
        return {
            success: false,
            message: validation.reason,
            updates: null,
        };
    }

    // Apply tool and get updates
    try {
        const result = applyTool(tile, toolId, selectedSeed);

        // Play success sound if no specific sound was played
        if (!result.soundEffect) {
            playSfx('success');
        }

        return {
            success: true,
            message: result.message,
            updates: result.updates,
            harvestedCrop: result.harvestedCrop, // Pass through harvested crop data
        };
    } catch (error) {
        // Play error sound for exceptions
        playSfx('error');
        return {
            success: false,
            message: error.message,
            updates: null,
        };
    }
}
