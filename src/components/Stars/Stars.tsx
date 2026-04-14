import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 星空粒子系统 — 使用 Points + BufferGeometry
 */
export function Stars({ count = 5000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // 随机分布在球壳上
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 200 + Math.random() * 100;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // 星星颜色变化（白色为主，少量蓝/橙）
      const colorType = Math.random();
      if (colorType > 0.95) {
        // 蓝色星
        colors[i * 3] = 0.6;
        colors[i * 3 + 1] = 0.7;
        colors[i * 3 + 2] = 1.0;
      } else if (colorType > 0.9) {
        // 橙色星
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 0.5;
      } else {
        // 白色星
        const brightness = 0.7 + Math.random() * 0.3;
        colors[i * 3] = brightness;
        colors[i * 3 + 1] = brightness;
        colors[i * 3 + 2] = brightness;
      }

      // 随机大小
      sizes[i] = 0.5 + Math.random() * 2.0;
    }

    return { positions, colors, sizes };
  }, [count]);

  // 星星闪烁效果
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const sizeAttr = pointsRef.current.geometry.getAttribute('size') as THREE.BufferAttribute;
      const time = clock.getElapsedTime();

      for (let i = 0; i < Math.min(100, count); i++) {
        const idx = Math.floor(Math.random() * count);
        sizeAttr.array[idx] = sizes[idx] * (0.8 + 0.4 * Math.sin(time * 2 + idx));
      }
      sizeAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={1.5}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}
