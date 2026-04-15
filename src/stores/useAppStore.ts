import { create } from 'zustand';
import * as THREE from 'three';

export type CameraView = 'global' | 'iss';

interface AppState {
  // 时间控制
  currentTime: Date;
  timeScale: number; // 1 = 实时, 60 = 1分钟/秒, 3600 = 1小时/秒
  isPlaying: boolean;

  // 相机视角
  cameraView: CameraView;
  issPosition: THREE.Vector3; // ISS 当前世界坐标（供相机跟随）

  // UI 状态
  selectedObject: string | null;
  showOrbits: boolean;
  showLabels: boolean;
  showGroundStations: boolean;
  showAtmosphere: boolean;

  // Actions
  setCurrentTime: (time: Date) => void;
  setTimeScale: (scale: number) => void;
  togglePlaying: () => void;
  setSelectedObject: (name: string | null) => void;
  toggleOrbits: () => void;
  toggleLabels: () => void;
  toggleGroundStations: () => void;
  toggleAtmosphere: () => void;
  setCameraView: (view: CameraView) => void;
  setIssPosition: (pos: THREE.Vector3) => void;
  tick: (deltaSeconds: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentTime: new Date(),
  timeScale: 1,
  isPlaying: true,

  cameraView: 'global',
  issPosition: new THREE.Vector3(0, 0, 2),

  selectedObject: null,
  showOrbits: true,
  showLabels: true,
  showGroundStations: true,
  showAtmosphere: true,

  setCurrentTime: (time) => set({ currentTime: time }),
  setTimeScale: (scale) => set({ timeScale: scale }),
  togglePlaying: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setSelectedObject: (name) => set({ selectedObject: name }),
  toggleOrbits: () => set((s) => ({ showOrbits: !s.showOrbits })),
  toggleLabels: () => set((s) => ({ showLabels: !s.showLabels })),
  toggleGroundStations: () => set((s) => ({ showGroundStations: !s.showGroundStations })),
  toggleAtmosphere: () => set((s) => ({ showAtmosphere: !s.showAtmosphere })),
  setCameraView: (view) => set({ cameraView: view }),
  setIssPosition: (pos) => set({ issPosition: pos }),

  tick: (deltaSeconds) => {
    const state = get();
    if (!state.isPlaying) return;
    const newTime = new Date(
      state.currentTime.getTime() + deltaSeconds * state.timeScale * 1000
    );
    set({ currentTime: newTime });
  },
}));
