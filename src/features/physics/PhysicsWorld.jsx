import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';

/**
 * PhysicsWorld Component
 * 
 * Sets up the Rapier.js physics world with:
 * - Gravity disabled (top-down 2D game)
 * - Boundary walls around the 8×8 grid
 * - Debug mode for development
 */
function PhysicsWorld({ children }) {
    const gridSize = 8;
    const halfSize = gridSize / 2;
    const wallThickness = 0.5;
    const wallHeight = 2;

    return (
        <Physics
            gravity={[0, 0, 0]} // No gravity for top-down view
            debug={import.meta.env.DEV} // Show colliders in development
        >
            {/* Boundary Walls - Invisible colliders around the grid */}

            {/* North Wall (top) */}
            <RigidBody type="fixed" position={[0, 0, -halfSize - wallThickness / 2]}>
                <CuboidCollider args={[(gridSize + wallThickness * 2) / 2, wallHeight / 2, wallThickness / 2]} />
            </RigidBody>

            {/* South Wall (bottom) */}
            <RigidBody type="fixed" position={[0, 0, halfSize + wallThickness / 2]}>
                <CuboidCollider args={[(gridSize + wallThickness * 2) / 2, wallHeight / 2, wallThickness / 2]} />
            </RigidBody>

            {/* West Wall (left) */}
            <RigidBody type="fixed" position={[-halfSize - wallThickness / 2, 0, 0]}>
                <CuboidCollider args={[wallThickness / 2, wallHeight / 2, gridSize / 2]} />
            </RigidBody>

            {/* East Wall (right) */}
            <RigidBody type="fixed" position={[halfSize + wallThickness / 2, 0, 0]}>
                <CuboidCollider args={[wallThickness / 2, wallHeight / 2, gridSize / 2]} />
            </RigidBody>

            {/* Render children (player, etc.) */}
            {children}
        </Physics>
    );
}

export default PhysicsWorld;
