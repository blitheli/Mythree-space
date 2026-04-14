import { useCallback } from 'react';
import { useAppStore } from '../stores/useAppStore';

const TIME_SCALES = [
  { label: '实时', value: 1 },
  { label: '10x', value: 10 },
  { label: '1分钟/秒', value: 60 },
  { label: '10分钟/秒', value: 600 },
  { label: '1小时/秒', value: 3600 },
  { label: '1天/秒', value: 86400 },
];

export function useTimeScale() {
  const timeScale = useAppStore((s) => s.timeScale);
  const setTimeScale = useAppStore((s) => s.setTimeScale);
  const isPlaying = useAppStore((s) => s.isPlaying);
  const togglePlaying = useAppStore((s) => s.togglePlaying);
  const currentTime = useAppStore((s) => s.currentTime);
  const setCurrentTime = useAppStore((s) => s.setCurrentTime);

  const resetToNow = useCallback(() => {
    setCurrentTime(new Date());
  }, [setCurrentTime]);

  return {
    timeScale,
    setTimeScale,
    isPlaying,
    togglePlaying,
    currentTime,
    setCurrentTime,
    resetToNow,
    TIME_SCALES,
  };
}

export { TIME_SCALES };
