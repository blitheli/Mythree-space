import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../stores/useAppStore';
import { MOON_SCALE_DISTANCE, MOON_SCALE_SIZE } from '../../utils/celestial';

/**
 * 月球组件 — 根据简化天文模型计算位置
 */
export function Moon() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const currentTime = useAppStore((s) => s.currentTime);

  // 程序化月球纹理
  const moonTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // 月球底色
    ctx.fillStyle = '#a0a0a0';
    ctx.fillRect(0, 0, 256, 128);

    // 添加一些环形山
    const craters = [
      { x: 60, y: 50, r: 15 },
      { x: 120, y: 70, r: 20 },
      { x: 180, y: 40, r: 12 },
      { x: 90, y: 90, r: 10 },
      { x: 200, y: 80, r: 18 },
      { x: 40, y: 30, r: 8 },
      { x: 150, y: 100, r: 14 },
    ];

    craters.forEach(({ x, y, r }) => {
      // 暗色月海
      ctx.fillStyle = '#707070';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      // 环形山边缘高光
      ctx.strokeStyle = '#b0b0b0';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    return new THREE.CanvasTexture(canvas);
  }, []);

  // 月球公转
  useFrame(() => {
    if (groupRef.current) {
      // 恒星月 27.3 天
      const daysSinceEpoch = (currentTime.getTime() - new Date('2024-01-01').getTime()) / 86400000;
      const angle = (daysSinceEpoch / 27.3) * Math.PI * 2;

      groupRef.current.position.x = Math.cos(angle) * MOON_SCALE_DISTANCE;
      groupRef.current.position.z = Math.sin(angle) * MOON_SCALE_DISTANCE;
      groupRef.current.position.y = Math.sin(angle * 0.5) * 2; // 轻微倾斜
    }

    // 月球自转（潮汐锁定）
    if (meshRef.current) {
      const daysSinceEpoch = (currentTime.getTime() - new Date('2024-01-01').getTime()) / 86400000;
      meshRef.current.rotation.y = (daysSinceEpoch / 27.3) * Math.PI * 2;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[MOON_SCALE_SIZE, 32, 32]} />
        <meshPhongMaterial
          map={moonTexture}
          specular={new THREE.Color('#111111')}
          shininess={5}
        />
      </mesh>
    </group>
  );
}
