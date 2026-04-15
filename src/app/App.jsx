import { AnimatePresence } from 'framer-motion';
import { useStore } from '@/state/store';
import { EndSessionConfirmation } from '@/components/shared/EndSessionConfirmation';
import { HeritageHarvestGame } from '@/features/game';
import { EducationalModal } from '@/features/education';
import { AdminPanel, useAdminPanel, useFullscreen, useKioskLockdown } from '@/features/kiosk';
import { Leva, useControls } from 'leva';
import { useDebugMode } from '@/features/debug/useDebugMode';
import { useEffect } from 'react';


export default function App() {
    const { modal, closeModal } = useStore((s) => s.ui);
    const isDebugMode = useDebugMode();
    const { isOpen: isAdminOpen, closePanel: closeAdminPanel } = useAdminPanel();

    // Kiosk features - only enable in production (not in debug mode)
    // OR when ?kiosk=true is in the URL (for testing in development)
    const isProduction = import.meta.env.PROD;
    const urlParams = new URLSearchParams(window.location.search);
    const forceKiosk = urlParams.get('kiosk') === 'true';
    const kioskEnabled = (isProduction || forceKiosk) && !isDebugMode;

    // Apply kiosk-mode class to body
    useEffect(() => {
        if (kioskEnabled) {
            document.body.classList.add('kiosk-mode');
        } else {
            document.body.classList.remove('kiosk-mode');
        }

        return () => {
            document.body.classList.remove('kiosk-mode');
        };
    }, [kioskEnabled]);

    // Auto-enter fullscreen and prevent exit (Task 53.1)
    useFullscreen({
        autoEnter: kioskEnabled,
        exitOnEscape: kioskEnabled, // Re-enter fullscreen if user presses ESC
    });

    // Disable browser controls and navigation (Tasks 53.2, 53.3)
    useKioskLockdown({
        enabled: kioskEnabled,
    });

    // Registers a test control so the Leva panel has something to render
    useControls('Debug', () => isDebugMode ? {
        info: { value: 'Debug mode active', editable: false },
    } : {}, { hidden: !isDebugMode });

    const handleEndSessionConfirm = () => {
        closeModal();
    };

    return (
        <>
            {isDebugMode && <Leva oneLineLabels titleBar={{ title: 'Debug Controls' }} />}
            <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden">
                {/* Game runs directly - no language selection */}
                <HeritageHarvestGame />

                {/* Educational Modal */}
                <EducationalModal />

                <AnimatePresence>
                    <EndSessionConfirmation
                        isOpen={modal === 'end-session'}
                        onConfirm={handleEndSessionConfirm}
                        onCancel={closeModal}
                    />
                </AnimatePresence>

                {/* Admin Panel - Hidden, accessed via Ctrl+Shift+A */}
                <AdminPanel
                    isOpen={isAdminOpen}
                    onClose={closeAdminPanel}
                />
            </div>
        </>
    );
}
