import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import * as Y from 'yjs';
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiArrowLeft } from 'react-icons/fi';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000';

// Deterministic color per user name
const CURSOR_COLORS = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
const getUserColor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length];
};

export default function Replay() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if user came from workspace or dashboard
  const cameFromWorkspace = document.referrer.includes('/workspace/') ||
    location.state?.from === 'workspace';

  const handleBack = () => {
    if (cameFromWorkspace) {
      navigate(`/workspace/${roomId}`);
    } else {
      navigate('/dashboard');
    }
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);

  // Yjs state at the current step
  const [shapes, setShapes] = useState([]);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [cursorPos, setCursorPos] = useState(null); // { x, y, userName, color }
  const [codeLine, setCodeLine] = useState(null); // line number being edited

  const playIntervalRef = useRef(null);
  const ydocRef = useRef(null);
  const prevShapesRef = useRef([]);
  const prevCodeRef = useRef('');

  // Fetch replay data
  useEffect(() => {
    const fetchReplay = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${SERVER_URL}/api/replay/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to load replay');

        setRoomInfo(data.room);
        setUpdates(data.updates);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchReplay();
  }, [roomId]);

  // Apply updates up to the current step
  const applyUpdatesToStep = useCallback((step) => {
    const ydoc = new Y.Doc();

    // Apply all updates from 0 to step
    for (let i = 0; i <= step && i < updates.length; i++) {
      Y.applyUpdate(ydoc, new Uint8Array(updates[i].update));
    }

    // Read state
    const yShapes = ydoc.getArray('shapes');
    const yText = ydoc.getText('code');
    const yMeta = ydoc.getMap('editor-meta');

    const newShapes = yShapes.toArray();
    const newCode = yText.toString();

    // Infer cursor position from what changed
    const userName = updates[step]?.userName || 'Anonymous';
    const color = getUserColor(userName);

    // Check if a new shape was added or last shape was modified
    if (newShapes.length > prevShapesRef.current.length) {
      // New shape added — cursor at its position
      const lastShape = newShapes[newShapes.length - 1];
      if (lastShape) {
        let x, y;
        if (lastShape.points && lastShape.points.length >= 2) {
          x = lastShape.points[lastShape.points.length - 2];
          y = lastShape.points[lastShape.points.length - 1];
        } else {
          x = lastShape.x || 400;
          y = lastShape.y || 300;
        }
        setCursorPos({ x, y, userName, color, tool: lastShape.type || 'pencil' });
      }
    } else if (newShapes.length > 0 && newShapes.length === prevShapesRef.current.length) {
      // Existing shape modified (drawing in progress) — cursor follows the path
      const lastShape = newShapes[newShapes.length - 1];
      const prevLastShape = prevShapesRef.current[prevShapesRef.current.length - 1];
      if (lastShape) {
        let x, y;
        if (lastShape.points && lastShape.points.length >= 2) {
          // For pencil/line — follow the latest point
          x = lastShape.points[lastShape.points.length - 2];
          y = lastShape.points[lastShape.points.length - 1];
        } else if (lastShape.type === 'rect') {
          // For rect — cursor at the bottom-right corner being dragged
          x = (lastShape.x || 0) + (lastShape.width || 0);
          y = (lastShape.y || 0) + (lastShape.height || 0);
        } else if (lastShape.type === 'circle') {
          // For circle — cursor at the edge
          x = (lastShape.x || 0) + (lastShape.radius || 0);
          y = lastShape.y || 300;
        } else {
          x = lastShape.x || 400;
          y = lastShape.y || 300;
        }
        setCursorPos({ x, y, userName, color, tool: lastShape.type || 'pencil' });
      }
    } else if (newCode !== prevCodeRef.current) {
      // Code changed — find which line
      const prevLines = prevCodeRef.current.split('\n').length;
      const newLines = newCode.split('\n').length;
      const changedLine = newLines > prevLines ? newLines : Math.max(newLines - 1, 0);
      setCodeLine({ line: changedLine, userName, color });
      setCursorPos(null);
    } else {
      setCursorPos(null);
      setCodeLine(null);
    }

    prevShapesRef.current = newShapes;
    prevCodeRef.current = newCode;

    setShapes(newShapes);
    setCode(newCode);
    setLanguage(yMeta.get('language') || 'javascript');

    ydocRef.current = ydoc;
  }, [updates]);

  // When step changes, rebuild state
  useEffect(() => {
    if (updates.length > 0) {
      applyUpdatesToStep(currentStep);
    }
  }, [currentStep, applyUpdatesToStep, updates.length]);

  // Play/Pause functionality
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= updates.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 200 / playSpeed);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, playSpeed, updates.length]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '—';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Loading
  if (loading) {
    return (
      <div style={styles.fullPage}>
        <p style={{ color: '#64748B', fontSize: 14 }}>Loading replay...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div style={styles.fullPage}>
        <p style={{ color: '#DC2626', fontSize: 14 }}>{error}</p>
        <button onClick={handleBack} style={styles.backBtn}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  // No updates
  if (updates.length === 0) {
    return (
      <div style={styles.fullPage}>
        <h2 style={{ color: '#1E3A8A', fontSize: 20, fontWeight: 700 }}>No Replay Data</h2>
        <p style={{ color: '#64748B', fontSize: 14, marginTop: 8 }}>
          This room has no recorded activity yet.
        </p>
        <button onClick={handleBack} style={styles.backBtn}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={handleBack}
            style={styles.iconBtn}
            title="Back"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ color: '#1E3A8A', fontSize: 18, fontWeight: 700, margin: 0 }}>
              Replay: {roomInfo?.name || roomId}
            </h1>
            <p style={{ color: '#64748B', fontSize: 12, margin: 0 }}>
              {updates.length} edits • Started {formatTime(updates[0]?.timestamp)}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={styles.badge}>Step {currentStep + 1} / {updates.length}</span>
          {updates[currentStep] && (
            <span style={styles.userBadge}>
              {updates[currentStep].userName}
            </span>
          )}
        </div>
      </div>

      {/* Main Content — split view */}
      <div style={styles.mainContent}>
        {/* Whiteboard Replay (shapes) */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>Whiteboard</div>
          <div style={styles.panelBody}>
            {shapes.length === 0 ? (
              <p style={{ color: '#94A3B8', textAlign: 'center', marginTop: 40 }}>
                No shapes at this point
              </p>
            ) : (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 600"
                  style={{ background: '#FFFFFF' }}
                >
                  {shapes.map((shape, i) => renderShapeSVG(shape, i))}
                </svg>
                {/* Replay cursor */}
                {cursorPos && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${(cursorPos.x / 800) * 100}%`,
                      top: `${(cursorPos.y / 600) * 100}%`,
                      pointerEvents: 'none',
                      zIndex: 10,
                      transition: 'left 0.15s ease, top 0.15s ease',
                    }}
                  >
                    <svg width="16" height="20" viewBox="0 0 16 20">
                      <path
                        d="M0 0 L0 14 L4 10 L8 18 L10 17 L6 9 L12 9 Z"
                        fill={cursorPos.color}
                        stroke="#fff"
                        strokeWidth="1"
                      />
                    </svg>
                    <div
                      style={{
                        position: 'absolute',
                        top: 14,
                        left: 12,
                        background: cursorPos.color,
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: 4,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <span style={{ opacity: 0.8, fontSize: 10 }}>
                        {cursorPos.tool === 'pencil' ? '✏️' :
                         cursorPos.tool === 'rect' ? '▭' :
                         cursorPos.tool === 'circle' ? '◯' :
                         cursorPos.tool === 'line' ? '╱' :
                         cursorPos.tool === 'arrow' ? '→' :
                         cursorPos.tool === 'text' ? 'T' : '✏️'}
                      </span>
                      {cursorPos.userName}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Code Replay */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            Code Editor
            <span style={styles.langBadge}>{language}</span>
          </div>
          <div style={styles.codeBody}>
            {code ? (
              <div style={{ position: 'relative' }}>
                <pre style={styles.codePre}>
                  {code.split('\n').map((line, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        background: codeLine && codeLine.line === i + 1 ? `${codeLine.color}15` : 'transparent',
                        borderLeft: codeLine && codeLine.line === i + 1 ? `3px solid ${codeLine.color}` : '3px solid transparent',
                        paddingLeft: 8,
                        position: 'relative',
                      }}
                    >
                      <span style={{ color: '#94A3B8', minWidth: 32, userSelect: 'none', fontSize: 12 }}>
                        {i + 1}
                      </span>
                      <span>{line}</span>
                      {codeLine && codeLine.line === i + 1 && (
                        <span
                          style={{
                            position: 'absolute',
                            right: 8,
                            top: 2,
                            fontSize: 10,
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: 3,
                            background: codeLine.color,
                            color: '#FFFFFF',
                          }}
                        >
                          {codeLine.userName}
                        </span>
                      )}
                    </div>
                  ))}
                </pre>
              </div>
            ) : (
              <pre style={styles.codePre}>{'// No code at this point'}</pre>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Scrubber */}
      <div style={styles.timeline}>
        <div style={styles.controls}>
          <button onClick={() => setCurrentStep(0)} style={styles.iconBtn} title="Go to start">
            <FiSkipBack size={16} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ ...styles.playBtn, background: isPlaying ? '#EF4444' : '#22C55E' }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <FiPause size={18} /> : <FiPlay size={18} />}
          </button>
          <button
            onClick={() => setCurrentStep(updates.length - 1)}
            style={styles.iconBtn}
            title="Go to end"
          >
            <FiSkipForward size={16} />
          </button>

          {/* Speed selector */}
          <select
            value={playSpeed}
            onChange={(e) => setPlaySpeed(Number(e.target.value))}
            style={styles.speedSelect}
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={4}>4x</option>
            <option value={8}>8x</option>
          </select>
        </div>

        {/* Slider */}
        <div style={styles.sliderContainer}>
          <span style={styles.timeLabel}>{formatTime(updates[0]?.timestamp)}</span>
          <input
            type="range"
            min={0}
            max={updates.length - 1}
            value={currentStep}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStep(Number(e.target.value));
            }}
            style={styles.slider}
          />
          <span style={styles.timeLabel}>{formatTime(updates[updates.length - 1]?.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

// Render shapes as SVG for the replay viewer
function renderShapeSVG(shape, key) {
  switch (shape.type) {
    case 'pencil':
      return (
        <polyline
          key={key}
          points={pairsToString(shape.points)}
          fill="none"
          stroke={shape.stroke || '#000'}
          strokeWidth={shape.strokeWidth || 2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case 'rect':
      return (
        <rect
          key={key}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          fill={shape.fill || 'none'}
          stroke={shape.stroke || '#000'}
          strokeWidth={shape.strokeWidth || 2}
        />
      );
    case 'circle':
      return (
        <circle
          key={key}
          cx={shape.x}
          cy={shape.y}
          r={shape.radius || 0}
          fill={shape.fill || 'none'}
          stroke={shape.stroke || '#000'}
          strokeWidth={shape.strokeWidth || 2}
        />
      );
    case 'line':
      return (
        <line
          key={key}
          x1={shape.points?.[0]}
          y1={shape.points?.[1]}
          x2={shape.points?.[2]}
          y2={shape.points?.[3]}
          stroke={shape.stroke || '#000'}
          strokeWidth={shape.strokeWidth || 2}
          strokeLinecap="round"
        />
      );
    case 'arrow': {
      const [x1, y1, x2, y2] = shape.points || [0, 0, 0, 0];
      return (
        <g key={key}>
          <line x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={shape.stroke || '#000'} strokeWidth={shape.strokeWidth || 2} />
          <polygon
            points={arrowHead(x1, y1, x2, y2)}
            fill={shape.stroke || '#000'}
          />
        </g>
      );
    }
    case 'text':
      return (
        <text
          key={key}
          x={shape.x}
          y={shape.y}
          fontSize={shape.fontSize || 16}
          fill={shape.fill || '#000'}
        >
          {shape.text}
        </text>
      );
    default:
      return null;
  }
}

function pairsToString(points = []) {
  let str = '';
  for (let i = 0; i < points.length; i += 2) {
    str += `${points[i]},${points[i + 1]} `;
  }
  return str.trim();
}

function arrowHead(x1, y1, x2, y2) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const len = 10;
  const a1x = x2 - len * Math.cos(angle - Math.PI / 6);
  const a1y = y2 - len * Math.sin(angle - Math.PI / 6);
  const a2x = x2 - len * Math.cos(angle + Math.PI / 6);
  const a2y = y2 - len * Math.sin(angle + Math.PI / 6);
  return `${x2},${y2} ${a1x},${a1y} ${a2x},${a2y}`;
}

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#F0F7FF',
    fontFamily: '"Poppins", system-ui, sans-serif',
    overflow: 'hidden',
  },
  fullPage: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F0F7FF',
    gap: 12,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    background: '#FFFFFF',
    borderBottom: '1px solid #DBEAFE',
    flexShrink: 0,
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    gap: 4,
    padding: 4,
  },
  panel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: '#FFFFFF',
    borderRadius: 12,
    border: '1px solid #DBEAFE',
    overflow: 'hidden',
  },
  panelHeader: {
    padding: '10px 16px',
    fontSize: 13,
    fontWeight: 700,
    color: '#1E3A8A',
    borderBottom: '1px solid #DBEAFE',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  panelBody: {
    flex: 1,
    overflow: 'auto',
    position: 'relative',
  },
  codeBody: {
    flex: 1,
    overflow: 'auto',
    background: '#FAFAFA',
  },
  codePre: {
    margin: 0,
    padding: 16,
    fontSize: 13,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    lineHeight: 1.6,
    color: '#1E293B',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  timeline: {
    padding: '12px 24px',
    background: '#FFFFFF',
    borderTop: '1px solid #DBEAFE',
    flexShrink: 0,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    border: '1px solid #DBEAFE',
    background: '#FFFFFF',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  playBtn: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    border: 'none',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    transition: 'all 0.15s',
  },
  speedSelect: {
    padding: '4px 8px',
    borderRadius: 6,
    border: '1px solid #DBEAFE',
    fontSize: 12,
    fontWeight: 600,
    color: '#475569',
    cursor: 'pointer',
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  slider: {
    flex: 1,
    height: 6,
    accentColor: '#2563EB',
    cursor: 'pointer',
  },
  timeLabel: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'ui-monospace, monospace',
    minWidth: 70,
  },
  badge: {
    fontSize: 11,
    fontWeight: 600,
    background: '#EFF6FF',
    color: '#2563EB',
    padding: '3px 8px',
    borderRadius: 6,
    border: '1px solid #DBEAFE',
  },
  userBadge: {
    fontSize: 11,
    fontWeight: 600,
    background: '#ECFDF5',
    color: '#047857',
    padding: '3px 8px',
    borderRadius: 6,
    border: '1px solid #A7F3D0',
  },
  langBadge: {
    fontSize: 10,
    fontWeight: 600,
    background: '#EFF6FF',
    color: '#2563EB',
    padding: '2px 6px',
    borderRadius: 4,
    border: '1px solid #DBEAFE',
    marginLeft: 'auto',
  },
  backBtn: {
    marginTop: 16,
    padding: '8px 20px',
    background: '#2563EB',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
