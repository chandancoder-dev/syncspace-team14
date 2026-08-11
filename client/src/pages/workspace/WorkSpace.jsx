import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import WhiteBoard from "./Whiteboard";
import CodeEditor from "./CodeEditor";
import WorkSpaceHeader from "./WorkSpaceHeader";
import ChatPanel from "../../components/ChatPanel";
import useSync from "../../hooks/useSync";
import VideoPanel from "../../components/VideoCall/VideoPanel";
import useVideoCall from "../../hooks/useVideoCall";

const MIN_PANEL_WIDTH = 200;

// Draggable floating chat panel
const DraggableChat = ({ onClose, socket, roomId, me, users }) => {
  const [pos, setPos] = useState({ x: window.innerWidth - 660, y: window.innerHeight - 450 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging.current) return;
      setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    };
    const handleMouseUp = () => {
      dragging.current = false;
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: pos.y,
        left: pos.x,
        width: 320,
        height: 380,
        borderRadius: 14,
        border: '1px solid #DBEAFE',
        boxShadow: '0 12px 40px rgba(30, 58, 138, 0.2)',
        overflow: 'hidden',
        zIndex: 50,
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Drag handle */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          padding: '6px 12px',
          background: '#F8FAFC',
          borderBottom: '1px solid #DBEAFE',
          cursor: 'move',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: '#1E3A8A' }}>💬 Chat</span>
        <button
          onClick={onClose}
          style={{
            width: 20, height: 20, borderRadius: 4,
            border: 'none', background: 'transparent',
            color: '#64748B', cursor: 'pointer', fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ✕
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <ChatPanel
          onClose={onClose}
          socket={socket}
          roomId={roomId}
          me={me}
          users={users}
        />
      </div>
    </div>
  );
};

const WorkSpace = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { ydoc, awareness, socket, connected, users, me, emitCursor } =
    useSync(roomId);
   const {
  localVideoRef,
  stream,
  cameraOn,
  toggleCamera,
  stopCamera,
} = useVideoCall();
  const [leftWidth, setLeftWidth] = useState(50);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const isDragging = useRef(false);
  const containerRef = useRef();

  // Check if current user is the room host
  useEffect(() => {
    const checkHost = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const userId = storedUser ? JSON.parse(storedUser).id : null;
        if (!token || !userId) return;

        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL || "http://localhost:8000"}/api/rooms/${roomId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.ok) {
          const data = await res.json();
          setIsHost(data.room?.createdBy === userId);
        }
      } catch {
        /* silent */
      }
    };
    checkHost();
  }, [roomId]);

  const handleLeaveRoom = () => {
  // Stop camera & microphone
  stopCamera();

  // Disconnect socket
  if (socket) {
    socket.disconnect();
  }

  // Go back to dashboard
  navigate("/dashboard");
};

  const handleDividerMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

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
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "#F0F7FF",
        fontFamily: '"Poppins", system-ui, sans-serif',
      }}
    >
      {/* ── Top Header Bar ── */}
      <WorkSpaceHeader
        roomId={roomId}
        connected={connected}
        me={me}
        users={users}
        isHost={isHost}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        isVideoOpen={isVideoOpen}
        setIsVideoOpen={setIsVideoOpen}
        setShowLeaveConfirm={setShowLeaveConfirm}
      />

      {/* Workspace + Video */}
      <div
        ref={containerRef}
        style={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Whiteboard */}
        <div
          style={{
            width: `${leftWidth}%`,
            overflow: "hidden",
            flexShrink: 1,
            minWidth: 150,
            transition: "width 0.2s ease",
          }}
        >
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
          style={{
            width: 4,
            background: "#BFDBFE",
            cursor: "col-resize",
            flexShrink: 0,
          }}
        />

        {/* Code Editor + Chat */}
        <div
          style={{
            flex: 1,
            display: "flex",
            minWidth: 0,
            overflow: "visible",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 200,
              overflow: "hidden",
            }}
          >
            <CodeEditor
              ydoc={ydoc}
              awareness={awareness}
              me={me}
              users={users}
            />
          </div>

          {isChatOpen && !isVideoOpen && (
            <div
              style={{
                width: 340,
                flexShrink: 0,
                borderLeft: "1px solid #DBEAFE",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Disconnect Banner */}
              {!connected && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    padding: "8px 16px",
                    background: "#FEF2F2",
                    borderBottom: "1px solid #FCA5A5",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: "#DC2626", fontSize: 12, fontWeight: 600 }}>
                    Reconnecting...
                  </span>
                </div>
              )}
              <ChatPanel
                onClose={() => setIsChatOpen(false)}
                socket={socket}
                roomId={roomId}
                me={me}
                users={users}
              />
            </div>
          )}
        </div>

        {/* Video Sidebar — toggle on button click */}
        {isVideoOpen && (
  <div
    style={{
      width: 300,
      flexShrink: 0,
      borderLeft: "1px solid #DBEAFE",
      background: "#FFFFFF",
      transition: "width 0.2s ease",
    }}
  >
   <VideoPanel
  localVideoRef={localVideoRef}
  stream={stream}
  cameraOn={cameraOn}
  toggleCamera={toggleCamera}
  stopCamera={stopCamera}
/>
  </div>
)}
      </div>

      {/* Floating Chat — when both chat and video are open (draggable) */}
      {isChatOpen && isVideoOpen && (
        <DraggableChat
          onClose={() => setIsChatOpen(false)}
          socket={socket}
          roomId={roomId}
          me={me}
          users={users}
        />
      )}

      {/* ── Leave Confirmation Modal ── */}
      {showLeaveConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              background: "#e8f2fd",
              border: "1px solid #DBEAFE",
              borderRadius: 14,
              padding: "32px 36px",
              width: 380,
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(30, 58, 138, 0.18)",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                margin: "0 auto 16px",
                borderRadius: "50%",
                background: "#FEF2F2",
                color: "#DC2626",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              <FiLogOut />
            </div>
            <h2
              style={{
                color: "#1E3A8A",
                fontSize: 20,
                fontWeight: 700,
                margin: "0 0 8px",
              }}
            >
              Leave Room?
            </h2>
            <p
              style={{
                color: "#64748B",
                fontSize: 14,
                margin: "0 0 24px",
                lineHeight: 1.6,
              }}
            >
              You will be disconnected from{" "}
              <strong style={{ color: "#1E3A8A" }}>{roomId}</strong> and
              returned to your dashboard.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => setShowLeaveConfirm(false)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#EFF6FF")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#FFFFFF")
                }
                style={{
                  flex: 1,
                  padding: "11px 0",
                  background: "#FFFFFF",
                  border: "1px solid #BFDBFE",
                  borderRadius: 8,
                  color: "#475569",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveRoom}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#B91C1C")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#DC2626")
                }
                style={{
                  flex: 1,
                  padding: "11px 0",
                  background: "#DC2626",
                  border: "none",
                  borderRadius: 8,
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.15s",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <FiLogOut size={14} />
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default WorkSpace;