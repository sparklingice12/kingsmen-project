/**
 * Codex Unlock Tracking Hook
 * 
 * Automatically tracks and persists unlocked Codex entries
 */

import { useEffect } from 'react';
import { useStore } from '@/state/store';
import { getUnlockedEntries } from './codex.service';

/**
 * Hook to track Codex entry unlocks
 * Call this in the main game component to automatically track unlocks
 */
export function useCodexUnlockTracking() {
    const trackEvent = useStore((s) => s.session.trackEvent);
    const gameState = useStore();

    useEffect(() => {
        // Check for newly unlocked entries
        const unlockedEntries = getUnlockedEntries(gameState);
        const previouslyUnlocked = gameState.session?.analytics?.codexEntriesUnlocked || [];

        const newlyUnlocked = unlockedEntries
            .filter(entry => !previouslyUnlocked.includes(entry.id))
            .map(entry => entry.id);

        if (newlyUnlocked.length > 0) {
            // Update analytics with newly unlocked entries
            trackEvent('codex_unlock', {
                codexEntriesUnlocked: [...previouslyUnlocked, ...newlyUnlocked],
            });

            console.log('📚 Codex entries unlocked:', newlyUnlocked);
        }
    }, [
        gameState.farm?.tiles,
        gameState.inventory?.harvested,
        gameState.inventory?.coins,
        gameState.game?.currentDay,
        gameState.session?.analytics?.cropTypesPlanted,
    ]);
}
