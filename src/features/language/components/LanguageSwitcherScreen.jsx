import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassToggleButton } from '@/components/ui/glass-toggle-button';

export const LanguageSwitcherScreen = ({ onStart, mode = 'SOIL' }) => {
    const { setLanguage, availableLanguages, t, currentLang } = useLanguage();

    const handleConfirm = () => {
        onStart();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            className="w-full h-full flex-1 flex-col flex items-center justify-center relative overflow-hidden z-50"
        >
            {/* Glass Container */}
            <div className="relative w-full max-w-[1825px] h-full max-h-[820px] bg-black/40 backdrop-blur-xl border border-white/20 rounded-[30px] p-12 flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[30px] pointer-events-none">
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                    <div className="absolute top-0 left-10 w-20 h-1 bg-white/50" />
                    <div className="absolute top-0 right-20 w-10 h-1 bg-white/30" />
                    <div className="absolute bottom-0 left-20 w-10 h-1 bg-white/30" />
                    <div className="absolute bottom-0 right-10 w-20 h-1 bg-white/50" />

                    {/* Corner Accents */}
                    <div className="absolute top-10 left-0 w-1 h-20 bg-gradient-to-b from-white/50 to-transparent" />
                    <div className="absolute top-0 left-0 w-20 h-1 bg-gradient-to-r from-white/50 to-transparent" />
                    <div className="absolute bottom-10 right-0 w-1 h-20 bg-gradient-to-t from-white/50 to-transparent" />
                    <div className="absolute bottom-0 right-0 w-20 h-1 bg-gradient-to-l from-white/50 to-transparent" />
                </div>

                {/* Title Section */}
                <div className="text-center mb-16 relative z-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, type: "spring" }}
                        className="mb-4"
                    >
                        <h1 className="text-8xl font-bold text-white mb-4 drop-shadow-2xl">🌾 Heritage Harvest</h1>
                        <p className="text-3xl text-white/90 drop-shadow-lg">Museum Farming Experience</p>
                    </motion.div>
                </div>

                {/* Language Selection */}
                <div className="flex gap-6 mb-16 w-full justify-center">
                    {availableLanguages.map((lang) => (
                        <GlassToggleButton
                            key={lang.code}
                            isActive={currentLang === lang.code}
                            onClick={() => setLanguage(lang.code)}
                            width="375px"
                            height="147px"
                        >
                            {lang.label}
                        </GlassToggleButton>
                    ))}
                </div>

                {/* Confirm Button */}
                <div className="w-full flex justify-end">
                    <GlassButton
                        onClick={handleConfirm}
                        variant="default"
                        size="default"
                        className="fixed right-10 bottom-[-48px]"
                    >
                        {t('common.confirm')}
                        <ChevronRightIcon size={48} />
                    </GlassButton>
                </div>
            </div>
        </motion.div>
    );
};
