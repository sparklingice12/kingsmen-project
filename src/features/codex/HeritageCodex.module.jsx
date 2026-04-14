import { useState, useEffect } from 'react';
import { useStore } from '@/state/store';
import { motion, AnimatePresence } from 'framer-motion';
import { CODEX_CONFIG, CODEX_ENTRIES } from './codex.config';
import {
    isEntryUnlocked,
    getUnlockedEntriesByCategory,
    getLockedEntriesByCategory,
    getUnlockHint,
    getUnlockProgress,
} from './codex.service';
import './HeritageCodex.css';

/**
 * Heritage Codex Component
 * 
 * Encyclopedia modal with category tabs showing farming knowledge.
 * Entries are unlocked through gameplay achievements.
 * 
 * Requirements: 2.5.2, 2.5.3, 2.5.4, 2.5.5
 */
function HeritageCodex() {
    const modalOpen = useStore((s) => s.ui.modalOpen);
    const modalData = useStore((s) => s.ui.modalData);
    const closeGameModal = useStore((s) => s.ui.closeGameModal);
    const pauseGame = useStore((s) => s.game.pauseGame);
    const resumeGame = useStore((s) => s.game.resumeGame);

    // Local state
    const [selectedCategory, setSelectedCategory] = useState(CODEX_CONFIG.CATEGORIES.CROPS);
    const [selectedEntry, setSelectedEntry] = useState(null);

    // Pause game when modal is open
    useEffect(() => {
        if (modalOpen === 'codex') {
            pauseGame();

            // If modalData has an entryId, open that entry directly
            if (modalData?.entryId) {
                // Get current game state for unlock checking
                const currentState = useStore.getState();
                const gameState = {
                    game: currentState.game,
                    farm: currentState.farm,
                    inventory: currentState.inventory,
                    session: currentState.session,
                };

                const entry = CODEX_ENTRIES.find(e => e.id === modalData.entryId);
                if (entry && isEntryUnlocked(entry, gameState)) {
                    setSelectedEntry(entry);
                    setSelectedCategory(entry.category);
                }
            }
        } else {
            resumeGame();
            setSelectedEntry(null);
        }
    }, [modalOpen, modalData, pauseGame, resumeGame]);

    // Handle backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeGameModal();
        }
    };

    // Handle close button
    const handleClose = () => {
        closeGameModal();
    };

    // Handle entry click
    const handleEntryClick = (entry) => {
        // Get current game state for unlock checking
        const currentState = useStore.getState();
        const gameState = {
            game: currentState.game,
            farm: currentState.farm,
            inventory: currentState.inventory,
            session: currentState.session,
        };

        if (isEntryUnlocked(entry, gameState)) {
            setSelectedEntry(entry);
        }
    };

    // Handle back to list
    const handleBackToList = () => {
        setSelectedEntry(null);
    };

    if (modalOpen !== 'codex') {
        return null;
    }

    // Get current game state for unlock checking
    const currentState = useStore.getState();
    const gameState = {
        game: currentState.game,
        farm: currentState.farm,
        inventory: currentState.inventory,
        session: currentState.session,
    };

    // Get entries for selected category
    const unlockedEntries = getUnlockedEntriesByCategory(selectedCategory, gameState);
    const lockedEntries = getLockedEntriesByCategory(selectedCategory, gameState);
    const allCategoryEntries = [...unlockedEntries, ...lockedEntries];

    // Category labels
    const categoryLabels = {
        [CODEX_CONFIG.CATEGORIES.CROPS]: '🌾 Crops',
        [CODEX_CONFIG.CATEGORIES.SOIL]: '🌱 Soil',
        [CODEX_CONFIG.CATEGORIES.SUSTAINABILITY]: '♻️ Sustainability',
        [CODEX_CONFIG.CATEGORIES.HISTORY]: '📜 History',
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="codex__backdrop"
                onClick={handleBackdropClick}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="codex__container"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        className="codex__close"
                        onClick={handleClose}
                        aria-label="Close Heritage Codex"
                    >
                        ✕
                    </button>

                    {/* Header */}
                    <div className="codex__header">
                        <h1 className="codex__title">
                            📚 Heritage Codex
                        </h1>
                        <p className="codex__subtitle">
                            Encyclopedia of Farming Knowledge
                        </p>
                    </div>

                    {/* Show entry detail view or list view */}
                    {selectedEntry ? (
                        <EntryDetailView
                            entry={selectedEntry}
                            onBack={handleBackToList}
                        />
                    ) : (
                        <>
                            {/* Category Tabs */}
                            <div className="codex__tabs">
                                {Object.values(CODEX_CONFIG.CATEGORIES).map((category) => {
                                    const unlocked = getUnlockedEntriesByCategory(category, gameState).length;
                                    const total = CODEX_ENTRIES.filter(e => e.category === category).length;

                                    return (
                                        <button
                                            key={category}
                                            className={`codex__tab ${selectedCategory === category ? 'active' : ''}`}
                                            onClick={() => setSelectedCategory(category)}
                                        >
                                            <span className="codex__tab-label">
                                                {categoryLabels[category]}
                                            </span>
                                            <span className="codex__tab-count">
                                                {unlocked}/{total}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Entry List */}
                            <div className="codex__content">
                                <div className="codex__entry-list">
                                    {allCategoryEntries.map((entry) => {
                                        const unlocked = isEntryUnlocked(entry, gameState);
                                        const progress = unlocked ? null : getUnlockProgress(entry, gameState);

                                        return (
                                            <motion.div
                                                key={entry.id}
                                                className={`codex__entry-card ${unlocked ? 'unlocked' : 'locked'}`}
                                                onClick={() => handleEntryClick(entry)}
                                                whileHover={unlocked ? { scale: 1.02 } : {}}
                                                whileTap={unlocked ? { scale: 0.98 } : {}}
                                            >
                                                <div className="codex__entry-header">
                                                    <h3 className="codex__entry-title">
                                                        {unlocked ? entry.title : '🔒 Locked Entry'}
                                                    </h3>
                                                </div>

                                                {unlocked ? (
                                                    <p className="codex__entry-preview">
                                                        {entry.content.substring(0, 120)}...
                                                    </p>
                                                ) : (
                                                    <div className="codex__entry-locked">
                                                        <p className="codex__unlock-hint">
                                                            {getUnlockHint(entry)}
                                                        </p>
                                                        {progress && progress.percentage > 0 && (
                                                            <div className="codex__unlock-progress">
                                                                <div className="codex__progress-bar">
                                                                    <div
                                                                        className="codex__progress-fill"
                                                                        style={{ width: `${progress.percentage}%` }}
                                                                    />
                                                                </div>
                                                                <span className="codex__progress-text">
                                                                    {progress.current}/{progress.required}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {unlocked && (
                                                    <div className="codex__entry-footer">
                                                        <span className="codex__read-more">
                                                            Read more →
                                                        </span>
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * Illustration Image Component
 * 
 * Handles image loading, errors, and fallback to placeholder
 */
function IllustrationImage({ src, alt, title }) {
    const [imageStatus, setImageStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'

    useEffect(() => {
        setImageStatus('loading');

        const img = new Image();
        img.onload = () => setImageStatus('loaded');
        img.onerror = () => setImageStatus('error');
        img.src = src;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src]);

    if (imageStatus === 'loading') {
        return (
            <div className="codex__illustration-placeholder">
                <div className="codex__illustration-loading">
                    <span className="codex__loading-spinner">⏳</span>
                    <p className="codex__loading-text">Loading illustration...</p>
                </div>
            </div>
        );
    }

    if (imageStatus === 'error') {
        return (
            <div className="codex__illustration-placeholder">
                <span className="codex__illustration-icon">🖼️</span>
                <p className="codex__illustration-text">
                    Illustration: {src}
                </p>
                <p className="codex__illustration-hint">
                    (Image not yet available)
                </p>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            title={title}
            className="codex__illustration-image"
        />
    );
}

/**
 * Entry Detail View Component
 * 
 * Shows full content of a selected encyclopedia entry
 */
function EntryDetailView({ entry, onBack }) {
    return (
        <div className="codex__detail">
            {/* Back Button */}
            <button
                className="codex__back-button"
                onClick={onBack}
            >
                ← Back to List
            </button>

            {/* Entry Content */}
            <div className="codex__detail-content">
                <h2 className="codex__detail-title">{entry.title}</h2>

                {/* Illustration */}
                <div className="codex__detail-illustration">
                    <IllustrationImage
                        src={entry.illustration}
                        alt={entry.title}
                        title={entry.title}
                    />
                </div>

                {/* Full Content */}
                <div className="codex__detail-text">
                    {entry.content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="codex__detail-paragraph">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HeritageCodex;
