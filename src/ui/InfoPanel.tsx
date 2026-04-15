import { useAppStore } from '../stores/useAppStore';
import type { CameraView } from '../stores/useAppStore';

export function InfoPanel() {
  const showOrbits = useAppStore((s) => s.showOrbits);
  const showLabels = useAppStore((s) => s.showLabels);
  const showGroundStations = useAppStore((s) => s.showGroundStations);
  const showAtmosphere = useAppStore((s) => s.showAtmosphere);
  const cameraView = useAppStore((s) => s.cameraView);
  const setCameraView = useAppStore((s) => s.setCameraView);
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

  const views: { label: string; value: CameraView; icon: string }[] = [
    { label: '全球', value: 'global', icon: '🌍' },
    { label: 'ISS', value: 'iss', icon: '🛰' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.title}>🚀 Mythree Space</div>

      {/* 视角切换 */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>视角</div>
        <div style={styles.viewBtns}>
          {views.map(({ label, value, icon }) => (
            <button
              key={value}
              style={{
                ...styles.viewBtn,
                ...(cameraView === value ? styles.viewBtnActive : {}),
              }}
              onClick={() => setCameraView(value)}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* 显示控制 */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>显示</div>
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
      </div>

      <div style={styles.hint}>
        {cameraView === 'global'
          ? '拖拽旋转 · 滚轮缩放 · 右键平移'
          : '相机跟随 ISS · 滚轮缩放 · 拖拽旋转'}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(12px)',
    borderRadius: 12,
    padding: '14px 18px',
    border: '1px solid rgba(255,255,255,0.1)',
    maxWidth: 220,
    userSelect: 'none',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  section: {
    marginBottom: 10,
  },
  sectionLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  viewBtns: {
    display: 'flex',
    gap: 6,
  },
  viewBtn: {
    flex: 1,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#ccc',
    borderRadius: 6,
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: 12,
    transition: 'all 0.2s',
    textAlign: 'center' as const,
  },
  viewBtnActive: {
    background: 'rgba(77, 166, 255, 0.3)',
    borderColor: '#4da6ff',
    color: '#fff',
    fontWeight: 'bold',
  },
  toggles: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: 13,
    cursor: 'pointer',
    textAlign: 'left' as const,
    padding: '3px 0',
    transition: 'opacity 0.2s',
  },
  hint: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
    marginTop: 8,
    lineHeight: '1.4',
  },
};
