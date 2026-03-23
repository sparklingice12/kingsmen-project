import { motion } from 'framer-motion';
import { useGameTranslation } from '@/hooks/useGameTranslation';

export function EndSessionConfirmation({ isOpen, onConfirm, onCancel }) {
  const { tGame } = useGameTranslation();
  
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#FBEEC7] min-h-[762px] w-[1140px] max-w-[90vw] rounded-[80px] px-16 py-20 flex flex-col items-center justify-center text-center shadow-2xl relative"
      >
        <h3 className="text-[#F0A901] text-[80px] leading-tight font-bold tracking-wide mb-8 px-8">
          {tGame('breakdown.endSession.title')}
        </h3>
        <p className="text-[#363636] text-[50px] font-normal leading-snug mb-12 max-w-[95%] px-4">
          {tGame('breakdown.endSession.message')}
        </p>
        <div className="flex gap-8 w-full justify-center mt-4">
          <button
            onClick={onConfirm}
            className="bg-[#F9C015] min-h-[112px] min-w-[280px] text-white text-[48px] font-bold py-6 px-16 rounded-3xl shadow-[0_16px_0_#F0A901] active:translate-y-2 active:shadow-[0_8px_0_#F0A901] transition-all uppercase"
          >
            {tGame('breakdown.endSession.yes')}
          </button>
          <button
            onClick={onCancel}
            className="bg-[#F9C015] min-h-[112px] min-w-[280px] text-white text-[48px] font-bold py-6 px-16 rounded-3xl shadow-[0_16px_0_#F0A901] active:translate-y-2 active:shadow-[0_8px_0_#F0A901] transition-all uppercase"
          >
            {tGame('breakdown.endSession.no')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
