import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useTileSelection } from './useTileSelection';

/**
 * TileInteractionHandler Component
 * 
 * Invisible component that handles tile interaction events.
 * Attaches event listeners to the canvas for touch and mouse input.
 * 
 * Requirements: 1.3.2, 1.3.3
 */
function TileInteractionHandler() {
    const { gl } = useThree();
    const { handleTouchStart, handleMouseDown } = useTileSelection();

    useEffect(() => {
        const canvas = gl.domElement;

        // Add event listeners
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('mousedown', handleMouseDown);

        // Cleanup
        return () => {
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('mousedown', handleMouseDown);
        };
    }, [gl, handleTouchStart, handleMouseDown]);

    // This component doesn't render anything
    return null;
}

export default TileInteractionHandler;
