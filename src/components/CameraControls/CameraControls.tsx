import { OrbitControls } from '@react-three/drei';

/**
 * 电影级相机控制
 * - 左键拖拽旋转
 * - 右键平移
 * - 滚轮缩放
 * - 自动旋转（可选）
 */
export function CameraControls({ autoRotate = false }: { autoRotate?: boolean }) {
  return (
    <OrbitControls
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      autoRotate={autoRotate}
      autoRotateSpeed={0.3}
      minDistance={1.5}
      maxDistance={100}
      zoomSpeed={0.8}
      rotateSpeed={0.5}
      // 阻尼（惯性）
      enableDamping={true}
      dampingFactor={0.05}
    />
  );
}
