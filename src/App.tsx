import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Scene } from './components/Scene';
import { Timeline } from './ui/Timeline';
import { InfoPanel } from './ui/InfoPanel';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      {/* 3D 画布 */}
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 50, near: 0.01, far: 1000 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ background: '#000011' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* 2D UI 覆盖层 */}
      <InfoPanel />
      <Timeline />
    </div>
  );
}
