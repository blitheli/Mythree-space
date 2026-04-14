import { useAppStore } from '../stores/useAppStore';

export function InfoPanel() {
  const showOrbits = useAppStore((s) => s.showOrbits);
  const showLabels = useAppStore((s) => s.showLabels);
  const showGroundStations = useAppStore((s) => s.showGroundStations);
  const showAtmosphere = useAppStore((s) => s.showAtmosphere);
  const toggleOrbits = useAppStore((s) => s.toggleOrbits);
  const toggleLabels = useAppStore((s) => s.toggleLabels);
  const toggleGroundStations = useAppStore((s) => s.toggleGroundStations);
  const toggleAtmosphere = useAppStore((s) => s.toggleAtmosphere);

  const toggles = [
    { label: '🛤 轨道', active: showOrbits, toggle: toggleOrbits },
    { label: '🏷 标签', active: showLabels, toggle: toggleLabels },
    { label: '📡 地面站', active: showGroundStations, toggle: toggleGroundStations },
    { label: '🌐 大气层', active: showAtmosphere, toggle: toggleAtmosphere },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.title}>🚀 Mythree Space</div>
      <div style={styles.toggles}>
        {toggles.map(({ label, active, toggle }) => (
          <button
            key={label}
            style={{
              ...styles.toggleBtn,
              opacity: active ? 1 : 0.4,
            }}
            onClick={toggle}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={styles.hint}>
        鼠标拖拽旋转 · 滚轮缩放 · 右键平移
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: 12,
    padding: '14px 18px',
    border: '1px solid rgba(255,255,255,0.1)',
    maxWidth: 200,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  toggles: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: 13,
    cursor: 'pointer',
    textAlign: 'left',
    padding: '3px 0',
    transition: 'opacity 0.2s',
  },
  hint: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    marginTop: 10,
    lineHeight: '1.4',
  },
};
