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
        <h1>Build, code, and brainstorm together in one collaborative workspace.</h1>
        <p>
          Create secure coding rooms where developers and students can work together,
          edit code, share ideas, and communicate seamlessly.
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