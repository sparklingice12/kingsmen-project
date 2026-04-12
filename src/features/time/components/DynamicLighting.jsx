import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/state/store';
import * as THREE from 'three';

/**
 * DynamicLighting Component
 * 
 * Interpolates ambient and directional light based on real Manila time.
 * Uses warm colors for morning/evening, white for midday.
 * Animates sun position in arc across sky.
 * 
 * Requirements: 1.5.2
 */
function DynamicLighting() {
    const directionalLightRef = useRef();

    // Get real Manila time and calculate timeOfDay (0-1)
    const now = new Date();
    const manilaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
    const hours = manilaTime.getHours();
    const minutes = manilaTime.getMinutes();
    const timeOfDay = (hours + minutes / 60) / 24; // 0-1 based on real time

    // Color interpolation based on time of day (more dramatic changes)
    const lightColor = useMemo(() => {
        // Morning (0-0.25): Deep Orange to Bright Yellow
        if (timeOfDay < 0.25) {
            const t = timeOfDay / 0.25;
            return new THREE.Color().lerpColors(
                new THREE.Color(0xff6600), // Deep Orange (sunrise)
                new THREE.Color(0xffffdd), // Bright Yellow
                t
            );
        }
        // Midday (0.25-0.5): Bright White
        else if (timeOfDay < 0.5) {
            return new THREE.Color(0xffffff); // Pure White
        }
        // Afternoon (0.5-0.75): White to Golden Orange
        else if (timeOfDay < 0.75) {
            const t = (timeOfDay - 0.5) / 0.25;
            return new THREE.Color().lerpColors(
                new THREE.Color(0xffffff), // White
                new THREE.Color(0xff8844), // Golden Orange (sunset)
                t
            );
        }
        // Evening/Night (0.75-1.0): Orange to Deep Blue
        else {
            const t = (timeOfDay - 0.75) / 0.25;
            return new THREE.Color().lerpColors(
                new THREE.Color(0xff8844), // Golden Orange
                new THREE.Color(0x1a1a44), // Deep Blue (night)
                t
            );
        }
    }, [timeOfDay]);

    // Ambient light intensity based on time of day (more dramatic)
    const ambientIntensity = useMemo(() => {
        // Much darker at night, brighter during day
        if (timeOfDay < 0.25) {
            // Morning: 0.2 to 0.8
            return 0.2 + (timeOfDay / 0.25) * 0.6;
        } else if (timeOfDay < 0.75) {
            // Day: 0.8 (bright)
            return 0.8;
        } else {
            // Evening/Night: 0.8 to 0.15 (very dark)
            return 0.8 - ((timeOfDay - 0.75) / 0.25) * 0.65;
        }
    }, [timeOfDay]);

    // Directional light intensity (more dramatic)
    const directionalIntensity = useMemo(() => {
        // Much stronger during day, very weak at night
        if (timeOfDay < 0.25) {
            // Morning: 0.4 to 1.2
            return 0.4 + (timeOfDay / 0.25) * 0.8;
        } else if (timeOfDay < 0.75) {
            // Day: 1.2 (strong sun)
            return 1.2;
        } else {
            // Evening/Night: 1.2 to 0.2 (moonlight)
            return 1.2 - ((timeOfDay - 0.75) / 0.25) * 1.0;
        }
    }, [timeOfDay]);

    // Update sun position in arc across sky
    useFrame(() => {
        if (directionalLightRef.current) {
            // Calculate sun position (arc from east to west)
            const angle = timeOfDay * Math.PI; // 0 to PI
            const radius = 10;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius + 5; // Offset up
            const z = 5;

            directionalLightRef.current.position.set(x, y, z);
        }
    });

    return (
        <>
            {/* Ambient Light - overall scene illumination */}
            <ambientLight color={lightColor} intensity={ambientIntensity} />

            {/* Directional Light - sun */}
            <directionalLight
                ref={directionalLightRef}
                color={lightColor}
                intensity={directionalIntensity}
                castShadow
            />
        </>
    );
}

export default DynamicLighting;
