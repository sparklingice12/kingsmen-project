/**
 * Sustainability Feature Module
 * 
 * Exports sustainability tracking functionality
 */

export { SUSTAINABILITY_CONFIG } from './sustainability.config';
export {
    calculateDayScore,
    calculateTotalScore,
    getFeedback,
    getTips,
    trackDailyActivities,
    initializeSustainabilityState
} from './sustainability.service';
export { default as SustainabilityFeedback } from './SustainabilityFeedback.module';
