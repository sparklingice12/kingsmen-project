import React from 'react';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const glassButtonVariants = cva(
    "flex items-center justify-center px-[32px] py-[20px] gap-[16px] rounded-[24px] font-bold uppercase transition-all duration-300",
    {
        variants: {
            variant: {
                default: "bg-[linear-gradient(90deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0.2)_34.14%,rgba(255,255,255,0.2)_62.98%,rgba(255,255,255,0.5)_100%)] backdrop-blur-[15px] border-2 border-white text-white shadow-[0px_5px_30px_rgba(0,0,0,0.15)] hover:scale-105",
                plain: "bg-transparent text-white hover:bg-white/10",
            },
            size: {
                default: "w-auto min-w-[370px] h-[112px] text-[40px] leading-[61px]",
                sm: "px-6 py-2 text-sm",
                lg: "px-12 py-6 text-2xl",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export const GlassButton = ({ className, variant, size, children, ...props }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(glassButtonVariants({ variant, size, className }))}
            {...props}>
            {children}
        </motion.button>
    );
};
