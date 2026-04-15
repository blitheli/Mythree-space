import { Html } from '@react-three/drei';
import { GROUND_STATIONS } from '../../data/celestial-objects';
import { latLonToVec3 } from '../../utils/orbit';
import { useAppStore } from '../../stores/useAppStore';
import { getGMST } from '../../utils/coordinates';
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const _stationWorldPos = new THREE.Vector3();
const _cameraDir = new THREE.Vector3();
const _earthCenter = new THREE.Vector3(0, 0, 0);

/**
 * 地面站标记 — 背面自动隐藏
 * 通过检测站点法线与相机方向的点积来判断可见性
 */
export function GroundStations() {
  const showGroundStations = useAppStore((s) => s.showGroundStations);
  const showLabels = useAppStore((s) => s.showLabels);
  const currentTime = useAppStore((s) => s.currentTime);

  const gmst = useMemo(() => getGMST(currentTime), [currentTime]);

  if (!showGroundStations) return null;

  return (
    <group rotation={[0, gmst, 0]}>
      {GROUND_STATIONS.map((station) => (
        <StationMarker
          key={station.name}
          station={station}
          showLabels={showLabels}
        />
      ))}
    </group>
  );
}

interface StationMarkerProps {
  station: { name: string; lat: number; lon: number; color: string };
  showLabels: boolean;
}

/**
 * 单个地面站——每帧检测是否在地球正面
 */
function StationMarker({ station, showLabels }: StationMarkerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const markerRef = useRef<THREE.Mesh>(null);
  const htmlRef = useRef<HTMLDivElement>(null);
  const pos = useMemo(
    () => latLonToVec3(station.lat, station.lon, 1.01),
    [station.lat, station.lon]
  );
  const { camera } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;

    // 获取站点世界坐标
    groupRef.current.getWorldPosition(_stationWorldPos);

    // 站点法线方向（从地心指向站点）
    const normal = _stationWorldPos.clone().sub(_earthCenter).normalize();

    // 相机方向（从站点指向相机）
    _cameraDir.copy(camera.position).sub(_stationWorldPos).normalize();

    // 点积 > 0 表示站点朝向相机（正面）
    const dot = normal.dot(_cameraDir);
    const visible = dot > 0.05; // 略微提前隐藏，避免边缘闪烁

    if (markerRef.current) {
      markerRef.current.visible = visible;
    }
    if (htmlRef.current) {
      htmlRef.current.style.display = visible ? 'block' : 'none';
    }
  });

  return (
    <group ref={groupRef} position={pos}>
      {/* 站点标记 */}
      <mesh ref={markerRef}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color={station.color} />
      </mesh>

      {/* 标签 - occlude=false 因为我们手动控制可见性 */}
      {showLabels && (
        <Html center style={{ pointerEvents: 'none' }} zIndexRange={[10, 0]}>
          <div
            ref={htmlRef}
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
}
