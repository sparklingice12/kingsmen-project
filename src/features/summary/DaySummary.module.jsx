import { useEffect, useState } from 'react';
import { useStore } from '@/state/store';
import { X } from 'lucide-react';
import { getFeedback, getTips } from '@/features/sustainability';
import { getGoalsSummary } from '@/features/goals/goals.service';
import './DaySummary.css';

/**
 * DaySummary Component
 * 
 * Displays end-of-day summary with statistics and tips.
 * Shows crops grown, coins earned, and sustainability feedback.
 * Provides "Continue to Day X" button to advance.
 * 
 * Requirements: Session feedback, 2.3.5, 2.3.7
 */
export default function DaySummary() {
    const currentDay = useStore((s) => s.game.currentDay);
    const tiles = useStore((s) => s.farm.tiles);
    const inventory = useStore((s) => s.inventory);
    const sustainability = useStore((s) => s.sustainability);
    const goals = useStore((s) => s.session.goals);
    const closeGameModal = useStore((s) => s.ui.closeGameModal);
    const resumeGame = useStore((s) => s.game.resumeGame);
    const advanceDay = useStore((s) => s.game.advanceDay);
    const calculateDayScore = useStore((s) => s.sustainabilityActions.calculateDayScore);

    // Show the current day as the completed day
    const completedDay = currentDay;

    const [dayStats, setDayStats] = useState({
        cropsPlanted: 0,
        cropsHarvested: 0,
        coinsEarned: 0,
        sustainabilityScore: 0,
        tips: []
    });

    useEffect(() => {
        // Calculate sustainability score for the day
        const scoreResult = calculateDayScore();

        // Calculate day statistics
        const stats = calculateDayStats(tiles, inventory, scoreResult);
        setDayStats(stats);
    }, [tiles, inventory, calculateDayScore]);

    const feedback = getFeedback(dayStats.sustainabilityScore);
    const goalsSummary = getGoalsSummary(goals);

    const handleContinue = () => {
        closeGameModal();

        // Advance to next day (this will trigger the day transition effect)
        advanceDay();

        // Resume game after a short delay to let transition start
        setTimeout(() => {
            resumeGame();
        }, 100);
    };

    return (
        <div className="day-summary">
            <div className="day-summary__overlay" onClick={handleContinue} />

            <div className="day-summary__modal">
                {/* Header */}
                <div className="day-summary__header">
                    <h2 className="day-summary__title">
                        Day {completedDay} Complete! 🌅
                    </h2>
                    <button
                        className="day-summary__close"
                        onClick={handleContinue}
                        aria-label="Close summary"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="day-summary__stats">
                    <StatCard
                        icon="🌱"
                        label="Crops Planted"
                        value={dayStats.cropsPlanted}
                    />
                    <StatCard
                        icon="🌾"
                        label="Crops Harvested"
                        value={dayStats.cropsHarvested}
                    />
                    <StatCard
                        icon="💰"
                        label="Coins Earned"
                        value={dayStats.coinsEarned}
                    />
                    <StatCard
                        icon="♻️"
                        label="Sustainability"
                        value={`${dayStats.sustainabilityScore}%`}
                    />
                </div>

                {/* Sustainability Feedback */}
                {feedback && dayStats.sustainabilityScore >= 60 && (
                    <div className="day-summary__achievement">
                        <span className="day-summary__achievement-icon">
                            {feedback.badge ? '🌱' : '♻️'}
                        </span>
                        <div className="day-summary__achievement-text">
                            <strong>{feedback.level === 'excellent' ? 'Excellent!' : 'Good Work!'}</strong>
                            <p>{feedback.message}</p>
                        </div>
                    </div>
                )}

                {/* Goals Progress */}
                {goalsSummary.completed > 0 && (
                    <div className="day-summary__goals">
                        <h3 className="day-summary__goals-title">
                            🏆 Goals Progress ({goalsSummary.completed}/{goalsSummary.total})
                        </h3>
                        <div className="day-summary__goals-list">
                            {goalsSummary.completedGoals.map((goal) => (
                                <div key={goal.id} className="day-summary__goal-item">
                                    <span className="day-summary__goal-check">✓</span>
                                    <div className="day-summary__goal-info">
                                        <strong>{goal.title}</strong>
                                        <span className="day-summary__goal-reward">
                                            🎁 {goal.reward}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tips Section */}
                {dayStats.tips.length > 0 && (
                    <div className="day-summary__tips">
                        <h3 className="day-summary__tips-title">💡 Tips for Tomorrow</h3>
                        <ul className="day-summary__tips-list">
                            {dayStats.tips.map((tip, index) => (
                                <li key={index} className="day-summary__tip">
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Continue Button */}
                <button
                    className="day-summary__continue"
                    onClick={handleContinue}
                >
                    Continue to Day {currentDay + 1} →
                </button>
            </div>
        </div>
    );
}

/**
 * StatCard Component
 * Displays a single statistic with icon and label
 */
function StatCard({ icon, label, value }) {
    return (
        <div className="day-summary__stat-card">
            <div className="day-summary__stat-icon">{icon}</div>
            <div className="day-summary__stat-content">
                <div className="day-summary__stat-value">{value}</div>
                <div className="day-summary__stat-label">{label}</div>
            </div>
        </div>
    );
}

/**
 * Calculate day statistics and generate tips
 */
function calculateDayStats(tiles, inventory, scoreResult) {
    const stats = {
        cropsPlanted: 0,
        cropsHarvested: 0,
        coinsEarned: 0,
        sustainabilityScore: 0,
        tips: []
    };

    // Count planted crops
    const plantedTiles = tiles.filter(t => t.crop !== null);
    stats.cropsPlanted = plantedTiles.length;

    // Count harvested crops (from inventory)
    stats.cropsHarvested = Object.values(inventory.harvested).reduce((sum, count) => sum + count, 0);

    // Calculate coins earned (simplified - would need day tracking in real implementation)
    stats.coinsEarned = inventory.coins;

    // Use sustainability score from the system
    stats.sustainabilityScore = scoreResult?.totalScore || 0;

    // Generate contextual tips using the sustainability system
    const dayData = scoreResult?.dayScore || {};
    stats.tips = getTips({
        cropsPlanted: [], // Empty array since we don't have the actual crop types
        witheredCrops: dayData.witheredCrops || 0,
        overWateredTiles: dayData.overWateredTiles || 0,
        totalScore: stats.sustainabilityScore
    });

    return stats;
}
