import { useRef, useEffect, useState } from "react";

const getCurrentUserIdentity = () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return {
      id: storedUser?.id || storedUser?._id || null,
      username:
        storedUser?.username ||
        storedUser?.name ||
        storedUser?.fullName ||
        null,
    };
  } catch {
    return { id: null, username: null };
  }
};

const ChatPanel = ({ onClose, socket, roomId, me }) => {
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const currentUser = getCurrentUserIdentity();

  const stopTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (!isTypingRef.current || !socket || !roomId) return;

    socket.emit("stop-typing", {
      roomId,
      sender: me?.name || "Anonymous",
    });
    isTypingRef.current = false;
  };

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = ({
      id,
      senderId,
      sender,
      message,
      timestamp,
    }) => {
      const isCurrentUser =
        currentUser.id && senderId
          ? String(senderId) === String(currentUser.id)
          : currentUser.username
            ? sender === currentUser.username
            : Boolean(senderId && socket.id && senderId === socket.id);

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id,
          sender,
          text: message,
          time: new Date(timestamp).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
          isMe: isCurrentUser,
        },
      ]);
    };

    socket.on("receive-message", handleReceiveMessage);
    return () => socket.off("receive-message", handleReceiveMessage);
  }, [socket, currentUser.id, currentUser.username]);

  useEffect(() => {
    if (!socket) return;

    const isCurrentUser = ({ sender, senderId }) =>
      currentUser.id && senderId
        ? String(senderId) === String(currentUser.id)
        : currentUser.username
          ? sender === currentUser.username
          : Boolean(senderId && socket.id && senderId === socket.id);

    const handleUserTyping = ({ sender, senderId } = {}) => {
      if (isCurrentUser({ sender, senderId })) return;

      const id = senderId || sender;
      setTypingUsers((users) =>
        users.some((user) => user.id === id)
          ? users
          : [...users, { id, name: sender }],
      );
    };

    const handleUserStopTyping = ({ sender, senderId } = {}) => {
      const id = senderId || sender;
      setTypingUsers((users) => users.filter((user) => user.id !== id));
    };

    socket.on("user-typing", handleUserTyping);
    socket.on("user-stop-typing", handleUserStopTyping);

    return () => {
      socket.off("user-typing", handleUserTyping);
      socket.off("user-stop-typing", handleUserStopTyping);
    };
  }, [socket, currentUser.id, currentUser.username]);

  useEffect(() => () => stopTyping(), [socket, roomId, me?.name]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInput(value);

    if (!value.trim()) {
      stopTyping();
      return;
    }

    if (!isTypingRef.current && socket && roomId) {
      socket.emit("typing", {
        roomId,
        sender: me?.name || "Anonymous",
      });
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(stopTyping, 1000);
  };

  const handleSend = () => {
    const message = input.trim();
    if (!message || !socket || !roomId) return;

    stopTyping();
    socket.emit("send-message", {
      roomId,
      message,
      sender: me?.name || "Anonymous",
    });
    setInput("");
  };

  /* Auto-scroll to latest message whenever messages change */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        width: "340px",
        height: "100%",
        background: "#FFFFFF",
        borderLeft: "1px solid #DBEAFE",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #E5E7EB",
          background: "#F8FAFC",
          flexShrink: 0,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#1E3A8A",
              lineHeight: "1.2",
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
          title="Close chat"
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "18px",
            color: "#64748B",
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s",
            padding: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#E2E8F0")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          ✕
        </button>
      </div>

      {/* Message List or Empty State */}
      {messages.length === 0 ? (
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
      ) : (
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            background: "#F8FAFC",
            padding: "18px 20px 10px",
            display: "flex",
            flexDirection: "column",
            gap: "22px",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: msg.isMe ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: "10px",
                width: "100%",
                paddingRight: msg.isMe ? "4px" : 0,
                paddingLeft: msg.isMe ? 0 : "4px",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  minWidth: "36px",
                  borderRadius: "50%",
                  background: msg.isMe
                    ? "linear-gradient(135deg, #2563EB, #1E40AF)"
                    : "linear-gradient(135deg, #7C3AED, #4F46E5)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "700",
                  flexShrink: 0,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  overflow: "hidden",
                }}
              >
                {msg.sender.charAt(0).toUpperCase()}
              </div>

              {/* Bubble + Meta */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.isMe ? "flex-end" : "flex-start",
                  maxWidth: "70%",
                  gap: "3px",
                  minWidth: 0,
                }}
              >
                {/* Sender + Timestamp */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexDirection: msg.isMe ? "row-reverse" : "row",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#1E293B",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {msg.sender}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#94A3B8",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {msg.time}
                  </span>
                </div>

                {/* Bubble */}
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: msg.isMe
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                    background: msg.isMe
                      ? "linear-gradient(135deg, #2563EB, #1E40AF)"
                      : "#FFFFFF",
                    color: msg.isMe ? "#FFFFFF" : "#1E293B",
                    fontSize: "14px",
                    lineHeight: "20px",
                    boxShadow: msg.isMe
                      ? "0 2px 8px rgba(37,99,235,0.30)"
                      : "0 2px 8px rgba(0,0,0,0.08)",
                    border: msg.isMe ? "none" : "1px solid #E2E8F0",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>
      )}

      {typingUsers.length > 0 && (
        <div
          style={{
            padding: "0 18px 8px",
            color: "#64748B",
            fontSize: "12px",
            fontStyle: "italic",
            background: "#FFFFFF",
          }}
        >
          {typingUsers.length === 1
            ? `${typingUsers[0].name} is typing...`
            : `${typingUsers.map((user) => user.name).join(", ")} are typing...`}
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: "12px 14px",
          borderTop: "1px solid #E5E7EB",
          background: "#FFFFFF",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSend();
            }}
            style={{
              flex: 1,
              padding: "11px 14px",
              borderRadius: "12px",
              border: "1px solid #CBD5E1",
              outline: "none",
              fontSize: "14px",
              background: "#F8FAFC",
              color: "#1E293B",
              minWidth: 0,
            }}
          />

          <button
            onClick={handleSend}
            style={{
              width: "44px",
              height: "44px",
              minWidth: "44px",
              border: "none",
              borderRadius: "12px",
              background: "#2563EB",
              color: "#FFFFFF",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2563EB")}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
