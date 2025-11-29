import React from 'react';
import { cn } from '@/lib/utils';

export const GlassToggleButton = ({ isActive, onClick, children, className, width = 'auto', height = 'auto', ...props }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative flex flex-col items-center p-[8px] gap-[10px] rounded-[32px] backdrop-blur-[15px] transition-all duration-300 group",
                isActive
                    ? "bg-white/20 border-2 border-white shadow-[0px_10px_50px_rgba(0,0,0,0.2)]"
                    : "bg-white/20 border-2 border-white shadow-[0px_10px_50px_rgba(0,0,0,0.2)]",
                className
            )}
            style={{ width, height }}
            {...props}
        >
            <div className={cn(
                "flex flex-row justify-center items-center w-full h-full rounded-[24px] transition-all duration-300",
                isActive
                    ? "bg-gradient-to-b from-transparent to-white"
                    : "bg-gradient-to-b from-white/50 to-transparent"
            )}>
                <span className={cn(
                    "font-['Neue_Frutiger_World'] font-bold text-[50px] leading-[89px] text-center uppercase transition-all duration-300",
                    "text-white drop-shadow-[0px_4px_30px_rgba(0,0,0,0.15)]"
                )}>
                    {children}
                </span>
            </div>
        </button>
    );
};
