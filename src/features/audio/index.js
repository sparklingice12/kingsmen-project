// Audio feature exports
export { audioService, playMusic, stopMusic, playSfx, setMusicVolume, setSfxVolume, setMusicEnabled, setSfxEnabled } from './audio.service.js';
export { useAudio, useGameAudio } from './hooks/useAudio.js';
export { default as AudioControls } from './components/AudioControls.jsx';
export { default as AudioToggle } from './components/AudioToggle.jsx';
export { audioConfig } from './audio.config.js';