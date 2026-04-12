/**
 * Sustainability Feedback Component
 * 
 * Displays sustainability score and feedback at end of session
 */

import { useStore } from '@/state/store';
import { getFeedback, getTips } from './sustainability.service';
import { SUSTAINABILITY_CONFIG } from './sustainability.config';
import './SustainabilityFeedback.css';

export default function SustainabilityFeedback({ onClose }) {
    const sustainability = useStore((s) => s.sustainability);
    const currentDay = useStore((s) => s.game.currentDay);

    const { currentScore, achievementUnlocked, dailyScores } = sustainability;
    const feedback = getFeedback(currentScore);

    // Get tips based on recent activities
    const recentDayData = dailyScores.length > 0
        ? dailyScores[dailyScores.length - 1]
        : {};

    const tips = getTips({
        cropsPlanted: recentDayData.uniqueCropsCount || 0,
        witheredCrops: recentDayData.witheredCrops || 0,
        overWateredTiles: recentDayData.overWateredTiles || 0,
        totalScore: currentScore
    });

    // Calculate score color
    const getScoreColor = (score) => {
        if (score >= 80) return '#4ade80'; // green
        if (score >= 60) return '#fbbf24'; // yellow
        if (score >= 40) return '#fb923c'; // orange
        return '#ef4444'; // red
    };

    return (
        <div className="sustainability-feedback-overlay">
            <div className="sustainability-feedback-modal">
                <div className="sustainability-feedback-header">
                    <h2>Sustainability Report</h2>
                    <button
                        className="close-button"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="sustainability-feedback-content">
                    {/* Score Display */}
                    <div className="score-section">
                        <div className="score-circle" style={{ borderColor: getScoreColor(currentScore) }}>
                            <div className="score-value" style={{ color: getScoreColor(currentScore) }}>
                                {currentScore}
                            </div>
                            <div className="score-label">Sustainability Score</div>
                        </div>

                        <div className="score-feedback">
                            <p className={`feedback-message feedback-${feedback.level}`}>
                                {feedback.message}
                            </p>
                        </div>
                    </div>

                    {/* Achievement Badge */}
                    {achievementUnlocked && feedback.badge && (
                        <div className="achievement-section">
                            <div className="achievement-badge">
                                <div className="badge-icon">🌱</div>
                                <div className="badge-text">
                                    <div className="badge-title">Achievement Unlocked!</div>
                                    <div className="badge-name">{feedback.badge}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Score Breakdown */}
                    {dailyScores.length > 0 && (
                        <div className="breakdown-section">
                            <h3>Your Farming Journey</h3>
                            <div className="daily-scores">
                                {dailyScores.map((day, index) => (
                                    <div key={index} className="day-score">
                                        <span className="day-label">Day {index + 1}</span>
                                        <div className="day-bar">
                                            <div
                                                className="day-bar-fill"
                                                style={{
                                                    width: `${Math.min(100, (day.score / 27) * 100)}%`,
                                                    backgroundColor: getScoreColor((day.score / 27) * 100)
                                                }}
                                            />
                                        </div>
                                        <span className="day-points">+{day.score}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tips Section */}
                    {tips.length > 0 && (
                        <div className="tips-section">
                            <h3>Tips for Sustainable Farming</h3>
                            <ul className="tips-list">
                                {tips.map((tip, index) => (
                                    <li key={index} className="tip-item">
                                        <span className="tip-icon">💡</span>
                                        <span className="tip-text">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Stats Summary */}
                    <div className="stats-section">
                        <div className="stat-item">
                            <div className="stat-value">{currentDay - 1}</div>
                            <div className="stat-label">Days Farmed</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">
                                {dailyScores.reduce((sum, day) => sum + (day.uniqueCropsCount || 0), 0)}
                            </div>
                            <div className="stat-label">Crops Planted</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">
                                {dailyScores.reduce((sum, day) => sum + (day.witheredCrops || 0), 0)}
                            </div>
                            <div className="stat-label">Crops Withered</div>
                        </div>
                    </div>
                </div>

                <div className="sustainability-feedback-footer">
                    <button
                        className="continue-button"
                        onClick={onClose}
                    >
                        Continue Farming
                    </button>
                </div>
            </div>
        </div>
    );
}
