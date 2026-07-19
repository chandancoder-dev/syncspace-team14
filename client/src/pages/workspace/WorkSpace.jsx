import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import WhiteBoard from './Whiteboard';
import CodeEditor from './CodeEditor';
import useSync from '../../hooks/useSync';

const MIN_PANEL_WIDTH = 200;

const WorkSpace = () => {
  const { roomId } = useParams();
  const { ydoc, connected, users, me, emitCursor } = useSync(roomId);
  const [leftWidth, setLeftWidth] = useState(50);
  const isDragging = useRef(false);
  const containerRef = useRef();



  const handleDividerMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (moveEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newLeftPx = moveEvent.clientX - rect.left;
      const newLeftPercent = (newLeftPx / rect.width) * 100;
      const minPercent = (MIN_PANEL_WIDTH / rect.width) * 100;
      const maxPercent = 100 - minPercent;
      setLeftWidth(Math.min(Math.max(newLeftPercent, minPercent), maxPercent));
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
  
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: '#5c5757',
    }}>
  
  
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0px 16px',
        height: 44,
        background: '#3d3d3d',
        borderBottom: '1px solid #464d57',
        borderShadow: '0 1px 4px rgba(0,0,0,0.08)',
        flexShrink: 0,
      }}>

        {/* LEFT side — room name and connection status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Green dot = connected, Red dot = disconnected */}
          <span style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: connected ? '#4ade80' : '#f87171',
            display: 'inline-block',
          }} />

          <span style={{ color: '#dee2e9', fontSize: 13 }}>
            Room: <strong style={{ color: '#75fff8' }}>{roomId}</strong>
          </span>

        </div>

        {/* RIGHT side — all users currently in the room */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

          <span style={{ color: '#dee2e9', fontSize: 12, marginRight: 4 }}>
            Online:
          </span>

          {/* Current user badge — always first */}
          <span style={{
            background: me.color,
            color: '#ffffff',
            fontSize: 12,
            padding: '3px 12px',
            borderRadius: 20,
            fontWeight: '500',
          }}>
            👤 {me.name} (you)
          </span>

          {/* Other users in the room */}
          {Array.from(users.values()).map((u, index) => (
            <span
              key={index}
              style={{
                background: u.user?.color || '#4b5563',
                color: '#ffffff',
                fontSize: 12,
                padding: '3px 12px',
                borderRadius: 20,
                fontWeight: '500',
              }}
            >
              👤 {u.user?.name || 'Unknown'}
            </span>
          ))}

        </div>

      </div>
   

      <div
        ref={containerRef}
        style={{ display: 'flex', flex: 1, overflow: 'hidden' }}
      >

        {/* Left panel — Whiteboard */}
        <div style={{
          width: `${leftWidth}%`,
          height: '100%',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <WhiteBoard
            ydoc={ydoc}
            me={me}
            users={users}
            emitCursor={emitCursor}
          />
        </div>

        {/* Divider — drag to resize panels */}
        <div
          onMouseDown={handleDividerMouseDown}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#6c63ff')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#3a3a3a')}
          style={{
            width: 5,
            height: '100%',
            background: '#3a3a3a',
            cursor: 'col-resize',
            flexShrink: 0,
          }}
        />

        {/* Right panel — Code Editor */}
        <div style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
          <CodeEditor
            ydoc={ydoc}
            me={me}
            users={users}
          />
        </div>

      </div>

    </div>
  );
};

export default WorkSpace;
