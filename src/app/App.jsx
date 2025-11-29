import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/state/store';
import { GlassButton } from '@/components/ui/glass-button';
import Gallery from '@/features/gallery/Gallery.module';
import { LanguageSwitcherButton, LanguageSwitcherScreen, useLanguage } from '@/features/language';

export default function App() {
    const { theme, setTheme } = useStore((s) => s.ui);
    const { t } = useLanguage();
    const [showLanguageScreen, setShowLanguageScreen] = useState(true);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    return (
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
                                <GlassButton onClick={toggleTheme}>
                                    Toggle {theme === 'light' ? 'Dark' : 'Light'}
                                </GlassButton>
                            </div>
                        </header>

                        <main>
                            <Gallery />
                        </main>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
