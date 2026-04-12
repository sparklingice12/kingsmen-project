/**
 * Crops Service
 * 
 * Handles crop growth logic, watering requirements, and withering mechanics.
 * Now uses hourly growth progression instead of daily.
 * Requirements: 1.4.3, 1.4.4, 1.4.5, 1.4.6
 */

import { CROPS_CONFIG, getCropById, getCropGrowthHours } from './crops.config';
import { FARM_CONFIG } from '@/features/farm/farm.config';
import { playSfx } from '@/features/audio/audio.service';

/**
 * Advance crop growth by one hour
 * 
 * @param {Object} crop - Crop object { type, stage, hoursGrowing, growthProgress, watered, hoursWithoutWater, effectiveHoursGrowing }
 * @param {boolean} wasWatered - Whether the crop was watered this hour
 * @returns {Object} Updated crop object
 */
export function advanceCropGrowth(crop, wasWatered) {
    if (!crop) return null;

    const cropConfig = getCropById(crop.type);
    if (!cropConfig) return crop;

    const maxStage = cropConfig.stages;
    const growthHours = getCropGrowthHours(crop.type);

    // If crop is at max stage (harvestable), it doesn't need water anymore
    if (crop.stage >= maxStage) {
        return {
            ...crop,
            hoursGrowing: (crop.hoursGrowing || 0) + 1,
            hoursWithoutWater: 0, // Reset - harvestable crops don't need water
            effectiveHoursGrowing: crop.effectiveHoursGrowing || 0,
            growthProgress: 1,
            watered: false,
            withered: false,
            dead: false,
        };
    }

    // Initialize tracking fields if missing
    const hoursWithoutWater = wasWatered ? 0 : (crop.hoursWithoutWater || 0) + 1;
    const hoursGrowing = (crop.hoursGrowing || 0) + 1;

    // Check if crop should die completely (8 hours without water)
    if (hoursWithoutWater >= CROPS_CONFIG.WATERING.HOURS_WITHOUT_WATER_BEFORE_DEATH) {
        // Crop is dead - can only be removed with hoe
        return {
            ...crop,
            hoursGrowing,
            hoursWithoutWater,
            watered: false,
            withered: true,
            dead: true, // Crop is completely dead
        };
    }

    // Check if crop should show "Needs Water!" warning (4 hours without water)
    const isWithered = hoursWithoutWater >= CROPS_CONFIG.WATERING.HOURS_WITHOUT_WATER_BEFORE_WITHER;

    // If withered, crop stops growing - just track time until death
    if (isWithered) {
        return {
            ...crop,
            hoursGrowing,
            hoursWithoutWater,
            effectiveHoursGrowing: crop.effectiveHoursGrowing || 0, // Freeze growth
            growthProgress: crop.growthProgress || 0, // Freeze progress
            watered: false,
            withered: true,
            dead: false,
        };
    }

    // Calculate effective growth hours (with watering bonus)
    // Watered crops grow 1.5x faster, unwatered crops grow at normal speed
    const growthMultiplier = wasWatered ? CROPS_CONFIG.WATERING.WATERED_GROWTH_MULTIPLIER : 1.0;
    const effectiveHoursGrowing = (crop.effectiveHoursGrowing || 0) + growthMultiplier;

    // Check if crop can advance to next stage
    if (crop.stage < maxStage) {
        // Calculate hours at current stage
        const hoursAtCurrentStage = effectiveHoursGrowing % growthHours;
        const growthProgress = hoursAtCurrentStage / growthHours; // 0-1 progress

        // Check if enough effective hours have passed for growth
        if (effectiveHoursGrowing >= growthHours && hoursAtCurrentStage < 1) {
            // Play crop growth sound
            playSfx('cropGrowth');

            // Advance to next stage
            return {
                ...crop,
                stage: crop.stage + 1,
                hoursGrowing,
                hoursWithoutWater,
                effectiveHoursGrowing: hoursAtCurrentStage, // Carry over remainder
                growthProgress: 0, // Reset progress for new stage
                watered: false,
                withered: isWithered, // Preserve withered status
                dead: false,
            };
        }

        // Update progress within current stage
        return {
            ...crop,
            hoursGrowing,
            hoursWithoutWater,
            effectiveHoursGrowing,
            growthProgress,
            watered: false,
            withered: isWithered, // Preserve withered status
            dead: false,
        };
    }

    // At max stage, just update tracking (no water needed)
    return {
        ...crop,
        hoursGrowing,
        hoursWithoutWater: 0, // Harvestable crops don't accumulate water debt
        effectiveHoursGrowing,
        growthProgress: 1, // 100% at max stage
        watered: false,
        withered: false, // Never withered at harvest stage
        dead: false,
    };
}

/**
 * Check if crop is harvestable (at max stage)
 * 
 * @param {Object} crop - Crop object
 * @returns {boolean} True if crop is ready to harvest
 */
export function isHarvestable(crop) {
    if (!crop) return false;

    const cropConfig = getCropById(crop.type);
    if (!cropConfig) return false;

    return crop.stage >= cropConfig.stages;
}

/**
 * Get crop value for harvesting
 * 
 * @param {string} cropType - Crop type ID
 * @returns {number} Coin value
 */
export function getCropValue(cropType) {
    const cropConfig = getCropById(cropType);
    return cropConfig ? cropConfig.coinValue : 0;
}

/**
 * Get crop growth progress within current stage (0-1)
 * 
 * @param {Object} crop - Crop object
 * @returns {number} Progress from 0 to 1 within current stage
 */
export function getCropStageProgress(crop) {
    if (!crop) return 0;
    return crop.growthProgress || 0;
}

/**
 * Get crop overall growth progress (0-1)
 * 
 * @param {Object} crop - Crop object
 * @returns {number} Overall progress from 0 to 1
 */
export function getCropGrowthProgress(crop) {
    if (!crop) return 0;

    const cropConfig = getCropById(crop.type);
    if (!cropConfig) return 0;

    // Calculate overall progress: (completed stages + current stage progress) / total stages
    const completedStages = crop.stage - 1;
    const currentStageProgress = crop.growthProgress || 0;

    return (completedStages + currentStageProgress) / cropConfig.stages;
}

/**
 * Check if crop is withered
 * 
 * @param {Object} crop - Crop object
 * @returns {boolean} True if crop is withered
 */
export function isWithered(crop) {
    if (!crop) return false;
    return crop.withered === true && crop.dead !== true;
}

/**
 * Check if crop is dead (completely withered, can only be removed)
 * 
 * @param {Object} crop - Crop object
 * @returns {boolean} True if crop is dead
 */
export function isDead(crop) {
    if (!crop) return false;
    return crop.dead === true;
}

/**
 * Check if crop needs water
 * 
 * @param {Object} crop - Crop object
 * @returns {boolean} True if crop needs water
 */
export function cropNeedsWater(crop) {
    if (!crop) return false;
    return !crop.watered;
}

/**
 * Water a crop
 * 
 * @param {Object} crop - Crop object
 * @returns {Object} Updated crop object
 */
export function waterCrop(crop) {
    if (!crop) return null;

    return {
        ...crop,
        watered: true,
        daysWithoutWater: 0,
    };
}

/**
 * Get crop display name
 * 
 * @param {string} cropType - Crop type ID
 * @returns {string} Display name
 */
export function getCropName(cropType) {
    const cropConfig = getCropById(cropType);
    return cropConfig ? cropConfig.name : 'Unknown';
}

/**
 * Get crop icon
 * 
 * @param {string} cropType - Crop type ID
 * @returns {string} Emoji icon
 */
export function getCropIcon(cropType) {
    const cropConfig = getCropById(cropType);
    return cropConfig ? cropConfig.icon : '🌱';
}

/**
 * Process all crops for hourly advancement
 * 
 * @param {Array} tiles - Array of farm tiles
 * @returns {Array} Updated tiles with advanced crops
 */
export function advanceAllCrops(tiles) {
    return tiles.map(tile => {
        // Only process tiles with crops
        if (tile.state !== FARM_CONFIG.TILE_STATES.PLANTED &&
            tile.state !== FARM_CONFIG.TILE_STATES.GROWING &&
            tile.state !== FARM_CONFIG.TILE_STATES.READY) {
            return tile;
        }

        if (!tile.crop) return tile;

        // Advance crop growth
        const updatedCrop = advanceCropGrowth(tile.crop, tile.crop.watered || false);

        // Determine new tile state based on crop stage
        let newState = tile.state;
        if (isHarvestable(updatedCrop)) {
            newState = FARM_CONFIG.TILE_STATES.READY;
        } else if (updatedCrop.stage > 1) {
            newState = FARM_CONFIG.TILE_STATES.GROWING;
        } else {
            newState = FARM_CONFIG.TILE_STATES.PLANTED;
        }

        return {
            ...tile,
            crop: updatedCrop,
            state: newState,
        };
    });
}
