import "../styles/Features.css";

function Features() {
  return (
    <section className="features">
      <div className="features-container">
        <h2>Features</h2>

        <p className="features-subtitle">
          Everything you need to collaborate with your team in one workspace.
        </p>

        <div className="feature-cards">
          <div className="card">
            <h3>Interactive Whiteboard</h3>
            <p>Brainstorm ideas and draw diagrams together in real time.</p>
          </div>

          <div className="card">
            <h3>Collaborative Code Editor</h3>
            <p>Write, edit and review code with your team simultaneously.</p>
          </div>

          <div className="card">
            <h3>Real-Time Chat</h3>
            <p>Stay connected with instant messaging while working together.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
