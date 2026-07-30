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

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#F8FAFC",
          color: "#94A3B8",
          fontSize: "14px",
          padding: "16px",
        }}
      >
        No messages yet
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
          }}
        >
          <input
            type="text"
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #CBD5E1",
              outline: "none",
              fontSize: "14px",
            }}
          />

          <button
            style={{
              padding: "12px 18px",
              border: "none",
              borderRadius: "10px",
              background: "#2563EB",
              color: "#FFFFFF",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
