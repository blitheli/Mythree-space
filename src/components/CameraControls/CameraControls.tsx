import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useAppStore } from '../../stores/useAppStore';

const _lerpTarget = new THREE.Vector3();
const _lerpPosition = new THREE.Vector3();

/**
 * 相机控制器 — 支持全球视角和 ISS 跟随视角
 *
 * 全球视角：围绕地球中心旋转
 * ISS 视角：相机跟随 ISS，从稍高位置俯视
 */
export function CameraControls() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const cameraView = useAppStore((s) => s.cameraView);
  const issPosition = useAppStore((s) => s.issPosition);
  const transitionRef = useRef(0); // 0 = 完成, >0 = 过渡中

  // 视角切换时触发过渡动画
  useEffect(() => {
    transitionRef.current = 1.0; // 开始过渡
  }, [cameraView]);

  useFrame(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    if (cameraView === 'iss') {
      // ISS 跟随视角
      const issPos = issPosition;

      // 相机目标：ISS 位置
      _lerpTarget.copy(issPos);

      // 相机位置：ISS 上方偏移（沿径向外推）
      const radialDir = issPos.clone().normalize();
      const offset = radialDir.multiplyScalar(0.3); // 比 ISS 再高一点
      // 加一个侧向偏移以获得更好的视角
      const side = new THREE.Vector3()
        .crossVectors(radialDir, new THREE.Vector3(0, 1, 0))
        .normalize()
        .multiplyScalar(0.15);
      _lerpPosition.copy(issPos).add(offset).add(side);

      // 平滑过渡
      const t = transitionRef.current > 0 ? 0.03 : 0.08;
      controls.target.lerp(_lerpTarget, t);
      camera.position.lerp(_lerpPosition, t);

      if (transitionRef.current > 0) {
        transitionRef.current -= 0.02;
        if (transitionRef.current < 0) transitionRef.current = 0;
      }

      controls.update();
    } else {
      // 全球视角 — 过渡回地球中心
      if (transitionRef.current > 0) {
        _lerpTarget.set(0, 0, 0);
        _lerpPosition.set(0, 1.5, 4);
        controls.target.lerp(_lerpTarget, 0.05);
        camera.position.lerp(_lerpPosition, 0.05);
        transitionRef.current -= 0.02;
        if (transitionRef.current < 0) transitionRef.current = 0;
        controls.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={cameraView === 'global'}
      enableZoom={true}
      enableRotate={true}
      minDistance={cameraView === 'iss' ? 0.05 : 1.5}
      maxDistance={cameraView === 'iss' ? 2 : 100}
      zoomSpeed={0.8}
      rotateSpeed={cameraView === 'iss' ? 0.3 : 0.5}
      enableDamping={true}
      dampingFactor={0.05}
    />
  );
}
