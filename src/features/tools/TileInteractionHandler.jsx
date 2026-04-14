import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useTileSelection } from './useTileSelection';

/**
 * TileInteractionHandler Component
 * 
 * Invisible component that handles tile interaction events.
 * Attaches event listeners to the canvas for touch and mouse input.
 * Also handles mouse move for hover preview (watering can).
 * 
 * Requirements: 1.3.2, 1.3.3
 */
function TileInteractionHandler() {
    const { gl } = useThree();
    const { handleTouchStart, handleMouseDown, handleMouseMove } = useTileSelection();

    useEffect(() => {
        const canvas = gl.domElement;

        // Add event listeners
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);

        // Cleanup
        return () => {
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [gl, handleTouchStart, handleMouseDown, handleMouseMove]);

    // This component doesn't render anything
    return null;
}

export default TileInteractionHandler;
