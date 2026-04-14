import { Html } from '@react-three/drei';
import { GROUND_STATIONS } from '../../data/celestial-objects';
import { latLonToVec3 } from '../../utils/orbit';
import { useAppStore } from '../../stores/useAppStore';
import { getGMST } from '../../utils/coordinates';
import * as THREE from 'three';
import { useMemo } from 'react';

/**
 * 地面站标记 — 显示在地球表面
 */
export function GroundStations() {
  const showGroundStations = useAppStore((s) => s.showGroundStations);
  const showLabels = useAppStore((s) => s.showLabels);
  const currentTime = useAppStore((s) => s.currentTime);

  const gmst = useMemo(() => getGMST(currentTime), [currentTime]);

  if (!showGroundStations) return null;

  return (
    <group rotation={[0, gmst, 0]}>
      {GROUND_STATIONS.map((station) => {
        const pos = latLonToVec3(station.lat, station.lon, 1.01);
        return (
          <group key={station.name} position={pos}>
            {/* 站点标记 */}
            <mesh>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshBasicMaterial color={station.color} />
            </mesh>

            {/* 标签 */}
            {showLabels && (
              <Html center style={{ pointerEvents: 'none' }}>
                <div
                  style={{
                    color: station.color,
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textShadow: '0 0 3px rgba(0,0,0,0.9)',
                    whiteSpace: 'nowrap',
                    transform: 'translateY(-14px)',
                  }}
                >
                  📡 {station.name}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
