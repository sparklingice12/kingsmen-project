// Audio service for Heritage Harvest
import { audioConfig } from './audio.config.js';

class AudioService {
    constructor() {
        this.audioContext = null;
        this.musicGainNode = null;
        this.sfxGainNode = null;
        this.currentMusic = null;
        this.soundCache = new Map();
        this.activeSounds = new Set();

        // Volume settings (0-1)
        this.musicVolume = audioConfig.music.defaultVolume;
        this.sfxVolume = audioConfig.sfx.defaultVolume;
        this.musicEnabled = audioConfig.music.enabled;
        this.sfxEnabled = audioConfig.sfx.enabled;

        // Load settings from localStorage
        this.loadSettings();

        // Initialize audio context on first user interaction
        this.initialized = false;
        this.pendingInitialization = [];
    }

    async initialize() {
        if (this.initialized) return;

        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create gain nodes for volume control
            this.musicGainNode = this.audioContext.createGain();
            this.sfxGainNode = this.audioContext.createGain();

            // Connect to destination
            this.musicGainNode.connect(this.audioContext.destination);
            this.sfxGainNode.connect(this.audioContext.destination);

            // Set initial volumes
            this.musicGainNode.gain.value = this.musicEnabled ? this.musicVolume : 0;
            this.sfxGainNode.gain.value = this.sfxEnabled ? this.sfxVolume : 0;

            this.initialized = true;

            // Process any pending operations
            this.pendingInitialization.forEach(fn => fn());
            this.pendingInitialization = [];

            console.log('Audio service initialized');
        } catch (error) {
            console.error('Failed to initialize audio service:', error);
        }
    }

    // Ensure audio context is initialized before operations
    async ensureInitialized() {
        if (!this.initialized) {
            await this.initialize();
        }

        // Resume context if suspended (required by browser policies)
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    // Load audio file and cache it
    async loadSound(url) {
        if (this.soundCache.has(url)) {
            return this.soundCache.get(url);
        }

        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            this.soundCache.set(url, audioBuffer);
            return audioBuffer;
        } catch (error) {
            console.warn(`Failed to load audio: ${url}`, error);
            return null;
        }
    }

    // Play background music
    async playMusic(trackName = 'farm') {
        if (!this.musicEnabled) return;

        await this.ensureInitialized();

        const trackUrl = audioConfig.music.tracks[trackName];
        if (!trackUrl) {
            console.warn(`Music track not found: ${trackName}`);
            return;
        }

        // Stop current music if playing
        this.stopMusic();

        try {
            const audioBuffer = await this.loadSound(trackUrl);
            if (!audioBuffer) return;

            // Create source node
            const source = this.audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.loop = true;
            source.connect(this.musicGainNode);

            // Fade in
            this.musicGainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            this.musicGainNode.gain.linearRampToValueAtTime(
                this.musicVolume,
                this.audioContext.currentTime + audioConfig.music.fadeInDuration / 1000
            );

            source.start();
            this.currentMusic = source;

            console.log(`Playing music: ${trackName}`);
        } catch (error) {
            console.error('Failed to play music:', error);
        }
    }

    // Stop background music
    stopMusic() {
        if (!this.currentMusic) return;

        try {
            // Fade out
            const fadeOutTime = audioConfig.music.fadeOutDuration / 1000;
            this.musicGainNode.gain.linearRampToValueAtTime(
                0,
                this.audioContext.currentTime + fadeOutTime
            );

            // Stop after fade out
            setTimeout(() => {
                if (this.currentMusic) {
                    this.currentMusic.stop();
                    this.currentMusic = null;
                }
            }, audioConfig.music.fadeOutDuration);

            console.log('Stopping music');
        } catch (error) {
            console.error('Failed to stop music:', error);
        }
    }

    // Play sound effect
    async playSfx(soundName, options = {}) {
        if (!this.sfxEnabled) return;

        await this.ensureInitialized();

        const soundUrl = audioConfig.sfx.sounds[soundName];
        if (!soundUrl) {
            console.warn(`Sound effect not found: ${soundName}`);
            return;
        }

        // Limit concurrent sounds
        if (this.activeSounds.size >= audioConfig.maxConcurrentSounds) {
            console.warn('Max concurrent sounds reached, skipping:', soundName);
            return;
        }

        try {
            const audioBuffer = await this.loadSound(soundUrl);
            if (!audioBuffer) return;

            // Create source node
            const source = this.audioContext.createBufferSource();
            source.buffer = audioBuffer;

            // Apply volume (can be overridden per sound)
            const gainNode = this.audioContext.createGain();
            const volume = options.volume !== undefined ? options.volume : 1.0;
            gainNode.gain.value = volume;

            source.connect(gainNode);
            gainNode.connect(this.sfxGainNode);

            // Track active sound
            this.activeSounds.add(source);

            // Clean up when sound ends
            source.onended = () => {
                this.activeSounds.delete(source);
            };

            source.start();

            console.log(`Playing SFX: ${soundName}`);
            return source;
        } catch (error) {
            console.error('Failed to play sound effect:', error);
        }
    }

    // Volume controls
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.musicGainNode) {
            this.musicGainNode.gain.value = this.musicEnabled ? this.musicVolume : 0;
        }
        this.saveSettings();
    }

    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        if (this.sfxGainNode) {
            this.sfxGainNode.gain.value = this.sfxEnabled ? this.sfxVolume : 0;
        }
        this.saveSettings();
    }

    // Enable/disable controls
    setMusicEnabled(enabled) {
        this.musicEnabled = enabled;
        if (this.musicGainNode) {
            this.musicGainNode.gain.value = enabled ? this.musicVolume : 0;
        }
        if (!enabled) {
            this.stopMusic();
        }
        this.saveSettings();
    }

    setSfxEnabled(enabled) {
        this.sfxEnabled = enabled;
        if (this.sfxGainNode) {
            this.sfxGainNode.gain.value = enabled ? this.sfxVolume : 0;
        }
        this.saveSettings();
    }

    // Getters
    getMusicVolume() { return this.musicVolume; }
    getSfxVolume() { return this.sfxVolume; }
    isMusicEnabled() { return this.musicEnabled; }
    isSfxEnabled() { return this.sfxEnabled; }

    // Persistence
    saveSettings() {
        const settings = {
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
            musicEnabled: this.musicEnabled,
            sfxEnabled: this.sfxEnabled
        };
        localStorage.setItem('heritage-harvest-audio-settings', JSON.stringify(settings));
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('heritage-harvest-audio-settings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.musicVolume = settings.musicVolume ?? audioConfig.music.defaultVolume;
                this.sfxVolume = settings.sfxVolume ?? audioConfig.sfx.defaultVolume;
                this.musicEnabled = settings.musicEnabled ?? audioConfig.music.enabled;
                this.sfxEnabled = settings.sfxEnabled ?? audioConfig.sfx.enabled;
            }
        } catch (error) {
            console.warn('Failed to load audio settings:', error);
        }
    }

    // Preload critical sounds
    async preloadSounds() {
        if (!audioConfig.preloadCriticalSounds) return;

        await this.ensureInitialized();

        const criticalSounds = [
            'click', 'till', 'water', 'plant', 'harvest', 'dayTransition'
        ];

        const promises = criticalSounds.map(soundName => {
            const url = audioConfig.sfx.sounds[soundName];
            return url ? this.loadSound(url) : Promise.resolve();
        });

        try {
            await Promise.all(promises);
            console.log('Critical sounds preloaded');
        } catch (error) {
            console.warn('Failed to preload some sounds:', error);
        }
    }

    // Cleanup
    dispose() {
        this.stopMusic();

        // Stop all active sounds
        this.activeSounds.forEach(source => {
            try {
                source.stop();
            } catch (e) {
                // Ignore errors when stopping sounds
            }
        });
        this.activeSounds.clear();

        // Close audio context
        if (this.audioContext) {
            this.audioContext.close();
        }

        this.initialized = false;
    }
}

// Create singleton instance
export const audioService = new AudioService();

// Convenience functions for common operations
export const playMusic = (trackName) => audioService.playMusic(trackName);
export const stopMusic = () => audioService.stopMusic();
export const playSfx = (soundName, options) => audioService.playSfx(soundName, options);
export const setMusicVolume = (volume) => audioService.setMusicVolume(volume);
export const setSfxVolume = (volume) => audioService.setSfxVolume(volume);
export const setMusicEnabled = (enabled) => audioService.setMusicEnabled(enabled);
export const setSfxEnabled = (enabled) => audioService.setSfxEnabled(enabled);