// ISS TLE (定期更新)
export const ISS_TLE = {
  name: 'ISS (ZARYA)',
  line1: '1 25544U 98067A   24001.50000000  .00016717  00000-0  10270-3 0  9003',
  line2: '2 25544  51.6400 208.9163 0006703  40.5765 319.5647 15.49560722999999',
};

// 可追踪的卫星列表
export const SATELLITES = [
  {
    name: 'ISS (ZARYA)',
    noradId: 25544,
    tle: ISS_TLE,
    color: '#ff6b6b',
    description: '国际空间站',
  },
];

// 地面站
export const GROUND_STATIONS = [
  { name: '北京', lat: 39.9042, lon: 116.4074, color: '#ffdd57' },
  { name: '酒泉', lat: 40.9581, lon: 100.2914, color: '#ff6b6b' },
  { name: '西昌', lat: 28.2463, lon: 102.0269, color: '#48dbfb' },
  { name: '文昌', lat: 19.6144, lon: 110.9510, color: '#0abde3' },
  { name: '太原', lat: 38.8491, lon: 112.5603, color: '#ff9f43' },
];

// ASTROX API 配置
export const ASTROX_API = {
  baseUrl: 'http://astrox.cn:8765',
  endpoints: {
    sgp4: '/Propagator/sgp4',
    j2: '/Propagator/J2',
    hpop: '/Propagator/HPOP',
    twobody: '/Propagator/TwoBody',
    queryTle: '/Query/TLE',
    queryCity: '/Query/City',
    queryFacility: '/Query/Facility',
    lightingTimes: '/LightingTimes',
    access: '/Access',
  },
};
