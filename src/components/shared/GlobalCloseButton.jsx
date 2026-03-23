import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/state/store';
import { CloseIcon } from '@/components/icons';

export function GlobalCloseButton({ className = '', delay = 0.3, ...props }) {
  const openModal = useStore((s) => s.ui.openModal);

  const handleClose = () => {
    openModal('end-session');
  };


  return (
    <>
      <motion.button
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay }}
        onClick={handleClose}
        className={`bg-[#F9C015] text-white w-24 h-24 rounded-3xl shadow-[0_12px_0_#F0A901] flex items-center justify-center transition-all hover:bg-[#FFD040] active:shadow-none active:translate-y-1 z-50 ${className}`}
        {...props}
      >
        <CloseIcon size={48} />
      </motion.button>
    </>
  );
}