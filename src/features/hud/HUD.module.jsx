import { useStore } from '@/state/store';
import { SettingsButton } from '@/features/settings';
import AudioToggle from '@/features/audio/components/AudioToggle';
import './HUD.css';

/**
 * HUD Component
 * 
 * Displays game information in the top-left corner:
 * - Current day number
 * - Time of day label (Morning/Midday/Afternoon/Evening)
 * - Progress bar showing day cycle completion
 * - Codex button to open Heritage Codex
 * 
 * Requirements: 1.6.4, 1.5.4, 2.5.5
 */
function HUD() {
    const currentDay = useStore((s) => s.game.currentDay);
    const timeOfDay = useStore((s) => s.game.timeOfDay);
    const sustainability = useStore((s) => s.sustainability);
    const openGameModal = useStore((s) => s.ui.openGameModal);

    // Calculate time of day label
    const getTimeLabel = (time) => {
        if (time < 0.25) return 'Morning';
        if (time < 0.5) return 'Midday';
        if (time < 0.75) return 'Afternoon';
        return 'Evening';
    };

    const timeLabel = getTimeLabel(timeOfDay);
    const progressPercent = (timeOfDay * 100).toFixed(1);

    // Handle Codex button click
    const handleCodexClick = () => {
        openGameModal('codex', null);
    };

    // Handle Sustainability button click
    const handleSustainabilityClick = () => {
        openGameModal('sustainability', null);
    };

    // Get score color
    const getScoreColor = (score) => {
        if (score >= 80) return '#4ade80'; // green
        if (score >= 60) return '#fbbf24'; // yellow
        if (score >= 40) return '#fb923c'; // orange
        return '#ef4444'; // red
    };

    return (
        <div className="hud">
            <div className="hud__content">
                {/* Day Counter */}
                <div className="hud__day">
                    <span className="hud__label">Day</span>
                    <span className="hud__value">{currentDay}</span>
                </div>

                {/* Time of Day */}
                <div className="hud__time">
                    <span className="hud__time-label">{timeLabel}</span>
                </div>

                {/* Progress Bar */}
                <div className="hud__progress">
                    <div className="hud__progress-bar">
                        <div
                            className="hud__progress-fill"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <span className="hud__progress-text">{progressPercent}%</span>
                </div>

                {/* Codex Button */}
                <button
                    className="hud__codex-button"
                    onClick={handleCodexClick}
                    title="Open Heritage Codex"
                >
                    <span className="hud__codex-icon">📚</span>
                    <span className="hud__codex-label">Codex</span>
                </button>

                {/* Sustainability Score Button */}
                <button
                    className="hud__sustainability-button"
                    onClick={handleSustainabilityClick}
                    title="View Sustainability Score"
                >
                    <span className="hud__sustainability-icon">♻️</span>
                    <span
                        className="hud__sustainability-score"
                        style={{ color: getScoreColor(sustainability.currentScore) }}
                    >
                        {sustainability.currentScore}
                    </span>
                </button>

                {/* Audio Controls */}
                <div className="hud__audio-controls">
                    <AudioToggle />
                    <SettingsButton />
                </div>
            </div>
        </div>
    );
}

export default HUD;
