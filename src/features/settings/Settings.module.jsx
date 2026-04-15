// Settings modal component
import { useState, useEffect } from 'react';
import { useStore } from '@/state/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, X, Play, RotateCcw, Shield, BookOpen, Pause } from 'lucide-react';
import { playSfx, audioService } from '@/features/audio/audio.service';
import HowToPlay from '@/features/pause-menu/components/HowToPlay';
import ResetConfirmation from '@/features/pause-menu/components/ResetConfirmation';

export default function SettingsModal() {
    const modalOpen = useStore((s) => s.ui.modalOpen);
    const closeGameModal = useStore((s) => s.ui.closeGameModal);
    const isPaused = useStore((s) => s.game.isPaused);
    const pauseGame = useStore((s) => s.game.pauseGame);
    const resumeGame = useStore((s) => s.game.resumeGame);
    const resetSession = useStore((s) => s.session.resetSession);

    const [currentScreen, setCurrentScreen] = useState('main'); // 'main' | 'howToPlay' | 'resetConfirm' | 'audio'
    const [musicEnabled, setMusicEnabled] = useState(true);
    const [sfxEnabled, setSfxEnabled] = useState(true);

    const isOpen = modalOpen === 'settings';

    // Load audio settings when modal opens
    useEffect(() => {
        if (isOpen) {
            setMusicEnabled(audioService.isMusicEnabled());
            setSfxEnabled(audioService.isSfxEnabled());
        }
    }, [isOpen]);

    const handleClose = () => {
        console.log('handleClose called');
        playSfx('click');
        setCurrentScreen('main');
        closeGameModal(); // Changed from closeModal to closeGameModal
    };

    const handlePauseResume = () => {
        playSfx('click');
        if (isPaused) {
            resumeGame();
        } else {
            pauseGame();
        }
    };

    const handleHowToPlay = () => {
        playSfx('click');
        setCurrentScreen('howToPlay');
    };

    const handleAudioSettings = () => {
        playSfx('click');
        setCurrentScreen('audio');
    };

    const handleResetFarm = () => {
        playSfx('click');
        setCurrentScreen('resetConfirm');
    };

    const handleAdminAccess = () => {
        playSfx('click');
        // Dispatch custom event to open admin panel
        window.dispatchEvent(new CustomEvent('openAdminPanel'));
        // Close settings modal
        handleClose();
    };

    const handleBackToMain = () => {
        playSfx('click');
        setCurrentScreen('main');
    };

    const handleConfirmReset = () => {
        playSfx('click');
        resetSession();
        setCurrentScreen('main');
        closeGameModal(); // Changed from closeModal to closeGameModal
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center">
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                        onClick={handleClose}
                    />

                    {/* Main Menu */}
                    {currentScreen === 'main' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="relative rounded-2xl border-2 shadow-2xl flex flex-col"
                            style={{
                                width: '600px',
                                maxWidth: '90vw',
                                maxHeight: '90vh',
                                backgroundColor: 'rgba(58, 37, 24, 0.98)',
                                borderColor: '#b09060',
                            }}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="settings-title"
                        >
                            {/* Close button - fixed at top */}
                            <button
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Close button clicked');
                                    handleClose();
                                }}
                                className="absolute top-4 right-4 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-110 border-2"
                                style={{
                                    backgroundColor: 'rgba(46, 26, 14, 0.95)',
                                    borderColor: '#b09060',
                                    color: '#e8d5b0',
                                    zIndex: 10,
                                    cursor: 'pointer',
                                    touchAction: 'none',
                                }}
                                aria-label="Close settings"
                                type="button"
                            >
                                <X className="w-7 h-7" style={{ pointerEvents: 'none' }} />
                            </button>

                            {/* Scrollable content */}
                            <div className="overflow-y-auto" style={{ padding: '48px' }}>
                                {/* Title */}
                                <h2
                                    id="settings-title"
                                    className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3"
                                    style={{ color: '#e8d5b0' }}
                                >
                                    <SettingsIcon className="w-8 h-8" />
                                    Settings
                                </h2>

                                {/* Menu buttons */}
                                <div className="space-y-4">
                                    {/* Pause/Resume button */}
                                    <motion.button
                                        onClick={handlePauseResume}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full rounded-xl border-2 shadow-lg transition-all duration-150 flex items-center justify-center gap-3"
                                        style={{
                                            height: '80px',
                                            background: isPaused
                                                ? 'linear-gradient(to right, #4a7c59, #3a6b49)'
                                                : 'linear-gradient(to right, #8c6a3a, #7c5a2a)',
                                            borderColor: isPaused ? '#5a8c69' : '#9c7a4a',
                                            color: '#e8d5b0',
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                        }}
                                        data-pause-menu-button
                                        aria-label={isPaused ? 'Resume game' : 'Pause game'}
                                    >
                                        {isPaused ? (
                                            <>
                                                <Play className="w-6 h-6" />
                                                Resume Game
                                            </>
                                        ) : (
                                            <>
                                                <Pause className="w-6 h-6" />
                                                Pause Game
                                            </>
                                        )}
                                    </motion.button>

                                    {/* How to Play button */}
                                    <motion.button
                                        onClick={handleHowToPlay}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full rounded-xl border-2 shadow-lg transition-all duration-150 flex items-center justify-center gap-3"
                                        style={{
                                            height: '80px',
                                            background: 'linear-gradient(to right, #4a3020, #3a2515)',
                                            borderColor: '#b09060',
                                            color: '#e8d5b0',
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                        }}
                                        data-pause-menu-button
                                        aria-label="How to play"
                                    >
                                        <BookOpen className="w-6 h-6" />
                                        How to Play
                                    </motion.button>

                                    {/* Audio button */}
                                    <motion.button
                                        onClick={handleAudioSettings}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full rounded-xl border-2 shadow-lg transition-all duration-150 flex items-center justify-center gap-3"
                                        style={{
                                            height: '80px',
                                            background: 'linear-gradient(to right, #4a3020, #3a2515)',
                                            borderColor: '#b09060',
                                            color: '#e8d5b0',
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                        }}
                                        data-pause-menu-button
                                        aria-label="Audio settings"
                                    >
                                        <span className="text-2xl">🔊</span>
                                        Audio
                                    </motion.button>

                                    {/* Reset Farm button */}
                                    <motion.button
                                        onClick={handleResetFarm}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full rounded-xl border-2 shadow-lg transition-all duration-150 flex items-center justify-center gap-3"
                                        style={{
                                            height: '80px',
                                            background: 'linear-gradient(to right, #8c4a3a, #7c3a2a)',
                                            borderColor: '#9c5a4a',
                                            color: '#e8d5b0',
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                        }}
                                        data-pause-menu-button
                                        aria-label="Reset farm"
                                    >
                                        <RotateCcw className="w-6 h-6" />
                                        Reset Farm
                                    </motion.button>

                                    {/* Admin button */}
                                    <motion.button
                                        onClick={handleAdminAccess}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full rounded-xl border-2 shadow-lg transition-all duration-150 flex items-center justify-center gap-3"
                                        style={{
                                            height: '80px',
                                            background: 'linear-gradient(to right, #5a5a5a, #4a4a4a)',
                                            borderColor: '#6a6a6a',
                                            color: '#e8d5b0',
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                        }}
                                        data-pause-menu-button
                                        aria-label="Admin access"
                                    >
                                        <Shield className="w-6 h-6" />
                                        Admin
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* How to Play screen */}
                    {currentScreen === 'howToPlay' && (
                        <HowToPlay onBack={handleBackToMain} />
                    )}

                    {/* Reset Confirmation screen */}
                    {currentScreen === 'resetConfirm' && (
                        <ResetConfirmation
                            onCancel={handleBackToMain}
                            onConfirm={handleConfirmReset}
                        />
                    )}

                    {/* Audio Settings screen */}
                    {currentScreen === 'audio' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="relative rounded-2xl border-2 shadow-2xl flex flex-col"
                            style={{
                                width: '600px',
                                maxWidth: '90vw',
                                maxHeight: '90vh',
                                backgroundColor: 'rgba(58, 37, 24, 0.98)',
                                borderColor: '#b09060',
                            }}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="audio-title"
                        >
                            {/* Back button - fixed at top */}
                            <button
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Back button clicked');
                                    handleBackToMain();
                                }}
                                className="absolute top-4 left-4 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-110"
                                style={{
                                    backgroundColor: 'rgba(46, 26, 14, 0.95)',
                                    borderColor: '#b09060',
                                    color: '#e8d5b0',
                                    zIndex: 10,
                                    cursor: 'pointer',
                                    touchAction: 'none',
                                }}
                                aria-label="Back to settings"
                                type="button"
                            >
                                <X className="w-6 h-6" style={{ pointerEvents: 'none' }} />
                            </button>

                            {/* Scrollable content */}
                            <div className="overflow-y-auto" style={{ padding: '48px' }}>
                                {/* Title */}
                                <h2
                                    id="audio-title"
                                    className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3"
                                    style={{ color: '#e8d5b0' }}
                                >
                                    <span className="text-4xl">🔊</span>
                                    Audio Settings
                                </h2>

                                {/* Audio toggles */}
                                <div className="space-y-6">
                                    {/* Music toggle */}
                                    <div
                                        className="rounded-xl border-2 p-6 flex items-center justify-between"
                                        style={{
                                            backgroundColor: 'rgba(46, 26, 14, 0.6)',
                                            borderColor: '#b09060',
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">🎵</span>
                                            <span className="text-xl font-semibold" style={{ color: '#e8d5b0' }}>
                                                Background Music
                                            </span>
                                        </div>
                                        <motion.button
                                            onClick={() => {
                                                const newState = !musicEnabled;
                                                audioService.setMusicEnabled(newState);
                                                setMusicEnabled(newState);
                                                playSfx('click');
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="rounded-lg px-6 py-3 font-bold text-lg transition-all duration-150"
                                            style={{
                                                background: musicEnabled
                                                    ? 'linear-gradient(to right, #4a7c59, #3a6b49)'
                                                    : 'linear-gradient(to right, #8c4a3a, #7c3a2a)',
                                                borderColor: musicEnabled ? '#5a8c69' : '#9c5a4a',
                                                color: '#e8d5b0',
                                                border: '2px solid',
                                            }}
                                        >
                                            {musicEnabled ? 'ON' : 'OFF'}
                                        </motion.button>
                                    </div>

                                    {/* SFX toggle */}
                                    <div
                                        className="rounded-xl border-2 p-6 flex items-center justify-between"
                                        style={{
                                            backgroundColor: 'rgba(46, 26, 14, 0.6)',
                                            borderColor: '#b09060',
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">🔔</span>
                                            <span className="text-xl font-semibold" style={{ color: '#e8d5b0' }}>
                                                Sound Effects
                                            </span>
                                        </div>
                                        <motion.button
                                            onClick={() => {
                                                const newState = !sfxEnabled;
                                                audioService.setSfxEnabled(newState);
                                                setSfxEnabled(newState);
                                                playSfx('click');
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="rounded-lg px-6 py-3 font-bold text-lg transition-all duration-150"
                                            style={{
                                                background: sfxEnabled
                                                    ? 'linear-gradient(to right, #4a7c59, #3a6b49)'
                                                    : 'linear-gradient(to right, #8c4a3a, #7c3a2a)',
                                                borderColor: sfxEnabled ? '#5a8c69' : '#9c5a4a',
                                                color: '#e8d5b0',
                                                border: '2px solid',
                                            }}
                                        >
                                            {sfxEnabled ? 'ON' : 'OFF'}
                                        </motion.button>
                                    </div>

                                    {/* Info text */}
                                    <p
                                        className="text-center text-sm mt-6"
                                        style={{ color: '#b09060' }}
                                    >
                                        Audio settings are automatically saved
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}
        </AnimatePresence>
    );
}

// Settings button component for HUD
export function SettingsButton({ className = '' }) {
    const openGameModal = useStore((s) => s.ui.openGameModal);

    const handleClick = () => {
        playSfx('click');
        openGameModal('settings');
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            className={`p-2 ${className}`}
            title="Settings"
        >
            <SettingsIcon className="w-4 h-4" />
        </Button>
    );
}