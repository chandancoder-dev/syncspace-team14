import { useState } from "react";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

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
  };

  return (
    <>
      <button
        style={styles.button}
        onClick={() => setIsOpen(!isOpen)}
      >
        🤖
      </button>
    </>
  );
}