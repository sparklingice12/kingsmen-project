import { useLanguage } from '../hooks/useLanguage';
import { LanguageSelectorIcon } from '@/components/icons';
import { GlassButton } from '@/components/ui/glass-button';

export const LanguageSwitcherButton = ({ className, iconClassName, onClick }) => {
    const { currentLang, availableLanguages } = useLanguage();

    return (
        <div className={`relative z-50 ${className}`}>
            <GlassButton
                onClick={onClick}
                className="transition-all active:scale-95 group flex items-center justify-center"
            >
                <LanguageSelectorIcon size={48} className={iconClassName} />
                <span className="text-white text-[40px] uppercase tracking-wider">
                    {availableLanguages.find(l => l.code === currentLang)?.label || currentLang}
                </span>
            </GlassButton>
        </div>
    );
};
