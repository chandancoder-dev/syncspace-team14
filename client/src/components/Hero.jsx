import { useNavigate } from "react-router-dom";
import "../styles/Hero.css";

function Hero() {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate("/create-room");
  };

  const handleJoinRoom = () => {
    navigate("/join-room");
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-tagline">Real-Time Collaborative Coding Platform</p>

        <h1>
          Collaborate in <span>Real Time</span>
        </h1>

        <p className="hero-description">
          Code, sketch ideas, and collaborate instantly in one shared workspace.
        </p>

        <p className="hero-text">
          SyncSpace combines a live code editor, interactive whiteboard, and
          real-time communication to help developers, students, and interviewers
          collaborate seamlessly from anywhere.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn" onClick={handleCreateRoom}>
            Create Room
          </button>

          <button className="secondary-btn" onClick={handleJoinRoom}>
            Join Room
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
