import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Scene from './Scene';

/**
 * GameCanvas Component
 * 
 * Wraps the R3F Canvas with proper configuration for the farming game.
 * - Fixed 1920x1080 resolution (kiosk target)
 * - Pixel-perfect rendering settings
 * - Performance optimizations
 */
function GameCanvas() {
    return (
        <div className="absolute inset-0 w-full h-full">
            <Canvas
                className="w-full h-full"
                gl={{
                    antialias: false,
                    alpha: false,
                    powerPreference: 'high-performance',
                }}
                dpr={[1, 2]} // Device pixel ratio (1 for performance, 2 for retina)
                frameloop="always"
            >
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>
        </div>
    );
}

export default GameCanvas;
