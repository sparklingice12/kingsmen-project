import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import Scene from './Scene';
import TexturePreloader from './TexturePreloader';

/**
 * GameCanvas Component
 * 
 * Wraps the R3F Canvas with proper configuration for the farming game.
 * - Fixed 1920x1080 resolution (kiosk target)
 * - Pixel-perfect rendering settings
 * - Performance optimizations
 * - Texture preloading to prevent black screen
 */
function GameCanvas() {
    const [texturesLoaded, setTexturesLoaded] = useState(false);

    return (
        <div className="absolute inset-0 w-full h-full">
            {/* Loading screen while textures load */}
            {!texturesLoaded && (
                <div
                    className="absolute inset-0 flex items-center justify-center z-10"
                    style={{
                        background: 'linear-gradient(to bottom, #3a2518, #2e1e14, #241610)',
                    }}
                >
                    <div className="text-center">
                        <div
                            className="inline-block w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-4"
                            style={{ borderColor: '#b09060', borderTopColor: 'transparent' }}
                        />
                        <p
                            className="text-lg font-semibold"
                            style={{ color: '#e8d5b0' }}
                        >
                            Loading Farm...
                        </p>
                    </div>
                </div>
            )}

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
                    <TexturePreloader onLoaded={() => setTexturesLoaded(true)}>
                        <Scene />
                    </TexturePreloader>
                </Suspense>
            </Canvas>
        </div>
    );
}

export default GameCanvas;
