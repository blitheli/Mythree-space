import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../stores/useAppStore';
import { getGMST } from '../../utils/coordinates';
import { Atmosphere } from './Atmosphere';

export function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentTime = useAppStore((s) => s.currentTime);
  const showAtmosphere = useAppStore((s) => s.showAtmosphere);

  // 根据 GMST 设置地球自转角度
  useFrame(() => {
    if (meshRef.current) {
      const gmst = getGMST(currentTime);
      meshRef.current.rotation.y = gmst;
    }
  });

  // 程序化地球材质（无需纹理文件）
  const earthMaterial = useMemo(() => {
    // 创建一个简单的地球颜色纹理
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // 海洋底色
    ctx.fillStyle = '#1a5276';
    ctx.fillRect(0, 0, 512, 256);

    // 简单的大陆轮廓（程序化生成）
    ctx.fillStyle = '#2d5f2d';
    // 欧亚大陆
    ctx.beginPath();
    ctx.ellipse(300, 80, 80, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    // 非洲
    ctx.beginPath();
    ctx.ellipse(280, 140, 25, 40, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // 北美
    ctx.beginPath();
    ctx.ellipse(120, 80, 40, 30, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // 南美
    ctx.beginPath();
    ctx.ellipse(150, 160, 20, 40, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // 澳大利亚
    ctx.beginPath();
    ctx.ellipse(420, 160, 20, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    // 南极
    ctx.fillStyle = '#dfe6e9';
    ctx.fillRect(0, 230, 512, 26);
    // 北极
    ctx.fillRect(0, 0, 512, 10);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;

    return new THREE.MeshPhongMaterial({
      map: texture,
      specular: new THREE.Color('#333333'),
      shininess: 25,
    });
  }, []);

  return (
    <group>
      {/* 地球本体 */}
      <mesh ref={meshRef} material={earthMaterial}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>

      {/* 大气层 */}
      {showAtmosphere && <Atmosphere />}
    </group>
  );
}
