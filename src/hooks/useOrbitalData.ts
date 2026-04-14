import { useState, useEffect, useRef } from 'react';
import { propagateTLE, eciToScene, computeOrbitPath } from '../utils/orbit';
import { useAppStore } from '../stores/useAppStore';

interface OrbitalState {
  position: [number, number, number];
  orbitPath: [number, number, number][];
}

/**
 * 根据 TLE 实时计算卫星位置和轨道路径
 */
export function useOrbitalData(
  tleLine1: string,
  tleLine2: string,
  periodMinutes: number = 92
): OrbitalState {
  const currentTime = useAppStore((s) => s.currentTime);
  const [state, setState] = useState<OrbitalState>({
    position: [0, 0, 0],
    orbitPath: [],
  });

  const pathRef = useRef<[number, number, number][]>([]);
  const lastPathUpdate = useRef<number>(0);

  useEffect(() => {
    // 更新卫星位置
    const eci = propagateTLE(tleLine1, tleLine2, currentTime);
    if (eci) {
      const scenePos = eciToScene(eci);

      // 每30秒重新计算轨道路径
      const now = currentTime.getTime();
      if (now - lastPathUpdate.current > 30000 || pathRef.current.length === 0) {
        pathRef.current = computeOrbitPath(
          tleLine1,
          tleLine2,
          currentTime,
          200,
          periodMinutes
        );
        lastPathUpdate.current = now;
      }

      setState({
        position: scenePos,
        orbitPath: pathRef.current,
      });
    }
  }, [currentTime, tleLine1, tleLine2, periodMinutes]);

  return state;
}
