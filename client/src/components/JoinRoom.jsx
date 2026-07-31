import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/JoinRoom.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function JoinRoom() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting] = useState(false);

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setError("");

    if (!roomId.trim()) {
      setError("Please enter the Room ID.");
      return;
    }

    // Store name for workspace
    const username =
      name.trim() || localStorage.getItem("syncspace_user") || "Anonymous";

    if (name.trim()) {
      localStorage.setItem("syncspace_user", name.trim());
    }

    // Navigate directly — socket roomHandler creates rooms on-the-fly
    navigate(`/workspace/${roomId.trim()}`);
  };

  return (
    <div className="join-room-container">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back
      </button>

      <div className="join-room-card">
        <h1>Join an Existing Room</h1>

        <p className="join-room-description">
          Enter the Room ID shared with you to securely join an existing
          collaboration room.
        </p>

        {error && (
          <p style={{ color: "#ff4d4f", marginBottom: "15px" }}>{error}</p>
        )}

        <form onSubmit={handleJoinRoom}>
          <div className="form-group">
            <label>Room ID</label>

            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Your Name </label>

            <input
              type="text"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <button type="submit" className="join-btn" disabled={isSubmitting}>
            {isSubmitting ? "Joining..." : "Join Room"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinRoom;
