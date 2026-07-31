import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CreateRoom.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function CreateRoom() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!roomName.trim()) {
      setError("Room name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${SERVER_URL}/api/rooms`,
        {
          name: roomName,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const roomId = response.data.room?.roomId || response.data.roomId;

      if (roomId) {
        navigate(`/workspace/${roomId}`);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to create room. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-room-container">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back
      </button>

      <div className="create-room-card">
        <h1>Create a New Room</h1>

        {error && (
          <p style={{ color: "#ff4d4f", marginBottom: "15px" }}>{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Room Name</label>
            <input
              type="text"
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Enter room description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Room"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRoom;
