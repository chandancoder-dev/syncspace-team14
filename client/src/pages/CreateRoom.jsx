import { useState } from "react";
import "../styles/CreateRoom.css";

function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [visibility, setVisibility] = useState("Public");
  return (
    <div className="create-room-container">
      <div className="create-room-card">
        <h1>Create a New Room</h1>

        <form>
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
            ></textarea>
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

          <button type="submit">Create Room</button>
        </form>
      </div>
    </div>
  );
}

export default CreateRoom;
