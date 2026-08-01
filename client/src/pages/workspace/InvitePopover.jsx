import { useState, useRef, useEffect } from 'react';
import { FiShare2, FiCopy, FiCheck } from 'react-icons/fi';

export default function InvitePopover({ roomId }) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef();

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.getElementById('share-link-input');
      if (input) {
        input.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  // Close on outside click
  useEffect(() => {
    if (!showMenu) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [showMenu]);

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setShowMenu((v) => !v)}
        title="Invite to room"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#EFF6FF";
          e.currentTarget.style.borderColor = "#2563EB";
          e.currentTarget.style.color = "#2563EB";
        }}
        onMouseLeave={(e) => {
          if (!showMenu) {
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
          border: "1.5px solid " + (showMenu ? "#2563EB" : "#DBEAFE"),
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
          background: showMenu ? "#EFF6FF" : "#FFFFFF",
          color: showMenu ? "#2563EB" : "#475569",
          transition: "all 0.2s ease",
        }}
      >
        <FiShare2 size={14} />
        Invite
      </button>

      {showMenu && (
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
          <div style={{ color: "#1E3A8A", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
            Invite to this room
          </div>
          <div style={{ color: "#64748B", fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>
            Anyone with this link can join the collaboration session.
          </div>

          {/* Copy link */}
          <div style={{ display: "flex", alignItems: "stretch", gap: 8, marginBottom: 12 }}>
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
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
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

          {/* Room ID */}
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
              <div style={{ color: "#64748B", fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 2 }}>
                Room ID
              </div>
              <div style={{ color: "#1b7be1", fontSize: 14, fontWeight: 700, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: 0.6 }}>
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
  );
}
