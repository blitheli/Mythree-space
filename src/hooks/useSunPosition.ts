import { useMemo } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { getSunDirection } from '../utils/coordinates';
import * as THREE from 'three';

/**
 * 计算当前时间的太阳方向向量
 * 返回归一化的 Three.js Vector3，用于 directionalLight 的 position
 */
export function useSunPosition(): THREE.Vector3 {
  const currentTime = useAppStore((s) => s.currentTime);

  const sunDir = useMemo(() => {
    const [x, y, z] = getSunDirection(currentTime);
    // ECI -> Three.js 坐标：Y轴朝上
    return new THREE.Vector3(x, z, -y).normalize().multiplyScalar(50);
  }, [currentTime]);

  return sunDir;
}
