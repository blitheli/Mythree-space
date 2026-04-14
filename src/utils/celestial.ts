// 天体常数
export const EARTH_RADIUS = 6371; // km
export const MOON_RADIUS = 1737.4; // km
export const MOON_DISTANCE = 384400; // km (平均地月距离)
export const AU = 149597870.7; // km (天文单位)
export const G = 6.674e-11; // 万有引力常数 m³/(kg·s²)
export const EARTH_MU = 398600.4418; // km³/s² (地球引力常数)

// 场景缩放比例 (1 unit = EARTH_RADIUS)
export const SCALE = 1 / EARTH_RADIUS;
export const MOON_SCALE_DISTANCE = 30; // 场景中月球距离（为了视觉效果缩短）
export const MOON_SCALE_SIZE = 0.27; // 月球/地球半径比

// 颜色常量
export const COLORS = {
  earth: {
    atmosphere: '#4da6ff',
    ocean: '#1a5276',
    land: '#2ecc71',
  },
  moon: {
    surface: '#c0c0c0',
  },
  iss: {
    orbit: '#ff6b6b',
    marker: '#ff0000',
  },
  sun: {
    light: '#fff5e6',
  },
} as const;
