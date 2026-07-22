import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CreateRoom.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function CreateRoom() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [visibility, setVisibility] = useState("Public");
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
      const response = await axios.post(`${SERVER_URL}/api/rooms`, {
        name: roomName,
        description,
        language,
        visibility,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const roomId = response.data.room?.roomId || response.data.roomId;
      if (roomId) {
        navigate(`/workspace/${roomId}`);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create room. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-room-container">
      <div className="create-room-card">
        <h1>Create a New Room</h1>

        {error && <p style={{ color: "#ff4d4f", marginBottom: "15px" }}>{error}</p>}

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
            <label>Description (Optional)</label>
            <textarea
              placeholder="Enter room description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Programming Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>JavaScript</option>
              <option>Python</option>
              <option>Java</option>
              <option>C</option>
              <option>C++</option>
            </select>
          </div>

          <div className="form-group">
            <label>Room Visibility</label>

            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="visibility"
                  value="Public"
                  checked={visibility === "Public"}
                  onChange={(e) => setVisibility(e.target.value)}
                />
                Public
              </label>

              <label>
                <input
                  type="radio"
                  name="visibility"
                  value="Private"
                  checked={visibility === "Private"}
                  onChange={(e) => setVisibility(e.target.value)}
                />
                Private
              </label>
            </div>
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
