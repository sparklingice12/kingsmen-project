import { OrthographicCamera } from '@react-three/drei';
import { FarmGrid, FarmBackground, FarmFence } from '@/features/farm/components';
import { Player } from '@/features/player/components';
import { PhysicsWorld } from '@/features/physics';
import TileInteractionHandler from '@/features/tools/TileInteractionHandler';
import { TimeManager, DynamicLighting } from '@/features/time';
import { NPCGuide } from '@/features/npc';
import { AnimalsModule } from '@/features/animals';
import { useStore } from '@/state/store';

/**
 * Main 3D Scene Component
 * 
 * Sets up the R3F scene with:
 * - Orthographic camera positioned above the farm
 * - Basic ambient and directional lighting
 * - Grid helper for development (optional)
 * - Physics world with boundaries
 * - Farm grid with 64 tiles
 * - Player character
 * - NPC Guide (scarecrow)
 */
function Scene() {
    const setNPCDialogueOpen = useStore((s) => s.ui.setNPCDialogueOpen);

    const handleNPCTap = () => {
        setNPCDialogueOpen(true);
    };
    return (
        <>
            <color attach="background" args={['#2d5a1e']} />

            <OrthographicCamera
                makeDefault
                position={[0, 10, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                zoom={80}
                near={0.1}
                far={1000}
            />

            {/* Dynamic Lighting - changes with time of day */}
            <DynamicLighting />

            {import.meta.env.DEV && (
                <gridHelper args={[8, 8, '#1a3a10', '#142e0c']} rotation={[0, 0, 0]} />
            )}


            <FarmBackground />

            {/* Farm Fence - Decorative bamboo fence around the grid */}
            <FarmFence />

            {/* Farm Grid - 64 tiles (outside physics for performance) */}
            <FarmGrid />

            {/* NPC Guide - Scarecrow */}
            <NPCGuide onTap={handleNPCTap} />

            {/* Animals - Chickens */}
            <AnimalsModule />

            {/* Physics World with boundaries */}
            <PhysicsWorld>
                {/* Player Character with physics */}
                <Player />
            </PhysicsWorld>

            {/* Tile Interaction Handler (invisible) */}
            <TileInteractionHandler />

            {/* Time Manager (invisible) */}
            <TimeManager />
        </>
    );
}

export default Scene;
