import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/state/store';
import { TIME_CONFIG } from './time.config';
import { advanceAllCrops } from '@/features/crops/crops.service';
import { playSfx } from '@/features/audio/audio.service';

/**
 * useTime Hook
 * 
 * Manages the accelerated day/night cycle.
 * Updates timeOfDay (0-1) every frame.
 * Triggers hourly crop growth and day advance at cycle end.
 * Pauses time when modals are open.
 * 
 * Requirements: 1.5.1, 1.5.3, 1.5.5, 1.5.6
 */
export function useTime() {
    const isPlaying = useStore((s) => s.game.isPlaying);
    const isPaused = useStore((s) => s.game.isPaused);
    const modalOpen = useStore((s) => s.ui.modalOpen);
    const setTimeOfDay = useStore((s) => s.game.setTimeOfDay);
    const advanceDay = useStore((s) => s.game.advanceDay);
    const tiles = useStore((s) => s.farm.tiles);

    const elapsedTime = useRef(0);
    const lastHour = useRef(0);
    const dayDuration = TIME_CONFIG.DAY_DURATION_DEFAULT;
    const hourDuration = TIME_CONFIG.HOUR_DURATION;

    useFrame((state, delta) => {
        // Don't update time if game is not playing, paused, or modal is open
        if (!isPlaying || isPaused || modalOpen) {
            return;
        }

        // Accumulate elapsed time
        elapsedTime.current += delta;

        // Calculate time of day (0-1)
        const timeOfDay = (elapsedTime.current % dayDuration) / dayDuration;
        setTimeOfDay(timeOfDay);

        // Calculate current hour (0-23)
        const currentHour = Math.floor(timeOfDay * TIME_CONFIG.HOURS_PER_DAY);

        // Check if an hour has passed
        if (currentHour !== lastHour.current) {
            lastHour.current = currentHour;

            // Advance all crops every hour
            const updatedTiles = advanceAllCrops(tiles);

            // Update tiles in store
            updatedTiles.forEach(tile => {
                if (tile.crop) {
                    useStore.getState().farm.updateTile(tile.id, {
                        crop: tile.crop,
                        state: tile.state,
                    });
                }
            });
        }

        // Check if day has completed
        if (elapsedTime.current >= dayDuration) {
            // Play day transition sound
            playSfx('dayTransition');

            // Reset elapsed time
            elapsedTime.current = 0;
            lastHour.current = 0;

            // Advance chickens to next day (produces eggs if fed)
            useStore.getState().animals.advanceChickensDay();

            // Track daily activities for sustainability before showing summary
            // (This will be calculated in the DaySummary component when it mounts)

            // Open day summary modal (don't advance day yet)
            useStore.getState().ui.openGameModal('day-summary', null);
            useStore.getState().game.pauseGame();

            // Note: Day will be advanced when user clicks "Continue" in the summary modal
        }
    });

    return {
        elapsedTime: elapsedTime.current,
        dayDuration,
        hourDuration,
    };
}
