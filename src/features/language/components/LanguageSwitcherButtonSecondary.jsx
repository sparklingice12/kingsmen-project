import { useLanguage } from '../hooks/useLanguage';
import { LanguageSelectorIcon } from '@/components/icons';
// import { useStore } from '@/state/store';

export const LanguageSwitcherButtonSecondary = ({ className, iconClassName }) => {
    const { currentLang, availableLanguages } = useLanguage();
    // const openModal = useStore((s) => s.ui.openModal);

    // const handleLanguageClick = () => {
    //     openModal('language-selector');
    // };

    return (
        <button
            // onClick={handleLanguageClick}
            className={`bg-[#F9C015] text-white rounded-3xl h-24 shadow-[0_12px_0_#F0A901] flex items-center justify-center gap-2 px-6 py-6 transition-all hover:bg-[#FFD040] active:shadow-none active:translate-y-1 ${className}`}
        >
            <LanguageSelectorIcon size={48} className={iconClassName} />
            <span className="ml-4 text-white text-[32px] font-bold uppercase tracking-wider">
                {availableLanguages.find(l => l.code === currentLang)?.label || currentLang}
            </span>
        </button>
    );
};
