import { useTime } from './useTime';

/**
 * TimeManager Component
 * 
 * Invisible component that manages the time cycle.
 * Must be placed inside the R3F Canvas to use useFrame.
 * 
 * Requirements: 1.5.1, 1.5.3
 */
function TimeManager() {
    useTime();

    // This component doesn't render anything
    return null;
}

export default TimeManager;
