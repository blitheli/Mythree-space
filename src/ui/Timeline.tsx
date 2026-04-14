import { useTimeScale, TIME_SCALES } from '../hooks/useTimeScale';

export function Timeline() {
  const {
    currentTime,
    timeScale,
    setTimeScale,
    isPlaying,
    togglePlaying,
    resetToNow,
  } = useTimeScale();

  return (
    <div style={styles.container}>
      <div style={styles.timeDisplay}>
        🕐 {currentTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
      </div>

      <div style={styles.controls}>
        <button style={styles.btn} onClick={togglePlaying}>
          {isPlaying ? '⏸' : '▶️'}
        </button>
        <button style={styles.btn} onClick={resetToNow}>
          ⏱ 现在
        </button>

        {TIME_SCALES.map(({ label, value }) => (
          <button
            key={value}
            style={{
              ...styles.btn,
              ...(timeScale === value ? styles.btnActive : {}),
            }}
            onClick={() => setTimeScale(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(10px)',
    borderRadius: 12,
    padding: '10px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    border: '1px solid rgba(255,255,255,0.1)',
  },
  timeDisplay: {
    color: '#4da6ff',
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  controls: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  btn: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    borderRadius: 6,
    padding: '4px 10px',
    cursor: 'pointer',
    fontSize: 12,
    transition: 'all 0.2s',
  },
  btnActive: {
    background: '#4da6ff',
    borderColor: '#4da6ff',
    color: '#000',
    fontWeight: 'bold',
  },
};
