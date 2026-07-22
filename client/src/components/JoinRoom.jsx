import { useState } from "react";
import "../styles/JoinRoom.css";

function JoinRoom() {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");

  const handleJoinRoom = (e) => {
    e.preventDefault();

    if (!roomId.trim()) {
      alert("Please enter the Room ID.");
      return;
    }

    // Backend integration will be added later
    console.log({
      roomId,
      name,
    });

    alert("Join Room functionality will be connected to the backend.");
  };

  return (
    <div className="join-room-container">
      <div className="join-room-card">
        <h1>Join an Existing Room</h1>

        <p className="join-room-description">
          Enter the Room ID shared with you to securely join an existing
          collaboration room.
        </p>

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
            <label>Your Name (Optional)</label>

            <input
              type="text"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <button type="submit" className="join-btn">
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinRoom;
