# 🚀 Mythree Space

基于 **React Three Fiber (R3F)** 的 3D 太空可视化项目 — 地球、月球、ISS 轨道追踪。

![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![Three.js](https://img.shields.io/badge/Three.js-r170-black?logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)

## ✨ 功能特性

- 🌍 **地球** — 自转、昼夜效果、大气层光晕（自定义着色器）
- 🌙 **月球** — 公转运动、潮汐锁定、环形山纹理
- 🛰 **ISS 追踪** — 基于 TLE/SGP4 实时轨道递推、轨道线可视化
- ⭐ **星空** — 5000+ 粒子系统、闪烁效果、颜色分布
- 📡 **地面站** — 中国航天发射场标注（酒泉/西昌/文昌/太原）
- 🎮 **交互控制** — 旋转、缩放、平移、时间缩放（实时~1天/秒）
- 🌞 **太阳光照** — 根据天文算法实时计算太阳位置

## 🏗 技术栈

| 技术 | 用途 |
|------|------|
| React 18 + TypeScript | UI 框架 |
| Three.js + R3F | 3D 渲染引擎 |
| @react-three/drei | 辅助组件（OrbitControls, Html, Line） |
| Zustand | 轻量状态管理 |
| satellite.js | SGP4 轨道递推 |
| Vite | 构建工具 |

## 📁 项目结构

```
src/
├── components/          # 3D 场景组件
│   ├── Earth/           # 地球（昼夜渲染、大气层、地面站）
│   ├── Moon/            # 月球（月相、公转）
│   ├── ISS/             # 国际空间站（轨道追踪）
│   ├── Stars/           # 星空粒子系统
│   ├── CameraControls/  # 相机控制器
│   └── Scene.tsx        # 场景根组件
├── hooks/               # 自定义 Hooks
│   ├── useOrbitalData   # 轨道数据计算
│   ├── useSunPosition   # 太阳位置
│   └── useTimeScale     # 时间缩放
├── utils/               # 工具函数
│   ├── orbit.ts         # 轨道计算
│   ├── celestial.ts     # 天体常数
│   └── coordinates.ts   # 坐标变换
├── data/                # 静态数据（TLE、地面站）
├── stores/              # Zustand 状态管理
└── ui/                  # 2D UI 覆盖层
```

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 🔌 ASTROX API 集成

项目预留了 [ASTROX Web API](http://astrox.cn:8765) 接口：

- `/Propagator/sgp4` — SGP4 轨道递推
- `/Propagator/HPOP` — 高精度轨道递推
- `/Query/TLE` — 卫星 TLE 查询
- `/LightingTimes` — 光照时间计算
- `/Access` — 可见性分析

## 📝 License

MIT
