import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Collaborate in Real Time</h1>

        <p className="hero-description">
          Build, code, and brainstorm together in one collaborative workspace.
        </p>

        <p className="hero-text">
          Create collaborative rooms where teams can work on ideas, edit code,
          use a shared whiteboard, and communicate in real time.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">Create Room</button>

          <button className="secondary-btn">Join Room</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
