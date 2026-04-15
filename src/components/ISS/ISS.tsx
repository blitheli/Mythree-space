import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useOrbitalData } from '../../hooks/useOrbitalData';
import { ISS_TLE } from '../../data/celestial-objects';
import { useAppStore } from '../../stores/useAppStore';

// 预加载 ISS 模型
useGLTF.preload('/models/iss.glb');

export function ISS() {
  const groupRef = useRef<THREE.Group>(null);
  const showOrbits = useAppStore((s) => s.showOrbits);
  const showLabels = useAppStore((s) => s.showLabels);
  const setIssPosition = useAppStore((s) => s.setIssPosition);

  const { position, orbitPath } = useOrbitalData(
    ISS_TLE.line1,
    ISS_TLE.line2,
    92
  );

  // 加载 ISS GLB 模型
  const { scene: issModel } = useGLTF('/models/iss.glb');

  // 克隆模型并设置阴影
  const issScene = useMemo(() => {
    const clone = issModel.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // 确保材质对光照有响应
        if (child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.needsUpdate = true;
        }
      }
    });
    return clone;
  }, [issModel]);

  // 计算模型的合适缩放
  const modelScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(issScene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    // ISS 实际约 109m，在场景中显示为 0.06 个地球半径
    const targetSize = 0.06;
    return targetSize / maxDim;
  }, [issScene]);

  // 将轨道路径转为 Vector3 数组
  const orbitPoints = useMemo(() => {
    return orbitPath.map((p) => new THREE.Vector3(...p));
  }, [orbitPath]);

  // 更新 ISS 位置到 store（供相机跟随）
  useEffect(() => {
    setIssPosition(new THREE.Vector3(...position));
  }, [position, setIssPosition]);

  // 每帧更新 ISS 位置和姿态
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...position);
      // ISS 姿态：始终面向飞行方向（沿轨道切线）
      // 简化处理：让 ISS 始终朝向地心
      groupRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <group>
      {/* ISS 模型 */}
      <group ref={groupRef}>
        <primitive
          object={issScene}
          scale={modelScale}
          rotation={[Math.PI / 2, 0, 0]}
        />

        {/* 轨道高度指示光点 */}
        <mesh>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshBasicMaterial color="#ff6b6b" />
        </mesh>

        {/* 发光效果 */}
        <pointLight color="#ffffff" intensity={0.3} distance={0.5} />
      </group>

      {/* 标签 */}
      {showLabels && (
        <group position={position}>
          <Html center style={{ pointerEvents: 'none' }}>
            <div
              style={{
                color: '#ff6b6b',
                fontSize: '12px',
                fontWeight: 'bold',
                textShadow: '0 0 4px rgba(0,0,0,0.8)',
                whiteSpace: 'nowrap',
                transform: 'translateY(-24px)',
                background: 'rgba(0,0,0,0.5)',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(255,107,107,0.3)',
              }}
            >
              🛰 ISS
            </div>
          </Html>
        </group>
      )}

      {/* 轨道线 */}
      {showOrbits && orbitPoints.length > 2 && (
        <Line
          points={orbitPoints}
          color="#ff6b6b"
          lineWidth={1.5}
          transparent
          opacity={0.4}
        />
      )}
    </group>
  );
}
