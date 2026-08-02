const ChatPanel = ({ onClose }) => {
  return (
    <div
      style={{
        width: "340px",
        height: "100%",
        background: "#FFFFFF",
        borderLeft: "1px solid #DBEAFE",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #E5E7EB",
          background: "#F8FAFC",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#1E3A8A",
            }}
          >
            Chat
          </h3>

          <span
            style={{
              fontSize: "12px",
              color: "#64748B",
            }}
          >
            Team Conversation
          </span>
        </div>

        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "20px",
            color: "#64748B",
          }}
        >
          ✕
        </button>
      </div>

      {/* Empty Chat State */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#F8FAFC",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "54px",
            marginBottom: "14px",
          }}
        >
          💬
        </div>

        <h3
          style={{
            margin: 0,
            color: "#1E293B",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          No messages yet
        </h3>

        <p
          style={{
            marginTop: "8px",
            color: "#64748B",
            fontSize: "14px",
            lineHeight: "22px",
            maxWidth: "220px",
          }}
        >
          Start the conversation by sending your first message.
        </p>
      </div>

      {/* Input */}
      <div
        style={{
          padding: "14px",
          borderTop: "1px solid #E5E7EB",
          background: "#FFFFFF",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid #CBD5E1",
              outline: "none",
              fontSize: "14px",
            }}
          />

          <button
            style={{
              width: "48px",
              height: "48px",
              border: "none",
              borderRadius: "12px",
              background: "#2563EB",
              color: "#FFFFFF",
              cursor: "pointer",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
