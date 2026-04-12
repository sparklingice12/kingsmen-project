// Audio controls UI component
import { useState, useEffect } from 'react';
import { audioService } from '../audio.service.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, VolumeX, Music, Headphones } from 'lucide-react';

export default function AudioControls({ className = '' }) {
    const [musicVolume, setMusicVolume] = useState(0.3);
    const [sfxVolume, setSfxVolume] = useState(0.7);
    const [musicEnabled, setMusicEnabled] = useState(true);
    const [sfxEnabled, setSfxEnabled] = useState(true);

    // Load current settings on mount
    useEffect(() => {
        setMusicVolume(audioService.getMusicVolume());
        setSfxVolume(audioService.getSfxVolume());
        setMusicEnabled(audioService.isMusicEnabled());
        setSfxEnabled(audioService.isSfxEnabled());
    }, []);

    const handleMusicVolumeChange = (e) => {
        const volume = parseFloat(e.target.value);
        setMusicVolume(volume);
        audioService.setMusicVolume(volume);
    };

    const handleSfxVolumeChange = (e) => {
        const volume = parseFloat(e.target.value);
        setSfxVolume(volume);
        audioService.setSfxVolume(volume);
    };

    const toggleMusic = () => {
        const enabled = !musicEnabled;
        setMusicEnabled(enabled);
        audioService.setMusicEnabled(enabled);

        // Play click sound
        if (sfxEnabled) {
            audioService.playSfx('click');
        }
    };

    const toggleSfx = () => {
        const enabled = !sfxEnabled;
        setSfxEnabled(enabled);
        audioService.setSfxEnabled(enabled);

        // Play click sound (if we're enabling SFX)
        if (enabled) {
            audioService.playSfx('click');
        }
    };

    const testSfx = () => {
        audioService.playSfx('success');
    };

    return (
        <Card className={`w-80 ${className}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Headphones className="w-5 h-5" />
                    Audio Settings
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Music Controls */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm font-medium">
                            <Music className="w-4 h-4" />
                            Background Music
                        </label>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleMusic}
                            className="p-2"
                        >
                            {musicEnabled ? (
                                <Volume2 className="w-4 h-4" />
                            ) : (
                                <VolumeX className="w-4 h-4" />
                            )}
                        </Button>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-8">0</span>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={musicVolume}
                            onChange={handleMusicVolumeChange}
                            disabled={!musicEnabled}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                        />
                        <span className="text-xs text-muted-foreground w-8">100</span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                        Volume: {Math.round(musicVolume * 100)}%
                    </div>
                </div>

                {/* Sound Effects Controls */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm font-medium">
                            <Volume2 className="w-4 h-4" />
                            Sound Effects
                        </label>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleSfx}
                            className="p-2"
                        >
                            {sfxEnabled ? (
                                <Volume2 className="w-4 h-4" />
                            ) : (
                                <VolumeX className="w-4 h-4" />
                            )}
                        </Button>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-8">0</span>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={sfxVolume}
                            onChange={handleSfxVolumeChange}
                            disabled={!sfxEnabled}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                        />
                        <span className="text-xs text-muted-foreground w-8">100</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                            Volume: {Math.round(sfxVolume * 100)}%
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={testSfx}
                            disabled={!sfxEnabled}
                            className="text-xs px-2 py-1"
                        >
                            Test
                        </Button>
                    </div>
                </div>

                {/* Audio Info */}
                <div className="pt-3 border-t text-xs text-muted-foreground">
                    <p>Audio settings are automatically saved.</p>
                    <p className="mt-1">
                        {audioService.initialized ? '🔊 Audio ready' : '🔇 Audio not initialized'}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}