import { useState, useCallback, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/state/store';
import { validateAndApplyTool } from './tools.service';
import { FARM_CONFIG } from '@/features/farm/farm.config';
import { getAdjacentTiles } from '@/features/farm/farm.service';

/**
 * useTileSelection Hook
 * 
 * Handles tile selection and tool application via raycasting.
 * Converts screen touch/click coordinates to world position.
 * Raycasts against ground plane to find tile at position.
 * 
 * Requirements: 1.3.2, 1.3.3, 1.3.4, 1.3.5, 1.3.6, T2
 */
export function useTileSelection() {
    const { camera, size } = useThree();
    const [selectedTile, setSelectedTile] = useState(null);
    const [hoveredTile, setHoveredTile] = useState(null);
    const raycaster = useRef(new THREE.Raycaster()).current;
    const pointer = useRef(new THREE.Vector2()).current;

    // Get store actions
    const tiles = useStore((s) => s.farm.tiles);
    const updateTile = useStore((s) => s.farm.updateTile);
    const selectedTool = useStore((s) => s.ui.selectedTool);
    const selectedSeed = useStore((s) => s.ui.selectedSeed);
    const inventory = useStore((s) => s.inventory);
    const wateringCanLevel = useStore((s) => s.inventory.upgrades.wateringCan);
    const useSeed = useStore((s) => s.inventory.useSeed);
    const addItem = useStore((s) => s.inventory.addItem);
    const addCoins = useStore((s) => s.inventory.addCoins);
    const trackEvent = useStore((s) => s.session.trackEvent);
    const updateInteraction = useStore((s) => s.session.updateInteraction);
    const setFeedback = useStore((s) => s.ui.setFeedback);
    const clearFeedback = useStore((s) => s.ui.clearFeedback);

    /**
     * Convert screen coordinates to normalized device coordinates
     */
    const screenToNDC = useCallback((clientX, clientY) => {
        pointer.x = (clientX / size.width) * 2 - 1;
        pointer.y = -(clientY / size.height) * 2 + 1;
    }, [size, pointer]);

    /**
     * Find tile at world position
     */
    const findTileAtPosition = useCallback((worldX, worldZ) => {
        // Round to nearest tile position
        const tileX = Math.round(worldX);
        const tileZ = Math.round(worldZ);

        // Find tile with matching position
        return tiles.find(
            (tile) =>
                Math.round(tile.position.x) === tileX &&
                Math.round(tile.position.z) === tileZ
        );
    }, [tiles]);

    /**
     * Perform raycast and find intersected tile
     */
    const raycastTile = useCallback((clientX, clientY) => {
        // Convert screen to NDC
        screenToNDC(clientX, clientY);

        // Update raycaster
        raycaster.setFromCamera(pointer, camera);

        // Create ground plane at y=0
        const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersectPoint = new THREE.Vector3();

        // Raycast against ground plane
        raycaster.ray.intersectPlane(groundPlane, intersectPoint);

        if (intersectPoint) {
            // Find tile at intersection point
            const tile = findTileAtPosition(intersectPoint.x, intersectPoint.z);
            return tile;
        }

        return null;
    }, [camera, raycaster, pointer, screenToNDC, findTileAtPosition]);

    /**
     * Show visual feedback
     */
    const showFeedback = useCallback((success, message) => {
        setFeedback({ success, message, timestamp: Date.now() });

        // Clear feedback after duration (2 seconds for success, 3 seconds for errors)
        setTimeout(() => {
            clearFeedback();
        }, success ? 2000 : 3000);
    }, [setFeedback, clearFeedback]);

    /**
     * Handle tile click/tap
     */
    const handleTileInteraction = useCallback((clientX, clientY) => {
        // Update session interaction time
        updateInteraction();

        // Find tile via raycast
        const tile = raycastTile(clientX, clientY);

        // Silently ignore clicks on blank space (no tile found)
        if (!tile) {
            return;
        }

        setSelectedTile(tile);

        // Validate and apply tool
        const result = validateAndApplyTool(
            tile,
            selectedTool,
            selectedSeed,
            inventory
        );

        if (result.success) {
            // Apply updates to tile
            updateTile(tile.id, result.updates);

            // Handle seed consumption and track planting
            if (selectedTool === 'seed_bag' && selectedSeed) {
                useSeed(selectedSeed);

                // Track crop planting in analytics
                const currentPlanted = useStore.getState().session.analytics.cropsPlanted || 0;
                trackEvent('plant', {
                    cropsPlanted: currentPlanted + 1
                });

                console.log('🌱 Crop planted! Analytics:', useStore.getState().session.analytics);
            }

            // Handle harvest rewards
            if (selectedTool === 'harvest_tool' && result.harvestedCrop) {
                const cropType = result.harvestedCrop.type;

                // Add harvested crop to inventory (unlimited storage)
                addItem(cropType, 1);

                // Track harvest in analytics
                const currentHarvested = useStore.getState().session.analytics.cropsHarvested || 0;
                trackEvent('harvest', {
                    cropsHarvested: currentHarvested + 1
                });

                console.log('🌾 Crop harvested! Analytics:', useStore.getState().session.analytics);

                // Trigger harvest effect event
                window.dispatchEvent(new CustomEvent('harvestCrop', {
                    detail: {
                        position: tile.position,
                        cropType,
                        coinValue: 0, // No coins on harvest - must sell at shop
                    }
                }));
            }

            // Handle watering effect
            if (selectedTool === 'watering_can') {
                // Trigger watering effect event
                window.dispatchEvent(new CustomEvent('waterTile', {
                    detail: {
                        position: tile.position,
                    }
                }));
            }

            // Show success feedback
            showFeedback(true, result.message);
        }
        // Silently ignore invalid actions (wrong tool for tile state)
        // No error feedback shown - just nothing happens
    }, [
        raycastTile,
        selectedTool,
        selectedSeed,
        inventory,
        updateTile,
        useSeed,
        addItem,
        updateInteraction,
        showFeedback,
    ]);

    /**
     * Handle touch events
     */
    const handleTouchStart = useCallback((event) => {
        // Ignore if touching joystick area (bottom-left)
        const touch = event.touches[0];
        if (touch.clientX < 200 && touch.clientY > window.innerHeight - 200) {
            return;
        }

        handleTileInteraction(touch.clientX, touch.clientY);
    }, [handleTileInteraction]);

    /**
     * Handle mouse events (desktop testing)
     */
    const handleMouseDown = useCallback((event) => {
        // Ignore if clicking joystick area (bottom-left)
        if (event.clientX < 200 && event.clientY > window.innerHeight - 200) {
            return;
        }

        handleTileInteraction(event.clientX, event.clientY);
    }, [handleTileInteraction]);

    /**
     * Handle mouse move for hover preview (only for watering can)
     */
    const handleMouseMove = useCallback((event) => {
        // Only show preview when watering can is selected
        if (selectedTool !== 'watering_can') {
            if (hoveredTile) setHoveredTile(null);
            return;
        }

        // Ignore if over joystick area
        if (event.clientX < 200 && event.clientY > window.innerHeight - 200) {
            if (hoveredTile) setHoveredTile(null);
            return;
        }

        // Find tile via raycast
        const tile = raycastTile(event.clientX, event.clientY);
        setHoveredTile(tile);
    }, [selectedTool, raycastTile, hoveredTile]);

    /**
     * Calculate affected tiles for watering can preview
     */
    const getAffectedTiles = useCallback(() => {
        if (!hoveredTile || selectedTool !== 'watering_can') {
            return [];
        }

        // Determine area size based on upgrade level
        const areaSize = wateringCanLevel === 'steel' ? 5 : wateringCanLevel === 'copper' ? 3 : 1;

        // Use imported getAdjacentTiles function
        return getAdjacentTiles(tiles, hoveredTile.row, hoveredTile.col, areaSize);
    }, [hoveredTile, selectedTool, wateringCanLevel, tiles]);

    return {
        selectedTile,
        hoveredTile,
        affectedTileIds: getAffectedTiles(),
        handleTouchStart,
        handleMouseDown,
        handleMouseMove,
        raycastTile,
    };
}
