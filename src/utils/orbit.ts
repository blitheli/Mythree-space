import * as satellite from 'satellite.js';

/**
 * 从 TLE 计算卫星 ECI 位置
 * @returns [x, y, z] in km
 */
export function propagateTLE(
  tleLine1: string,
  tleLine2: string,
  date: Date
): [number, number, number] | null {
  try {
    const satrec = satellite.twoline2satrec(tleLine1, tleLine2);
    const positionAndVelocity = satellite.propagate(satrec, date);

    if (typeof positionAndVelocity.position === 'boolean') return null;

    const pos = positionAndVelocity.position as satellite.EciVec3<number>;
    return [pos.x, pos.y, pos.z];
  } catch {
    return null;
  }
}

/**
 * ECI 坐标转场景坐标（归一化到地球半径=1）
 */
export function eciToScene(
  eciKm: [number, number, number],
  earthRadius: number = 6371
): [number, number, number] {
  return [
    eciKm[0] / earthRadius,
    eciKm[2] / earthRadius, // Three.js Y轴朝上，对应 ECI Z轴
    -eciKm[1] / earthRadius,
  ];
}

/**
 * 计算轨道轨迹点（用于绘制轨道线）
 */
export function computeOrbitPath(
  tleLine1: string,
  tleLine2: string,
  date: Date,
  points: number = 200,
  periodMinutes: number = 92 // ISS 轨道周期约92分钟
): [number, number, number][] {
  const path: [number, number, number][] = [];
  const startTime = date.getTime();

  for (let i = 0; i < points; i++) {
    const t = new Date(startTime + (i / points) * periodMinutes * 60 * 1000);
    const eci = propagateTLE(tleLine1, tleLine2, t);
    if (eci) {
      path.push(eciToScene(eci));
    }
  }

  return path;
}

/**
 * 经纬度转 3D 坐标
 */
export function latLonToVec3(
  lat: number,
  lon: number,
  radius: number = 1
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return [x, y, z];
}
