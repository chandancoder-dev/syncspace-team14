import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLogOut, FiMessageSquare, FiVideo } from 'react-icons/fi';
import InvitePopover from './InvitePopover';

// Deterministic initial extraction from a user name
const getInitials = (name = "") => {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Circular avatar with hover tooltip
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
            <span style={{ opacity: 0.7, fontWeight: 500, marginLeft: 4 }}>· you</span>
          )}
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

const MAX_VISIBLE_AVATARS = 4;

export default function WorkSpaceHeader({
  roomId,
  connected,
  me,
  users,
  isHost,
  isChatOpen,
  setIsChatOpen,
  isVideoOpen,
  setIsVideoOpen,
  setShowLeaveConfirm,
}) {
  const navigate = useNavigate();

  const others = Array.from(users.values());
  const visibleOthers = others.slice(0, MAX_VISIBLE_AVATARS);
  const overflow = others.length - visibleOthers.length;
  const totalOnline = others.length + 1;

  return (
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
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
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
          <img src="/SyncSpace.png" alt="SyncSpace" style={{ width: 26, height: 26 }} />
          <span style={{ color: "#1E3A8A", fontSize: 14, fontWeight: 700 }}>SyncSpace</span>
        </div>

        <div style={{ width: 1, height: 24, background: "#DBEAFE" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#64748B", fontSize: 12, fontWeight: 500 }}>Room</span>
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
            style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 4 }}
            title={connected ? "Connected" : "Reconnecting"}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: connected ? "#22C55E" : "#94A3B8",
                boxShadow: connected ? "0 0 0 3px rgba(34, 197, 94, 0.18)" : "none",
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

      {/* RIGHT — avatars + buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Online users */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {totalOnline > 1 && (
            <span style={{ color: "#64748B", fontSize: 12, fontWeight: 600 }}>
              {totalOnline} online
            </span>
          )}
          <div style={{ display: "flex", alignItems: "center" }}>
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
                  width: 32, height: 32, borderRadius: "50%",
                  background: "#EFF6FF", color: "#1E3A8A",
                  fontSize: 11, fontWeight: 700,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  border: "2px solid #FFFFFF",
                  boxShadow: "0 1px 3px rgba(30, 58, 138, 0.15)",
                  marginLeft: -10, position: "relative", zIndex: 1,
                }}
              >
                +{overflow}
              </span>
            )}
          </div>
        </div>

        {/* ▶ Replay */}
        <HeaderButton
          onClick={() => navigate(`/replay/${roomId}`, { state: { from: 'workspace' } })}
          title="View session replay"
          label="▶ Replay"
        />

        {/* Invite (host only) */}
        {isHost && <InvitePopover roomId={roomId} />}

        {/* Chat */}
        <HeaderButton
          onClick={() => setIsChatOpen(!isChatOpen)}
          title={isChatOpen ? "Close chat" : "Open chat"}
          icon={<FiMessageSquare size={14} />}
          label="Chat"
          active={isChatOpen}
        />

        {/* Video Call */}
        <HeaderButton
          onClick={() => setIsVideoOpen(!isVideoOpen)}
          title={isVideoOpen ? "Close video call" : "Open video call"}
          icon={<FiVideo size={14} />}
          label={isVideoOpen ? "In Call" : "Call"}
          active={isVideoOpen}
          activeColor="green"
        />

        {/* Leave */}
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
            display: "inline-flex", alignItems: "center", gap: 6,
            height: 34, padding: "0 14px", borderRadius: 8,
            border: "1px solid #DBEAFE", cursor: "pointer",
            fontSize: 13, fontWeight: 600,
            background: "#FFFFFF", color: "#475569",
            transition: "all 0.15s ease",
          }}
        >
          <FiLogOut size={14} />
          Leave
        </button>
      </div>
    </div>
  );
}

// Reusable header button component
function HeaderButton({ onClick, title, icon, label, active = false, activeColor = "blue" }) {
  const activeBorder = activeColor === "green" ? "#22C55E" : "#2563EB";
  const activeBg = activeColor === "green" ? "#ECFDF5" : "#EFF6FF";
  const activeText = activeColor === "green" ? "#047857" : "#2563EB";

  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "#EFF6FF";
          e.currentTarget.style.borderColor = "#2563EB";
          e.currentTarget.style.color = "#2563EB";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "#FFFFFF";
          e.currentTarget.style.borderColor = "#DBEAFE";
          e.currentTarget.style.color = "#475569";
        }
      }}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        height: 34, padding: "0 14px", borderRadius: 8,
        border: `1.5px solid ${active ? activeBorder : "#DBEAFE"}`,
        cursor: "pointer", fontSize: 13, fontWeight: 600,
        background: active ? activeBg : "#FFFFFF",
        color: active ? activeText : "#475569",
        transition: "all 0.15s ease",
      }}
    >
      {icon}
      {label}
    </button>
  );
}
