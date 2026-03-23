import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/state/store';
import { GlassButton } from '@/components/ui/glass-button';
import Gallery from '@/features/gallery/Gallery.module';
import { GlobalCloseButton } from '../components/shared/GlobalCloseButton';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { SessionTimer } from '@/components/shared/SessionTimer';
import { EndSessionConfirmation } from '@/components/shared/EndSessionConfirmation';
import { LanguageSwitcherButton, LanguageSwitcherButtonSecondary, LanguageSwitcherScreen, useLanguage } from '@/features/language';
import { Leva, useControls } from 'leva';
import { useDebugMode } from '@/features/debug/useDebugMode';


export default function App() {
    const { theme, setTheme } = useStore((s) => s.ui);
    const { modal, openModal, closeModal } = useStore((s) => s.ui);
    const { t } = useLanguage();
    const [showLanguageScreen, setShowLanguageScreen] = useState(true);
    const isDebugMode = useDebugMode();

    // Registers a test control so the Leva panel has something to render
    useControls('Debug', () => isDebugMode ? {
        info: { value: 'Debug mode active', editable: false },
    } : {}, { hidden: !isDebugMode });

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    const handleEndSessionConfirm = () => {
        closeModal();
        setShowLanguageScreen(true);
    };

    return (
        <>
            {isDebugMode && <Leva oneLineLabels titleBar={{ title: 'Debug Controls' }} />}
            <div className="flex flex-col gap-4 min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {showLanguageScreen ? (
                        <LanguageSwitcherScreen
                            key="lang-screen"
                            onStart={() => setShowLanguageScreen(false)}
                        />
                    ) : (
                        <motion.div
                            key="main-app"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="p-8"
                        >
                            <header className="mb-8 flex justify-between items-center gap-4">
                                <div className="flex flex-col">
                                    <h1 className="text-3xl font-bold">Kingsmen App Template</h1>
                                    <p className="text-muted-foreground">
                                        A template for Kingsmen applications built on top of React, Vite, and Shadcn UI. Edit <strong className='font-mono font-semibold bg-[#EEE] dark:bg-background text-foreground p-1 rounded'>src/app/App.jsx</strong> to get started.
                                    </p>
                                    <p className="text-primary mt-2 font-bold">
                                        Translation Test: {t('attractor.touchToStart')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <LanguageSwitcherButton onClick={() => setShowLanguageScreen(true)} />
                                    <LanguageSwitcherButtonSecondary onClick={() => setShowLanguageScreen(true)} />
                                    <GlassButton onClick={toggleTheme}>
                                        Toggle {theme === 'light' ? 'Dark' : 'Light'}
                                    </GlassButton>
                                    <GlobalCloseButton className="relative top-0 right-0" />
                                </div>
                            </header>

                            <main className="space-y-12">
                                <Gallery />

                                {/* CategoryBadge demo */}
                                <section className="space-y-4">
                                    <h2 className="text-xl font-semibold">CategoryBadge</h2>
                                    <div className="flex flex-wrap gap-4">
                                        <CategoryBadge label="Vegetable" color="#8DDD91" />
                                        <CategoryBadge label="Protein" color="#F4845F" />
                                        <CategoryBadge label="Carbohydrates" color="#F9C015" />
                                        <CategoryBadge label="Fruit" color="#A78BFA" />
                                        <CategoryBadge label="Dressing" color="#60A5FA" />
                                    </div>
                                </section>
                            </main>

                            <SessionTimer countdown={5} curvedText={t('common.timeoutWarning')} />
                        </motion.div>
                    )}
                </AnimatePresence>

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
