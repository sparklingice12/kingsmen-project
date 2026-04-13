import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { KIOSK_CONFIG } from './kiosk.config';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Attract Mode Component
 * 
 * Displays an animated sequence when the kiosk is idle to attract visitors.
 * Features:
 * - Animated logo and title screen
 * - Gameplay highlights carousel
 * - "Touch to Start" call-to-action
 * - Smooth transitions between slides
 */
function AttractMode({ onExit }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const prefersReducedMotion = usePrefersReducedMotion();

    const slides = [
        {
            id: 'welcome',
            title: '🌾 Heritage Harvest',
            subtitle: 'Museum Farming Experience',
            description: 'Learn about sustainable farming practices through interactive gameplay',
            features: [
                { icon: '🌱', text: 'Plant & Grow Crops' },
                { icon: '💧', text: 'Water Daily' },
                { icon: '🌾', text: 'Harvest & Earn' },
            ],
        },
        {
            id: 'gameplay',
            title: '🎮 Interactive Gameplay',
            subtitle: 'Touch-Based Controls',
            description: 'Use the virtual joystick to move around your farm and interact with tiles',
            features: [
                { icon: '🕹️', text: 'Easy Touch Controls' },
                { icon: '🔧', text: 'Multiple Tools' },
                { icon: '📊', text: 'Track Your Progress' },
            ],
        },
        {
            id: 'education',
            title: '📚 Learn & Discover',
            subtitle: 'Educational Content',
            description: 'Unlock the Heritage Codex to learn about crops, soil health, and sustainability',
            features: [
                { icon: '🌍', text: 'Sustainability Tips' },
                { icon: '🔬', text: 'Farming Science' },
                { icon: '📖', text: 'Historical Facts' },
            ],
        },
    ];

    // Auto-advance slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, KIOSK_CONFIG.ATTRACT_MODE_ANIMATION_DURATION);

        return () => clearInterval(interval);
    }, [slides.length]);

    // Handle touch/click to exit attract mode
    const handleInteraction = (e) => {
        console.log('👆 AttractMode interaction detected:', e.type);
        e.stopPropagation();
        onExit();
    };

    const currentSlideData = slides[currentSlide];

    // Animation settings based on reduced motion preference
    const getTransition = (defaultTransition) => {
        if (prefersReducedMotion) {
            return { duration: 0.01 }; // Nearly instant for reduced motion
        }
        return defaultTransition;
    };

    const getPulseAnimation = () => {
        if (prefersReducedMotion) {
            return {
                scale: 1,
                opacity: 1,
            };
        }
        return {
            scale: [1, 1.05, 1],
            opacity: [0.7, 1, 0.7],
        };
    };

    const getPulseTransition = () => {
        if (prefersReducedMotion) {
            return { duration: 0 };
        }
        return {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
        };
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
                backgroundImage: 'url(/start-page/background.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                pointerEvents: 'auto',
                cursor: 'pointer',
            }}
            onClick={handleInteraction}
            onTouchStart={handleInteraction}
        >
            {/* Dark overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(to bottom, rgba(46,30,20,0.8), rgba(46,30,20,0.4), rgba(46,30,20,0.85))',
                }}
            />

            {/* Content */}
            <div className="relative z-10 w-full max-w-4xl px-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlideData.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={getTransition({ duration: 0.6 })}
                        className="text-center space-y-8"
                    >
                        {/* Title */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={getTransition({ delay: 0.2, type: 'spring', stiffness: 120 })}
                            className="space-y-3"
                        >
                            <h1
                                className="text-6xl md:text-7xl font-extrabold tracking-tight"
                                style={{
                                    color: '#e8d5b0',
                                    textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.7)',
                                }}
                            >
                                {currentSlideData.title}
                            </h1>
                            <p
                                className="text-2xl md:text-3xl font-semibold italic tracking-wide"
                                style={{
                                    color: '#c4a06a',
                                    textShadow: '0 2px 10px rgba(0,0,0,0.7)',
                                }}
                            >
                                {currentSlideData.subtitle}
                            </p>
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={getTransition({ delay: 0.4 })}
                            className="text-xl max-w-2xl mx-auto"
                            style={{
                                color: 'rgba(232,213,176,0.9)',
                                textShadow: '0 1px 8px rgba(0,0,0,0.6)',
                            }}
                        >
                            {currentSlideData.description}
                        </motion.p>

                        {/* Feature Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={getTransition({ delay: 0.6 })}
                            className="flex gap-6 justify-center flex-wrap"
                        >
                            {currentSlideData.features.map((feature, index) => (
                                <motion.div
                                    key={feature.text}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={getTransition({ delay: 0.7 + index * 0.1 })}
                                    className="backdrop-blur-md rounded-2xl px-8 py-6 border-2 min-w-[200px]"
                                    style={{
                                        backgroundColor: 'rgba(58,37,24,0.8)',
                                        borderColor: 'rgba(176,144,96,0.4)',
                                    }}
                                >
                                    <p className="text-4xl mb-2">{feature.icon}</p>
                                    <p
                                        className="font-semibold text-lg"
                                        style={{ color: '#e8d5b0' }}
                                    >
                                        {feature.text}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Touch to Start - Pulsing */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={getTransition({ delay: 1 })}
                            className="pt-8"
                        >
                            <motion.div
                                animate={getPulseAnimation()}
                                transition={getPulseTransition()}
                                className="inline-block"
                            >
                                <div
                                    className="px-12 py-6 rounded-2xl text-3xl font-bold border-2"
                                    style={{
                                        background: 'linear-gradient(to bottom, rgba(90,64,48,0.9), rgba(58,37,21,0.9))',
                                        borderColor: '#b09060',
                                        color: '#e8d5b0',
                                        boxShadow: '0 8px 32px rgba(46,30,20,0.8)',
                                    }}
                                >
                                    👆 Touch Anywhere to Start
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Slide Indicators */}
                        <div className="flex gap-3 justify-center pt-4">
                            {slides.map((_, index) => (
                                <div
                                    key={index}
                                    className="w-3 h-3 rounded-full transition-all duration-300"
                                    style={{
                                        backgroundColor:
                                            index === currentSlide
                                                ? '#e8d5b0'
                                                : 'rgba(232,213,176,0.3)',
                                        boxShadow:
                                            index === currentSlide
                                                ? '0 0 12px rgba(232,213,176,0.6)'
                                                : 'none',
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export default AttractMode;
