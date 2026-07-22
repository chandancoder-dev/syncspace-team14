import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-tagline">Collaborative Coding Workspace</p>

        <h1>
          Collaborate in <span>Real Time</span>
        </h1>

        <p className="hero-description">
          Build, code, and brainstorm together in one collaborative workspace.
        </p>

        <p className="hero-text">
          Create secure coding rooms where developers and students can work
          together, edit code, share ideas, and communicate seamlessly.
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
