import { motion } from 'framer-motion';
import { TimerCurvedText } from '@/components/shared/TimerCurvedText';

export function SessionTimer({ countdown, curvedText, bgSrc = '/svg/end-session.svg' }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: 20, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      className="fixed bottom-0 right-0 z-50"
    >
      <div className="w-[440px] h-[440px] relative flex items-center justify-center">
        <img
          src={bgSrc}
          alt="Timer Background"
          className="absolute inset-0 w-full h-full object-none drop-shadow-2xl"
        />
        <TimerCurvedText text={curvedText} />
        <div className="absolute bottom-14 right-14 z-20">
          <span className="text-white text-[160px] text-center font-black drop-shadow-md tracking-tighter">
            {countdown}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
