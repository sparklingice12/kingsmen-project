/**
 * Crops Feature Module
 * 
 * Exports crop system components, services, and configuration.
 */

export { CROPS_CONFIG, getCropById, getAllCrops, getCropValue, getCropGrowthHours, getCropSprite } from './crops.config';
export * from './crops.service';
export { CropSprite } from './components';
export { default as HarvestEffect } from './components/HarvestEffect';
