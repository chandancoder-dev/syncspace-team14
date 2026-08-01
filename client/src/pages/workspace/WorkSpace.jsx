import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiArrowLeft,
  FiShare2,
  FiCopy,
  FiCheck,
  FiMessageSquare,
} from "react-icons/fi";
import WhiteBoard from "./Whiteboard";
import CodeEditor from "./CodeEditor";
import ChatPanel from "../../components/ChatPanel";
import useSync from "../../hooks/useSync";
import VideoPanel from "../../components/VideoCall/VideoPanel";


const MIN_PANEL_WIDTH = 200;
const MAX_VISIBLE_AVATARS = 4;

// Deterministic initial extraction from a user name
const getInitials = (name = "") => {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Circular avatar with hover tooltip showing the full name
const Avatar = ({ name, color, isSelf = false, offset = 0 }) => {
  const [hover, setHover] = useState(false);
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        marginLeft: offset ? -10 : 0,
        zIndex: hover ? 100 : 10 - offset,
      }}
    >
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: color || "#94A3B8",
          color: "#FFFFFF",
          fontSize: 12,
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: 0.3,
          border: "2px solid #FFFFFF",
          boxShadow: hover
            ? "0 4px 10px rgba(30, 58, 138, 0.25)"
            : "0 1px 3px rgba(30, 58, 138, 0.15)",
          cursor: "default",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          transform: hover ? "translateY(-1px)" : "none",
        }}
      >
        {getInitials(name)}
      </span>
      {hover && (
        <span
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1E3A8A",
            color: "#FFFFFF",
            fontSize: 11,
            fontWeight: 600,
            padding: "5px 10px",
            borderRadius: 6,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(30, 58, 138, 0.25)",
            pointerEvents: "none",
            letterSpacing: 0.2,
          }}
        >
          {name}
          {isSelf && (
            <span style={{ opacity: 0.7, fontWeight: 500, marginLeft: 4 }}>
              · you
            </span>
          )}
          {/* tooltip arrow */}
          <span
            style={{
              position: "absolute",
              top: -4,
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              width: 8,
              height: 8,
              background: "#1E3A8A",
            }}
          />
        </span>
      )}
    </span>
  );
};

const WorkSpace = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { ydoc, awareness, socket, connected, users, me, emitCursor } =
    useSync(roomId);
  const [leftWidth, setLeftWidth] = useState(50);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isDragging = useRef(false);
  const containerRef = useRef();
  const shareMenuRef = useRef();

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  // Check if current user is the room host
  useEffect(() => {
    const checkHost = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const userId = storedUser ? JSON.parse(storedUser).id : null;
        if (!token || !userId) return;

        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'}/api/rooms/${roomId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setIsHost(data.room?.createdBy === userId);
        }
      } catch { /* silent */ }
    };
    checkHost();
  }, [roomId]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select input value
      const input = document.getElementById("share-link-input");
      if (input) {
        input.select();
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  // Close share popover on outside click
  useEffect(() => {
    if (!showShareMenu) return;
    const onClick = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [showShareMenu]);

  const handleLeaveRoom = () => {
    // Disconnect socket before navigating
    if (socket) socket.disconnect();
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

  const others = Array.from(users.values());
  const visibleOthers = others.slice(0, MAX_VISIBLE_AVATARS);
  const overflow = others.length - visibleOthers.length;
  const totalOnline = others.length + 1;

  // Access denied screen
  if (accessDenied) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F0F7FF',
          fontFamily: '"Poppins", system-ui, sans-serif',
          padding: 24,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#FEF2F2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            marginBottom: 20,
          }}
        >
          🔒
        </div>
        <h1 style={{ color: '#1E3A8A', fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>
          Access Denied
        </h1>
        <p style={{ color: '#64748B', fontSize: 15, maxWidth: 400, lineHeight: 1.6, margin: '0 0 24px' }}>
          {accessDenied}
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '10px 24px',
            background: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          height: 56,
          background: "#FFFFFF",
          borderBottom: "1px solid #DBEAFE",
          boxShadow: "0 1px 2px rgba(30, 58, 138, 0.04)",
          flexShrink: 0,
        }}
      >
        {/* LEFT — back + logo + room */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setShowLeaveConfirm(true)}
            title="Back to dashboard"
            onMouseEnter={(e) => (e.currentTarget.style.background = "#EFF6FF")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "none",
              background: "transparent",
              color: "#475569",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
              transition: "background 0.15s",
            }}
          >
            <FiArrowLeft />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img
              src="/SyncSpace.png"
              alt="SyncSpace"
              style={{ width: 26, height: 26 }}
            />
            <span style={{ color: "#1E3A8A", fontSize: 14, fontWeight: 700 }}>
              SyncSpace
            </span>
          </div>

          <div style={{ width: 1, height: 24, background: "#DBEAFE" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#64748B", fontSize: 12, fontWeight: 500 }}>
              Room
            </span>
            <span
              style={{
                background: "#EFF6FF",
                color: "#1E3A8A",
                fontSize: 12,
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: 6,
                border: "1px solid #DBEAFE",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                letterSpacing: 0.4,
              }}
              title={roomId}
            >
              {roomId || "Unknown"}
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginLeft: 4,
              }}
              title={connected ? "Connected" : "Reconnecting"}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: connected ? "#22C55E" : "#94A3B8",
                  boxShadow: connected
                    ? "0 0 0 3px rgba(34, 197, 94, 0.18)"
                    : "none",
                }}
              />
              <span
                style={{
                  color: connected ? "#047857" : "#64748B",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 0.2,
                }}
              >
                {connected ? "Live" : "Offline"}
              </span>
            </span>
          </div>
        </div>

        {/* RIGHT — avatars + leave */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {totalOnline > 1 && (
              <span
                style={{
                  color: "#64748B",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {totalOnline} online
              </span>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar name={me.name} color={me.color} isSelf />
              {visibleOthers.map((u, index) => (
                <Avatar
                  key={index}
                  name={u.user?.name || "Anonymous"}
                  color={u.user?.color}
                  offset={index + 1}
                />
              ))}
              {overflow > 0 && (
                <span
                  title={`${overflow} more`}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#EFF6FF",
                    color: "#1E3A8A",
                    fontSize: 11,
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #FFFFFF",
                    boxShadow: "0 1px 3px rgba(30, 58, 138, 0.15)",
                    marginLeft: -10,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  +{overflow}
                </span>
              )}
            </div>
          </div>

          {isHost && (
          <div ref={shareMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowShareMenu((v) => !v)}
              title="Invite to room"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#EFF6FF";
                e.currentTarget.style.borderColor = "#2563EB";
                e.currentTarget.style.color = "#2563EB";
              }}
              onMouseLeave={(e) => {
                if (!showShareMenu) {
                  e.currentTarget.style.background = "#FFFFFF";
                  e.currentTarget.style.borderColor = "#DBEAFE";
                  e.currentTarget.style.color = "#475569";
                }
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                height: 34,
                padding: "0 14px",
                borderRadius: 8,
                border:
                  "1.5px solid " + (showShareMenu ? "#2563EB" : "#DBEAFE"),
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                background: showShareMenu ? "#EFF6FF" : "#FFFFFF",
                color: showShareMenu ? "#2563EB" : "#475569",
                transition: "all 0.2s ease",
              }}
            >
              <FiShare2 size={14} />
              Invite
            </button>

            {showShareMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: 340,
                  background: "#FFFFFF",
                  border: "1px solid #DBEAFE",
                  borderRadius: 12,
                  boxShadow: "0 12px 32px rgba(30, 58, 138, 0.15)",
                  padding: 16,
                  zIndex: 50,
                }}
              >
                <div
                  style={{
                    color: "#1E3A8A",
                    fontSize: 14,
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  Invite to this room
                </div>
                <div
                  style={{
                    color: "#64748B",
                    fontSize: 12,
                    marginBottom: 12,
                    lineHeight: 1.5,
                  }}
                >
                  Anyone with this link can join the collaboration session.
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <input
                    id="share-link-input"
                    readOnly
                    value={shareUrl}
                    onFocus={(e) => e.target.select()}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: "9px 10px",
                      background: "#F8FAFC",
                      border: "1px solid #DBEAFE",
                      borderRadius: 8,
                      color: "#1E293B",
                      fontSize: 12,
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={handleCopyLink}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "0 12px",
                      background: copied ? "#4ac878" : "#6387d6",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "background 0.2s ease",
                    }}
                  >
                    {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <div
                  style={{
                    padding: "10px 12px",
                    background: "#EFF6FF",
                    border: "1px solid #DBEAFE",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "#64748B",
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: 0.6,
                        textTransform: "uppercase",
                        marginBottom: 2,
                      }}
                    >
                      Room ID
                    </div>
                    <div
                      style={{
                        color: "#1b7be1",
                        fontSize: 14,
                        fontWeight: 700,
                        fontFamily:
                          "ui-monospace, SFMono-Regular, Menlo, monospace",
                        letterSpacing: 0.6,
                      }}
                    >
                      {roomId || "—"}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!roomId) return;
                      navigator.clipboard?.writeText(roomId);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    title="Copy Room ID"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      border: "1px solid #DBEAFE",
                      background: "#FFFFFF",
                      color: "#0d4af24a",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    <FiCopy size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
          )}

          <button
            onClick={() => setIsChatOpen(true)}
            title="Open chat"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#EFF6FF";
              e.currentTarget.style.borderColor = "#2563EB";
              e.currentTarget.style.color = "#2563EB";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#FFFFFF";
              e.currentTarget.style.borderColor = "#DBEAFE";
              e.currentTarget.style.color = "#475569";
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              height: 34,
              padding: "0 14px",
              borderRadius: 8,
              border: "1px solid #DBEAFE",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              background: "#FFFFFF",
              color: "#475569",
              transition: "all 0.15s ease",
            }}
          >
            <FiMessageSquare size={14} />
            Chat
          </button>

          <button
            onClick={() => setShowLeaveConfirm(true)}
            title="Leave room"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#FEF2F2";
              e.currentTarget.style.borderColor = "#FCA5A5";
              e.currentTarget.style.color = "#DC2626";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#FFFFFF";
              e.currentTarget.style.borderColor = "#DBEAFE";
              e.currentTarget.style.color = "#475569";
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              height: 34,
              padding: "0 14px",
              borderRadius: 8,
              border: "1px solid #DBEAFE",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              background: "#FFFFFF",
              color: "#475569",
              transition: "all 0.15s ease",
            }}
          >
            <FiLogOut size={14} />
            Leave
          </button>
        </div>
      </div>

<<<<<<< HEAD
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
      flexShrink: 0,
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
      overflow: "hidden",
    }}
  >
    <div
      style={{
        flex: 1,
        minWidth: 0,
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

    {isChatOpen && (
=======
      {/* ── Disconnect Banner ── */}
      {!connected && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '8px 16px',
            background: '#FEF2F2',
            borderBottom: '1px solid #FCA5A5',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#EF4444',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          <span style={{ color: '#DC2626', fontSize: 13, fontWeight: 600 }}>
            Connection lost — reconnecting...
          </span>
          <span style={{ color: '#64748B', fontSize: 12 }}>
            Your changes are saved locally and will sync when reconnected.
          </span>
        </div>
      )}

      {/* ── Main Panels ── */}
>>>>>>> main
      <div
        style={{
          width: 320,
          borderLeft: "1px solid #DBEAFE",
          flexShrink: 0,
        }}
      >
        <ChatPanel onClose={() => setIsChatOpen(false)} />
      </div>
    )}
  </div>

  {/* Video Sidebar */}
  <div
  style={{
    width: 300,
    flexShrink: 0,
    borderLeft: "1px solid #DBEAFE",
    background: "#FFFFFF",
  }}
>
    <VideoPanel />
  </div>
</div>

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
