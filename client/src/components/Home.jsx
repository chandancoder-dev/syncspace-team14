import { useNavigate } from "react-router-dom";
import Features from "./Features";
import "../styles/Hero.css";

function Home() {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate("/create-room");
  };

  const handleJoinRoom = () => {
    navigate("/join-room");
  };

  return (
    <>
      <section className="hero">
        <h1>🚀 Work Together in Real-Time</h1>

        <p>
          Create secure rooms and collaborate with your teammates from anywhere
          in the world instantly.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn" onClick={handleCreateRoom}>
            Create Room
          </button>

          <button className="secondary-btn" onClick={handleJoinRoom}>
            Join Room
          </button>
        </div>
      </section>

      <Features />
    </>
  );
}

export default Home;
