import { useFrame } from '@react-three/fiber';
import { Earth } from './Earth';
import { Moon } from './Moon';
import { ISS } from './ISS';
import { Stars } from './Stars';
import { CameraControls } from './CameraControls';
import { GroundStations } from './Earth/GroundStations';
import { useSunPosition } from '../hooks/useSunPosition';
import { useAppStore } from '../stores/useAppStore';

/**
 * 场景根组件 — 组装所有 3D 对象
 */
export function Scene() {
  const sunPosition = useSunPosition();
  const tick = useAppStore((s) => s.tick);

  // 每帧推进时间
  useFrame((_, delta) => {
    tick(delta);
  });

  return (
    <>
      {/* 光照 */}
      <ambientLight intensity={0.08} color="#4466aa" />
      <directionalLight
        position={sunPosition}
        intensity={2.0}
        color="#fff5e6"
        castShadow
      />
      {/* 太阳辉光指示 */}
      <mesh position={sunPosition}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#ffdd44" />
      </mesh>

      {/* 天体 */}
      <Earth />
      <GroundStations />
      <Moon />
      <ISS />

      {/* 星空 */}
      <Stars count={6000} />

      {/* 相机控制 */}
      <CameraControls autoRotate={false} />
    </>
  );
}
