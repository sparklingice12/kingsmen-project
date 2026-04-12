/**
 * Chicken Interaction Handler
 * Handles feeding chickens when player taps them
 */

import { useStore } from '@/state/store';

export default function ChickenInteractionHandler() {
    const chickens = useStore((s) => s.animals.chickens);
    const feedChicken = useStore((s) => s.animals.feedChicken);
    const setFeedback = useStore((s) => s.ui.setFeedback);

    // This component doesn't render anything - it's just for logic
    // The actual chicken tap handling is done in the Chicken component
    // This is here for future expansion if needed

    return null;
}
