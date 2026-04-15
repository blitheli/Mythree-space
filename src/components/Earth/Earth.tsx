import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../stores/useAppStore';
import { getGMST } from '../../utils/coordinates';
import { Atmosphere } from './Atmosphere';
import { useSunPosition } from '../../hooks/useSunPosition';

/**
 * 地球组件 — 真实贴图 + 昼夜着色器 + 云层
 */
export function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const currentTime = useAppStore((s) => s.currentTime);
  const showAtmosphere = useAppStore((s) => s.showAtmosphere);
  const sunPosition = useSunPosition();

  // 加载贴图
  const dayMap = useLoader(THREE.TextureLoader, '/textures/earth_day.jpg');
  const nightMap = useLoader(THREE.TextureLoader, '/textures/earth_night.jpg');
  const cloudsMap = useLoader(THREE.TextureLoader, '/textures/earth_clouds.jpg');
  const normalMap = useLoader(THREE.TextureLoader, '/textures/earth_normal.jpg');
  const specularMap = useLoader(THREE.TextureLoader, '/textures/earth_specular.jpg');

  // 配置贴图
  [dayMap, nightMap, cloudsMap, normalMap, specularMap].forEach((tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  });

  // 昼夜混合着色器材质
  const earthMaterial = useRef(
    new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayMap },
        nightTexture: { value: nightMap },
        normalTexture: { value: normalMap },
        specularTexture: { value: specularMap },
        sunDirection: { value: new THREE.Vector3(1, 0, 0) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform sampler2D specularTexture;
        uniform vec3 sunDirection;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 sunDir = normalize(sunDirection);

          // 昼夜混合因子
          float dotNL = dot(normal, sunDir);
          float dayFactor = smoothstep(-0.1, 0.2, dotNL);

          // 采样贴图
          vec4 dayColor = texture2D(dayTexture, vUv);
          vec4 nightColor = texture2D(nightTexture, vUv);
          vec4 specular = texture2D(specularTexture, vUv);

          // 夜景发光效果（城市灯光）
          vec3 nightGlow = nightColor.rgb * 1.5;

          // 混合昼夜
          vec3 color = mix(nightGlow, dayColor.rgb, dayFactor);

          // 高光反射（海洋区域）
          vec3 viewDir = normalize(-vPosition);
          vec3 halfDir = normalize(sunDir + viewDir);
          float spec = pow(max(dot(normal, halfDir), 0.0), 32.0);
          color += spec * specular.r * 0.3 * dayFactor;

          // 大气散射边缘光
          float rim = 1.0 - max(dot(viewDir, normal), 0.0);
          color += vec3(0.3, 0.6, 1.0) * pow(rim, 3.0) * 0.15;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    })
  ).current;

  // 每帧更新
  useFrame(() => {
    if (earthRef.current) {
      const gmst = getGMST(currentTime);
      earthRef.current.rotation.y = gmst;
    }
    if (cloudsRef.current) {
      const gmst = getGMST(currentTime);
      // 云层比地球自转稍快
      cloudsRef.current.rotation.y = gmst + 0.0003;
    }

    // 更新太阳方向
    const sunDir = sunPosition.clone().normalize();
    earthMaterial.uniforms.sunDirection.value.copy(sunDir);
  });

  return (
    <group>
      {/* 地球本体 — 昼夜着色器 */}
      <mesh ref={earthRef} material={earthMaterial} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>

      {/* 云层 — 半透明覆盖 */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.005, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent
          opacity={0.35}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 大气层 */}
      {showAtmosphere && <Atmosphere />}
    </group>
  );
}
