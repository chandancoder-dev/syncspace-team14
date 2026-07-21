import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WhiteBoard from './Whiteboard';
import CodeEditor from './CodeEditor';
import useSync from '../../hooks/useSync';

const MIN_PANEL_WIDTH = 200;

const WorkSpace = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { ydoc, socket, connected, users, me, emitCursor } = useSync(roomId);
  const [leftWidth, setLeftWidth] = useState(50);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const isDragging = useRef(false);
  const containerRef = useRef();

  const handleLeaveRoom = () => {
    // Disconnect socket before navigating
    if (socket) socket.disconnect();
    navigate('/dashboard');
  };

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
      background: '#0F172A',
    }}>

      {/* ── Top Header Bar ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0px 24px',
        height: 54,
        background: '#1E293B',
        borderBottom: '1px solid #334155',
        boxShadow: '0 1px 6px rgba(0,0,0,0.3)',
        flexShrink: 0,
      }}>

        {/* LEFT — connection dot + room name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: connected ? '#4ade80' : '#f87171',
            display: 'inline-block',
            boxShadow: connected ? '0 0 6px #4ade80' : '0 0 6px #f87171',
          }} />
          <span style={{ color: '#CBD5E1', fontSize: 13 }}>
            Room:&nbsp;<strong style={{ color: '#FFFFFF' }}>{roomId || 'Unknown'}</strong>
          </span>
        </div>

        {/* CENTER — online users */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#CBD5E1', fontSize: 12 }}>Online:</span>

          {/* Current user — always first */}
          <span style={{
            background: me.color,
            color: '#ffffff',
            fontSize: 12,
            padding: '3px 12px',
            borderRadius: 20,
            fontWeight: '600',
          }}>
            👤 {me.name} (you)
          </span>

          {/* Other users */}
          {Array.from(users.values()).map((u, index) => (
            <span
              key={index}
              style={{
                background: u.user?.color || '#334155',
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

        {/* RIGHT — Leave Room button */}
        <button
          onClick={() => setShowLeaveConfirm(true)}
          title="Leave Room"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#dc2626';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#c6d2e8c4';
            e.currentTarget.style.color = '#374151';
          }}
          style={{
            width: 38,
            height: 38,
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: 17,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#c6d2e8c4',
            color: '#374151',
            transition: 'all 0.15s',
          }}
        >
          ➜
        </button>

      </div>


      {/* ── Main Panels ── */}
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

        {/* Divider */}
        <div
          onMouseDown={handleDividerMouseDown}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#2563EB')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#334155')}
          style={{
            width: 5,
            height: '100%',
            background: '#334155',
            cursor: 'col-resize',
            flexShrink: 0,
            transition: 'background 0.15s',
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

      {/* ── Leave Confirmation Modal ── */}
      {showLeaveConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(2px)',
        }}>
          <div style={{
            background: '#1E293B',
            border: '1px solid #334155',
            borderRadius: 14,
            padding: '32px 36px',
            width: 360,
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>➜</div>
            <h2 style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>
              Leave Room?
            </h2>
            <p style={{ color: '#CBD5E1', fontSize: 14, margin: '0 0 28px', lineHeight: 1.6 }}>
              You will be disconnected from <strong style={{ color: '#FFFFFF' }}>{roomId}</strong> and returned to your dashboard.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => setShowLeaveConfirm(false)}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#334155')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  background: 'transparent',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  color: '#CBD5E1',
                  fontSize: 14,
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveRoom}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#991b1b')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#dc2626')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  background: '#dc2626',
                  border: 'none',
                  borderRadius: 8,
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                ➜ Leave
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default WorkSpace;
