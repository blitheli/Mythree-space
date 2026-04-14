/**
 * 计算格林尼治恒星时角 (GMST)
 */
export function getGMST(date: Date): number {
  const jd =
    date.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525.0;
  let gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000.0;
  gmst = ((gmst % 360) + 360) % 360;
  return gmst * (Math.PI / 180);
}

/**
 * 计算太阳在 ECI 坐标系中的方向向量（简化模型）
 */
export function getSunDirection(date: Date): [number, number, number] {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const n = jd - 2451545.0;
  const L = ((280.46 + 0.9856474 * n) % 360) * (Math.PI / 180);
  const g = ((357.528 + 0.9856003 * n) % 360) * (Math.PI / 180);
  const lambda = L + 1.915 * (Math.PI / 180) * Math.sin(g) + 0.02 * (Math.PI / 180) * Math.sin(2 * g);
  const epsilon = 23.439 * (Math.PI / 180) - 0.0000004 * (Math.PI / 180) * n;

  const x = Math.cos(lambda);
  const y = Math.cos(epsilon) * Math.sin(lambda);
  const z = Math.sin(epsilon) * Math.sin(lambda);

  return [x, y, z];
}
