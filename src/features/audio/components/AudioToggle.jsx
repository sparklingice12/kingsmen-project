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
        try {
            // Force audio initialization if not already done
            if (!audioService.initialized) {
                console.log('Initializing audio service...');
                await audioService.initialize();
            }

            // If either is enabled, disable both. If both disabled, enable both.
            const shouldEnable = !musicEnabled && !sfxEnabled;
            console.log('Toggling audio:', shouldEnable ? 'ON' : 'OFF');

            audioService.setMusicEnabled(shouldEnable);
            audioService.setSfxEnabled(shouldEnable);

            setMusicEnabled(shouldEnable);
            setSfxEnabled(shouldEnable);

            // If enabling audio, try to start music
            if (shouldEnable) {
                console.log('Starting background music...');
                await audioService.playMusic('farm');
                // Test SFX with a small delay
                setTimeout(() => {
                    console.log('Testing click sound...');
                    audioService.playSfx('click');
                }, 200);
            } else {
                console.log('Stopping background music...');
                audioService.stopMusic();
            }
        } catch (error) {
            console.error('Audio toggle error:', error);
            // Show user-friendly error
            alert('Audio initialization failed. Please check browser permissions and try again.');
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