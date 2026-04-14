import { useRef, useMemo } from 'react';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useOrbitalData } from '../../hooks/useOrbitalData';
import { ISS_TLE } from '../../data/celestial-objects';
import { useAppStore } from '../../stores/useAppStore';

export function ISS() {
  const markerRef = useRef<THREE.Mesh>(null);
  const showOrbits = useAppStore((s) => s.showOrbits);
  const showLabels = useAppStore((s) => s.showLabels);

  const { position, orbitPath } = useOrbitalData(
    ISS_TLE.line1,
    ISS_TLE.line2,
    92
  );

  // 将轨道路径转为 Vector3 数组
  const orbitPoints = useMemo(() => {
    return orbitPath.map((p) => new THREE.Vector3(...p));
  }, [orbitPath]);

  return (
    <group>
      {/* ISS 标记点 */}
      <mesh ref={markerRef} position={position}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color="#ff6b6b" />
      </mesh>

      {/* 发光效果 */}
      <mesh position={position}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#ff6b6b" transparent opacity={0.3} />
      </mesh>

      {/* 标签 */}
      {showLabels && (
        <Html position={position} center style={{ pointerEvents: 'none' }}>
          <div
            style={{
              color: '#ff6b6b',
              fontSize: '12px',
              fontWeight: 'bold',
              textShadow: '0 0 4px rgba(0,0,0,0.8)',
              whiteSpace: 'nowrap',
              transform: 'translateY(-20px)',
            }}
          >
            🛰 ISS
          </div>
        </Html>
      )}

      {/* 轨道线 */}
      {showOrbits && orbitPoints.length > 2 && (
        <Line
          points={orbitPoints}
          color="#ff6b6b"
          lineWidth={1}
          transparent
          opacity={0.5}
        />
      )}
    </group>
  );
}
