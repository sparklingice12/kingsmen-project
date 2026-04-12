// React hook for audio integration
import { useEffect, useCallback } from 'react';
import { useStore } from '@/state/store';
import { audioService, playMusic, stopMusic, playSfx } from '../audio.service.js';

export function useAudio() {
    const isPlaying = useStore((s) => s.game.isPlaying);
    const isPaused = useStore((s) => s.game.isPaused);

    // Initialize audio on first user interaction
    const initializeAudio = useCallback(async () => {
        try {
            await audioService.initialize();
            await audioService.preloadSounds();
        } catch (error) {
            console.warn('Failed to initialize audio:', error);
        }
    }, []);

    // Start/stop music based on game state
    useEffect(() => {
        if (isPlaying && !isPaused) {
            playMusic('farm');
        } else {
            stopMusic();
        }
    }, [isPlaying, isPaused]);

    // Provide audio controls
    const audioControls = {
        // Music controls
        playMusic: (trackName) => playMusic(trackName),
        stopMusic: () => stopMusic(),
        setMusicVolume: (volume) => audioService.setMusicVolume(volume),
        setMusicEnabled: (enabled) => audioService.setMusicEnabled(enabled),
        getMusicVolume: () => audioService.getMusicVolume(),
        isMusicEnabled: () => audioService.isMusicEnabled(),

        // SFX controls
        playSfx: (soundName, options) => playSfx(soundName, options),
        setSfxVolume: (volume) => audioService.setSfxVolume(volume),
        setSfxEnabled: (enabled) => audioService.setSfxEnabled(enabled),
        getSfxVolume: () => audioService.getSfxVolume(),
        isSfxEnabled: () => audioService.isSfxEnabled(),

        // Initialization
        initialize: initializeAudio
    };

    return audioControls;
}

// Hook for playing sound effects with game events
export function useGameAudio() {
    const { playSfx } = useAudio();

    const playToolSound = useCallback((toolType) => {
        const soundMap = {
            hoe: 'till',
            watering_can: 'water',
            seed_bag: 'plant',
            harvest_tool: 'harvest'
        };

        const soundName = soundMap[toolType];
        if (soundName) {
            playSfx(soundName);
        }
    }, [playSfx]);

    const playUISound = useCallback((type) => {
        playSfx(type); // 'click', 'hover', 'success', 'error'
    }, [playSfx]);

    const playGameEvent = useCallback((eventType) => {
        playSfx(eventType); // 'dayTransition', 'cropGrowth', 'coinEarn'
    }, [playSfx]);

    return {
        playToolSound,
        playUISound,
        playGameEvent,
        playSfx
    };
}