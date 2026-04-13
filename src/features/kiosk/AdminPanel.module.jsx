import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    getAnalyticsExport,
    clearAnalyticsData,
    downloadAnalyticsExport
} from './kiosk.config';
import {
    formatDuration,
    performSessionReset,
    getPreservedSessions,
    getResetHistory,
    clearPreservedSessions
} from './kiosk.service';
import { useStore } from '@/state/store';

/**
 * AdminPanel Component
 * Hidden admin interface for museum curators to manage analytics and system settings
 * Accessed via hidden button combination (Ctrl+Shift+A)
 */
export default function AdminPanel({ isOpen, onClose }) {
    const [analytics, setAnalytics] = useState(null);
    const [preservedSessions, setPreservedSessions] = useState([]);
    const [resetHistory, setResetHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Load analytics data
    const loadAnalytics = async () => {
        setLoading(true);
        try {
            const data = getAnalyticsExport();
            setAnalytics(data);

            // Also load preserved sessions and reset history
            const preserved = getPreservedSessions();
            const resets = getResetHistory();

            setPreservedSessions(preserved);
            setResetHistory(resets);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle analytics export
    const handleExport = () => {
        try {
            downloadAnalyticsExport();
        } catch (error) {
            console.error('Failed to export analytics:', error);
            alert('Failed to export analytics data');
        }
    };

    // Handle preserved sessions export
    const handleExportPreservedSessions = () => {
        try {
            const data = {
                exportDate: new Date().toISOString(),
                preservedSessions: getPreservedSessions(),
                resetHistory: getResetHistory(),
                totalSessions: getPreservedSessions().length,
                totalResets: getResetHistory().length,
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `heritage-harvest-preserved-sessions-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(url);
            console.log('📊 Preserved sessions exported');
        } catch (error) {
            console.error('Failed to export preserved sessions:', error);
            alert('Failed to export preserved sessions');
        }
    };

    // Handle data clearing
    const handleClearData = () => {
        if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
            clearAnalyticsData();
            setAnalytics(null);
            alert('Analytics data cleared successfully');
        }
    };

    // Handle clearing preserved sessions
    const handleClearPreservedSessions = () => {
        if (confirm('Are you sure you want to clear all preserved session data? This cannot be undone.')) {
            clearPreservedSessions();
            setPreservedSessions([]);
            alert('Preserved sessions cleared successfully');
        }
    };

    // Manual reset function
    const handleManualReset = () => {
        if (confirm('Are you sure you want to manually reset the current session? Analytics will be preserved.')) {
            try {
                // Use the comprehensive reset function that preserves analytics
                const result = performSessionReset(useStore, 'manual');

                if (result.success) {
                    onClose();
                    alert('Session reset successfully. Analytics have been preserved.');
                } else {
                    alert('Session reset failed. Please try again.');
                }
            } catch (error) {
                console.error('Manual reset failed:', error);
                alert('Session reset failed: ' + error.message);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4">
            <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl">Heritage Harvest - Admin Panel</CardTitle>
                    <Button onClick={onClose} variant="outline">
                        Close
                    </Button>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* System Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Button
                            onClick={loadAnalytics}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Loading...' : 'Load All Data'}
                        </Button>

                        <Button
                            onClick={handleExport}
                            variant="outline"
                            className="w-full"
                        >
                            Export Analytics
                        </Button>

                        <Button
                            onClick={handleExportPreservedSessions}
                            variant="outline"
                            className="w-full"
                        >
                            Export Sessions
                        </Button>

                        <Button
                            onClick={handleManualReset}
                            variant="destructive"
                            className="w-full"
                        >
                            Manual Reset
                        </Button>
                    </div>

                    {/* Tabbed Content */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="sessions">
                                Preserved Sessions ({preservedSessions.length})
                            </TabsTrigger>
                            <TabsTrigger value="resets">
                                Reset History ({resetHistory.length})
                            </TabsTrigger>
                            <TabsTrigger value="system">System Info</TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-4">
                            {analytics ? (
                                <>
                                    <h3 className="text-lg font-semibold">Analytics Summary</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="text-2xl font-bold">{analytics.totalResets}</div>
                                                <div className="text-sm text-gray-600">Total Resets</div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="text-2xl font-bold">
                                                    {formatDuration(analytics.averageSessionDuration)}
                                                </div>
                                                <div className="text-sm text-gray-600">Avg Session</div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="text-2xl font-bold">
                                                    {analytics.sessionAnalytics.cropsPlanted || 0}
                                                </div>
                                                <div className="text-sm text-gray-600">Crops Planted</div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="text-2xl font-bold">
                                                    {analytics.sessionAnalytics.cropsHarvested || 0}
                                                </div>
                                                <div className="text-sm text-gray-600">Crops Harvested</div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    Click "Load All Data" to view analytics
                                </div>
                            )}
                        </TabsContent>

                        {/* Preserved Sessions Tab */}
                        <TabsContent value="sessions" className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Preserved Session Data</h3>
                                <Button
                                    onClick={handleClearPreservedSessions}
                                    variant="destructive"
                                    size="sm"
                                >
                                    Clear All Sessions
                                </Button>
                            </div>

                            {preservedSessions.length > 0 ? (
                                <div className="max-h-96 overflow-y-auto space-y-4">
                                    {preservedSessions.slice().reverse().map((session, index) => (
                                        <Card key={index} className="bg-gray-50 dark:bg-gray-900">
                                            <CardContent className="p-4">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <strong>Date:</strong>
                                                        <div>{new Date(session.timestamp).toLocaleString()}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Duration:</strong>
                                                        <div>{formatDuration(session.sessionSummary?.sessionDuration * 1000 || 0)}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Crops Planted:</strong>
                                                        <div>{session.sessionSummary?.cropsPlanted || 0}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Crops Harvested:</strong>
                                                        <div>{session.sessionSummary?.cropsHarvested || 0}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Modals Opened:</strong>
                                                        <div>{session.sessionSummary?.modalsOpened || 0}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Codex Entries:</strong>
                                                        <div>{session.sessionSummary?.codexEntriesUnlocked || 0}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Sustainability:</strong>
                                                        <div>{session.sessionSummary?.finalSustainabilityScore || 0}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Viewed Modals:</strong>
                                                        <div>{session.sessionSummary?.viewedModals || 0}</div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No preserved sessions found. Sessions are saved when the game resets.
                                </div>
                            )}
                        </TabsContent>

                        {/* Reset History Tab */}
                        <TabsContent value="resets" className="space-y-4">
                            <h3 className="text-lg font-semibold">Reset Event History</h3>

                            {resetHistory.length > 0 ? (
                                <div className="max-h-96 overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <thead className="sticky top-0 bg-white dark:bg-gray-800">
                                            <tr className="border-b">
                                                <th className="text-left p-2">Date & Time</th>
                                                <th className="text-left p-2">Reason</th>
                                                <th className="text-left p-2">Session Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {resetHistory.slice().reverse().map((reset, index) => (
                                                <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                                                    <td className="p-2">
                                                        {new Date(reset.timestamp).toLocaleString()}
                                                    </td>
                                                    <td className="p-2">
                                                        <span className={`px-2 py-1 rounded text-xs ${reset.reason === 'inactivity'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : reset.reason === 'manual'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {reset.reason}
                                                        </span>
                                                    </td>
                                                    <td className="p-2">
                                                        {formatDuration(reset.sessionDuration)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No reset events recorded yet.
                                </div>
                            )}
                        </TabsContent>

                        {/* System Info Tab */}
                        <TabsContent value="system" className="space-y-4">
                            <h3 className="text-lg font-semibold">System Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <Card>
                                    <CardContent className="p-4 space-y-2">
                                        <div>
                                            <strong>Export Date:</strong>
                                            <div className="text-gray-600">{analytics?.exportDate || 'Not loaded'}</div>
                                        </div>
                                        <div>
                                            <strong>Total Preserved Sessions:</strong>
                                            <div className="text-gray-600">{preservedSessions.length}</div>
                                        </div>
                                        <div>
                                            <strong>Total Reset Events:</strong>
                                            <div className="text-gray-600">{resetHistory.length}</div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4 space-y-2">
                                        <div>
                                            <strong>Screen Resolution:</strong>
                                            <div className="text-gray-600">{screen.width}×{screen.height}</div>
                                        </div>
                                        <div>
                                            <strong>Viewport:</strong>
                                            <div className="text-gray-600">{window.innerWidth}×{window.innerHeight}</div>
                                        </div>
                                        <div>
                                            <strong>User Agent:</strong>
                                            <div className="text-gray-600 text-xs break-all">
                                                {navigator.userAgent.substring(0, 100)}...
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Danger Zone */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                                <div className="space-y-2">
                                    <Button
                                        onClick={handleClearData}
                                        variant="destructive"
                                        className="w-full"
                                    >
                                        Clear All Analytics Data
                                    </Button>
                                    <p className="text-sm text-gray-600">
                                        This will permanently delete all stored analytics data. This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}