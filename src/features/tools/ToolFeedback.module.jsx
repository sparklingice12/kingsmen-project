import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/state/store';
import { useEffect } from 'react';

/**
 * ToolFeedback Component
 * 
 * Displays visual feedback when tools are used.
 * Shows success/error messages with animations.
 * Auto-dismisses after 3 seconds.
 * 
 * Requirements: 1.3.6
 */
function ToolFeedback() {
    const feedback = useStore((s) => s.ui.feedback);
    const clearFeedback = useStore((s) => s.ui.clearFeedback);

    // Auto-dismiss feedback after 3 seconds
    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => {
                clearFeedback();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [feedback, clearFeedback]);

    return (
        <AnimatePresence>
            {feedback && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
                >
                    <div
                        className={`px-6 py-3 rounded-xl font-semibold text-white shadow-2xl ${feedback.success
                            ? 'bg-green-500'
                            : 'bg-red-500'
                            }`}
                    >
                        {feedback.message}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ToolFeedback;
