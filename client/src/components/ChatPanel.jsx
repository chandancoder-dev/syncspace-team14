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

const ChatPanel = ({ onClose, socket, roomId, me, users = new Map() }) => {
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const currentUser = getCurrentUserIdentity();
  const participants = [
    me,
    ...Array.from(users.values()).map(({ user }) => user),
  ]
    .filter(Boolean)
    .reduce((uniqueParticipants, participant) => {
      const name = participant.name || participant.username || "Anonymous";
      const id = participant.id || participant.email || name;

      return uniqueParticipants.some((user) => user.id === id)
        ? uniqueParticipants
        : [...uniqueParticipants, { id, name }];
    }, []);
  const visibleParticipants = participants.slice(0, 3);
  const additionalParticipants =
    participants.length - visibleParticipants.length;
  const avatarGradients = [
    "linear-gradient(135deg, #2563EB, #1D4ED8)",
    "linear-gradient(135deg, #7C3AED, #4F46E5)",
    "linear-gradient(135deg, #DB2777, #BE185D)",
  ];

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
          padding: "16px 18px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "10px",
          borderBottom: "1px solid #E5E7EB",
          background: "#FFFFFF",
          flexShrink: 0,
        }}
      >
        {/* Left Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: "auto",
              height: "42px",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: 0,
              boxShadow: "none",
              flexShrink: 0,
            }}
          >
            {visibleParticipants.map((participant, index) => (
              <div
                key={participant.id}
                title={participant.name}
                style={{
                  width: "42px",
                  height: "42px",
                  marginLeft: index ? "-12px" : 0,
                  borderRadius: "50%",
                  background: avatarGradients[index % avatarGradients.length],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: "16px",
                  fontWeight: "700",
                  border: "2px solid #FFFFFF",
                  boxShadow: "0 3px 8px rgba(30, 58, 138, 0.2)",
                  zIndex: visibleParticipants.length - index,
                  flexShrink: 0,
                }}
              >
                {participant.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {additionalParticipants > 0 && (
              <div
                title={`${additionalParticipants} more participant${additionalParticipants === 1 ? "" : "s"}`}
                style={{
                  width: "42px",
                  height: "42px",
                  marginLeft: "-12px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #475569, #334155)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: "700",
                  border: "2px solid #FFFFFF",
                  boxShadow: "0 3px 8px rgba(30, 58, 138, 0.2)",
                  zIndex: 0,
                  flexShrink: 0,
                }}
              >
                +{additionalParticipants}
              </div>
            )}
          </div>

          <div
            style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginLeft: "8px",
            flex: 1,
            minWidth: 0,
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#22C55E",
                flexShrink: 0,
              }}
            />

            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#334155",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Team Conversation
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginLeft: "auto",
            flexShrink: 0,
          }}
        >
          <button
            title="Search Messages"
            style={{
              width: "32px",
              height: "32px",
              border: "none",
              borderRadius: "10px",
              background: "transparent",
              cursor: "pointer",
              fontSize: "18px",
              color: "#64748B",
              transition: "0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#EFF6FF")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            🔍
          </button>

          <button
            title="More Options"
            style={{
              width: "36px",
              height: "36px",
              border: "none",
              borderRadius: "10px",
              background: "transparent",
              cursor: "pointer",
              fontSize: "18px",
              color: "#64748B",
              transition: "0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#EFF6FF")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            ⋮
          </button>

          <button
            onClick={onClose}
            title="Close Chat"
            style={{
              width: "36px",
              height: "36px",
              border: "none",
              borderRadius: "10px",
              background: "transparent",
              cursor: "pointer",
              fontSize: "18px",
              color: "#64748B",
              transition: "0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FEE2E2")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            ✕
          </button>
        </div>
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
                  fontSize: "18px",
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
