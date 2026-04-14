import { create } from 'zustand';

interface AppState {
  // 时间控制
  currentTime: Date;
  timeScale: number; // 1 = 实时, 60 = 1分钟/秒, 3600 = 1小时/秒
  isPlaying: boolean;

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
  tick: (deltaSeconds: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentTime: new Date(),
  timeScale: 1,
  isPlaying: true,

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

  tick: (deltaSeconds) => {
    const state = get();
    if (!state.isPlaying) return;
    const newTime = new Date(
      state.currentTime.getTime() + deltaSeconds * state.timeScale * 1000
    );
    set({ currentTime: newTime });
  },
}));
