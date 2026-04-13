import { useEffect } from 'react';
import { useStore } from '@/state/store';
import { CROPS_CONFIG } from '@/features/crops/crops.config';
import { ANIMALS_CONFIG } from '@/features/animals/animals.config';
import { motion, AnimatePresence } from 'framer-motion';
import './EducationalModal.css';

/**
 * Educational Modal Component
 * 
 * Shows educational content when a crop is tapped:
 * - Crop title, description, and facts
 * - Close button and backdrop dismiss
 * - Pauses game time while open
 * - Tracks modal opens in session analytics
 * 
 * Requirements: 1.7.1, 1.7.2, 1.7.3, 1.7.4, 1.7.5, 1.7.6
 */
function EducationalModal() {
    const modalOpen = useStore((s) => s.ui.modalOpen);
    const modalData = useStore((s) => s.ui.modalData);
    const closeGameModal = useStore((s) => s.ui.closeGameModal);
    const pauseGame = useStore((s) => s.game.pauseGame);
    const resumeGame = useStore((s) => s.game.resumeGame);
    const trackModalView = useStore((s) => s.session.trackModalView);
    const tiles = useStore((s) => s.farm.tiles);

    // Get crop or animal data
    const cropId = modalData?.cropId;
    const tileId = modalData?.tileId;
    const type = modalData?.type; // 'crop' or 'chicken'
    const chickenId = modalData?.chickenId;

    const crop = cropId ? CROPS_CONFIG.CROPS[cropId] : null;
    const animalContent = type === 'chicken' ? ANIMALS_CONFIG.chicken.educationalContent : null;

    // Get tile data for growth stage information (crops only)
    const tile = tileId !== undefined ? tiles.find(t => t.id === tileId) : null;
    const currentStage = tile?.growthStage || 0;
    const maxStage = crop?.stages || 4;
    const isFullyGrown = currentStage >= maxStage;

    // Calculate days until harvest (simplified for demo)
    const daysUntilHarvest = isFullyGrown ? 0 : maxStage - currentStage;

    // Get chicken data if applicable
    const chickens = useStore((s) => s.animals.chickens);
    const chicken = chickenId !== undefined ? chickens.find(c => c.id === chickenId) : null;
    const feedChicken = useStore((s) => s.animals.feedChicken);

    // Pause game when modal is open
    useEffect(() => {
        if (modalOpen === 'educational' && (cropId || type === 'chicken')) {
            if (pauseGame) pauseGame();

            // Track modal view in analytics
            if (cropId && trackModalView) {
                trackModalView(cropId);
            }
        } else {
            if (resumeGame) resumeGame();
        }
    }, [modalOpen, cropId, type, pauseGame, resumeGame, trackModalView]);

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

    if ((!crop && !animalContent) || modalOpen !== 'educational') {
        return null;
    }

    // Determine content to display
    const content = animalContent || crop?.education;
    const title = animalContent ? animalContent.title : crop?.education.title;
    const icon = animalContent ? '🐔' : crop?.icon;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="educational-modal__backdrop"
                onClick={handleBackdropClick}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="educational-modal__content"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        className="educational-modal__close"
                        onClick={handleClose}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>

                    {/* Header */}
                    <div className="educational-modal__header">
                        <span className="educational-modal__icon">{icon}</span>
                        <h2 className="educational-modal__title">{title}</h2>
                    </div>

                    {/* Description */}
                    <div className="educational-modal__body">
                        <p className="educational-modal__description">
                            {content.description}
                        </p>

                        {/* Chicken-specific content */}
                        {type === 'chicken' && chicken && (
                            <div className="educational-modal__chicken-info">
                                <h3 className="educational-modal__section-title">Chicken Status</h3>
                                <div className="educational-modal__chicken-status">
                                    <p>
                                        <strong>Fed today:</strong> {chicken.fed ? '✅ Yes' : '❌ No'}
                                    </p>
                                    {!chicken.fed && (
                                        <button
                                            className="educational-modal__button educational-modal__button--feed"
                                            onClick={() => {
                                                feedChicken(chicken.id);
                                                useStore.getState().ui.setFeedback({
                                                    success: true,
                                                    message: '🐔 Chicken fed! It will lay an egg tomorrow.',
                                                    timestamp: Date.now()
                                                });
                                            }}
                                        >
                                            🌽 Feed Chicken
                                        </button>
                                    )}
                                    {chicken.fed && (
                                        <p className="educational-modal__fed-message">
                                            ✨ This chicken has been fed today and will lay an egg tomorrow!
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Growth Stage Information (crops only) */}
                        {tile && crop && (
                            <div className="educational-modal__growth-info">
                                <h3 className="educational-modal__section-title">Growth Progress</h3>
                                <div className="educational-modal__growth-bar">
                                    <div className="educational-modal__growth-stages">
                                        {[...Array(maxStage)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`educational-modal__growth-stage ${i < currentStage ? 'completed' : ''
                                                    } ${i === currentStage ? 'current' : ''}`}
                                            >
                                                <span className="educational-modal__stage-icon">
                                                    {i < currentStage ? '✓' : crop.icon}
                                                </span>
                                                <span className="educational-modal__stage-label">
                                                    Stage {i + 1}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <p className="educational-modal__growth-status">
                                    {isFullyGrown ? (
                                        <span className="educational-modal__ready">🎉 Ready to harvest!</span>
                                    ) : (
                                        <span>
                                            {daysUntilHarvest} {daysUntilHarvest === 1 ? 'stage' : 'stages'} until harvest
                                        </span>
                                    )}
                                </p>
                            </div>
                        )}

                        {/* Origin */}
                        {content.origin && (
                            <div className="educational-modal__section">
                                <h3 className="educational-modal__section-title">🌍 Origin</h3>
                                <p className="educational-modal__section-text">
                                    {content.origin}
                                </p>
                            </div>
                        )}

                        {/* Nutrition */}
                        {content.nutrition && (
                            <div className="educational-modal__section">
                                <h3 className="educational-modal__section-title">🥗 Nutrition</h3>
                                <p className="educational-modal__section-text">
                                    {content.nutrition}
                                </p>
                            </div>
                        )}

                        {/* Sustainability */}
                        {content.sustainability && (
                            <div className="educational-modal__section">
                                <h3 className="educational-modal__section-title">♻️ Sustainability</h3>
                                <p className="educational-modal__section-text">
                                    {content.sustainability}
                                </p>
                            </div>
                        )}

                        {/* Facts */}
                        {content.facts && content.facts.length > 0 && (
                            <div className="educational-modal__facts">
                                <h3 className="educational-modal__facts-title">Did you know?</h3>
                                <ul className="educational-modal__facts-list">
                                    {content.facts.map((fact, index) => (
                                        <li key={index} className="educational-modal__fact">
                                            <span className="educational-modal__fact-bullet">
                                                {type === 'chicken' ? '🐔' : '🌱'}
                                            </span>
                                            {fact}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="educational-modal__footer">
                        {crop && (
                            <button
                                className="educational-modal__button educational-modal__button--secondary"
                                onClick={() => {
                                    // Open Heritage Codex with the crop entry
                                    // Map crop IDs to codex entry IDs
                                    const codexEntryMap = {
                                        'wheat': 'wheat-basics',
                                        'carrot': 'carrot-cultivation',
                                        'tomato': 'tomato-science',
                                        'bean': 'bean-nitrogen',
                                    };
                                    const entryId = codexEntryMap[cropId];

                                    if (entryId) {
                                        const openGameModal = useStore.getState().ui.openGameModal;
                                        closeGameModal();
                                        openGameModal('codex', { entryId });
                                    }
                                }}
                                title="Learn more in the Heritage Codex"
                            >
                                📚 Learn More
                            </button>
                        )}
                        <button
                            className="educational-modal__button"
                            onClick={handleClose}
                        >
                            Continue Farming
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default EducationalModal;
