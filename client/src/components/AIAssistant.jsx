import { useState } from "react";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const questions = [
  "What is SyncSpace?",
  "How do I create a room?",
  "How do I join a room?",
  "What features are available?",
  "How do I register?"
];
const answers = {
  "What is SyncSpace?":
    "SyncSpace is a real-time collaborative coding platform where users can create rooms, write code together, communicate, and collaborate seamlessly.",

  "How do I create a room?":
    "Click the 'Create Room' button on the home page, enter the required details, and a unique room will be created.",

  "How do I join a room?":
    "Click the 'Join Room' button and enter the room ID shared with you to join an existing room.",

  "What features are available?":
    "SyncSpace provides a collaborative code editor, chat, whiteboard, code execution, and real-time collaboration.",

  "How do I register?":
    "Click the Register button, fill in your details, and create your account."
};

const styles = {
  button: {
    position: "fixed",
    bottom: "25px",
    right: "25px",
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    border: "3px solid white",
    backgroundColor: "#2563EB",
    color: "#fff",
    fontSize: "30px",
    cursor: "pointer",
    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
    zIndex: 9999,
    transition: "0.3s",
  },

  popup: {
    position: "fixed",
    bottom: "100px",
    right: "25px",
    width: "380px",
    minHeight:"420px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    overflow: "hidden",
    zIndex: 9998,
  },

  header: {
    backgroundColor: "#2563EB",
    color: "#fff",
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "18px",
  },

  body: {
    padding: "18px",
  },

  title: {
    marginBottom: "20px",
    color: "#374151",
  },

  question: {
    width: "100%",
    textAlign: "left",
    padding: "14px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "1px solid #DBEAFE",
    background: "#F8FBFF",
    cursor: "pointer",
    fontSize: "15px",
    transition: "0.2s",
  },
};
return (
  <>
    {isOpen && (
      <div style={styles.popup}>
        <div style={styles.header}>
          <span>🤖 SyncSpace Assistant</span>

          <button
            onClick={() => {
              setIsOpen(false);
              setSelectedQuestion(null);
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "22px",
            }}
          >
            ✕
          </button>
        </div>
        <div style={styles.body}>
  {selectedQuestion ? (
    <>
      <h4 style={styles.title}>{selectedQuestion}</h4>

      <p
        style={{
          color: "#4B5563",
          lineHeight: "1.6",
          marginBottom: "20px",
        }}
      >
        {answers[selectedQuestion]}
      </p>

      <button
        onClick={() => setSelectedQuestion(null)}
        style={{
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#2563EB",
          color: "#fff",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        ← Back
      </button>
    </>
  ) : (
    <>
      <h4 style={styles.title}>Hello! 👋</h4>

      <p
        style={{
          marginTop: "0",
          marginBottom: "20px",
          color: "#6B7280",
        }}
      >
        Choose a question below:
      </p>

      {questions.map((question, index) => (
        <button
          key={index}
          style={styles.question}
          onClick={() => setSelectedQuestion(question)}
        >
          {question}
        </button>
      ))}
    </>
  )}
</div>
      </div>
    )}

    <button
      style={styles.button}
      onClick={() => setIsOpen(!isOpen)}
    >
      🤖
    </button>
  </>
);
}