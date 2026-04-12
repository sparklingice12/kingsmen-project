// Button component with audio feedback
import { Button } from '@/components/ui/button';
import { playSfx } from '@/features/audio/audio.service';

export default function AudioButton({
    onClick,
    children,
    soundType = 'click',
    disabled = false,
    ...props
}) {
    const handleClick = (e) => {
        // Play sound effect if not disabled
        if (!disabled) {
            playSfx(soundType);
        }

        // Call original onClick handler
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <Button
            onClick={handleClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </Button>
    );
}