import { OrthographicCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { FarmGrid, FarmBackground, FarmFence } from '@/features/farm/components';
import { Player } from '@/features/player/components';
import { PhysicsWorld } from '@/features/physics';
import TileInteractionHandler from '@/features/tools/TileInteractionHandler';
import { useTileSelection } from '@/features/tools/useTileSelection';
import { TimeManager, DynamicLighting } from '@/features/time';
import { NPCGuide } from '@/features/npc';
import { AnimalsModule } from '@/features/animals';
import { useStore } from '@/state/store';

const MIN_VISIBLE_WIDTH = 18;
const MAX_ZOOM = 80;
const MIN_ZOOM = 40;

function ResponsiveCamera() {
    const { camera, size } = useThree();

    useEffect(() => {
        const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, size.width / MIN_VISIBLE_WIDTH));
        camera.zoom = zoom;
        camera.updateProjectionMatrix();
    }, [camera, size.width, size.height]);

    return null;
}

function Scene() {
    const setNPCDialogueOpen = useStore((s) => s.ui.setNPCDialogueOpen);

    const { hoveredTile, affectedTileIds } = useTileSelection();

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
            <ResponsiveCamera />

            {/* Dynamic Lighting - changes with time of day */}
            <DynamicLighting />

            {import.meta.env.DEV && (
                <gridHelper args={[8, 8, '#1a3a10', '#142e0c']} rotation={[0, 0, 0]} />
            )}


            <FarmBackground />

            {/* Farm Fence - Decorative bamboo fence around the grid */}
            <FarmFence />

            {/* Farm Grid - 64 tiles (outside physics for performance) */}
            <FarmGrid hoveredTile={hoveredTile} affectedTileIds={affectedTileIds} />

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
