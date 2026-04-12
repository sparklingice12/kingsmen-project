import { AnimatePresence } from 'framer-motion';
import { useStore } from '@/state/store';
import { EndSessionConfirmation } from '@/components/shared/EndSessionConfirmation';
import { HeritageHarvestGame } from '@/features/game';
import { EducationalModal } from '@/features/education';
import { Leva, useControls } from 'leva';
import { useDebugMode } from '@/features/debug/useDebugMode';


export default function App() {
    const { modal, closeModal } = useStore((s) => s.ui);
    const isDebugMode = useDebugMode();

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
            </div>
        </>
    );
}
