// Quick audio toggle button for HUD
import { useState, useEffect } from 'react';
import { audioService } from '../audio.service.js';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioToggle({ className = '', style = {} }) {
    const [musicEnabled, setMusicEnabled] = useState(true);
    const [sfxEnabled, setSfxEnabled] = useState(true);

    // Load current settings on mount
    useEffect(() => {
        setMusicEnabled(audioService.isMusicEnabled());
        setSfxEnabled(audioService.isSfxEnabled());
    }, []);

    const toggleAudio = async () => {
        // Force audio initialization if not already done
        if (!audioService.initialized) {
            await audioService.initialize();
        }

        // If either is enabled, disable both. If both disabled, enable both.
        const shouldEnable = !musicEnabled && !sfxEnabled;

        audioService.setMusicEnabled(shouldEnable);
        audioService.setSfxEnabled(shouldEnable);

        setMusicEnabled(shouldEnable);
        setSfxEnabled(shouldEnable);

        // If enabling audio, try to start music
        if (shouldEnable) {
            try {
                await audioService.playMusic('farm');
                setTimeout(() => audioService.playSfx('click'), 100);
            } catch (error) {
                console.warn('Failed to start audio:', error);
            }
        } else {
            audioService.stopMusic();
        }
    };

    const isAnyAudioEnabled = musicEnabled || sfxEnabled;

    return (
        <button
            onClick={toggleAudio}
            className={className}
            style={style}
            title={isAnyAudioEnabled ? 'Mute Audio' : 'Enable Audio'}
        >
            {isAnyAudioEnabled ? (
                <>
                    <Volume2 className="w-4 h-4" />
                    <span>Audio On</span>
                </>
            ) : (
                <>
                    <VolumeX className="w-4 h-4" />
                    <span>Audio Off</span>
                </>
            )}
        </button>
    );
}