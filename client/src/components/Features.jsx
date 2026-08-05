import "../styles/Features.css";

function Features() {
  return (
    <section className="features">
      <div className="features-container">
        <p className="features-tagline">Why Choose SyncSpace</p>

        <h2>Features</h2>

        <p className="features-subtitle">
          Everything you need to collaborate efficiently with your team in one
          workspace.
        </p>

        <div className="feature-cards">
          <div className="card">
            <h3>Interactive Whiteboard</h3>

            <p>
              Brainstorm ideas, sketch diagrams, and visualize concepts together
              in real time.
            </p>
          </div>

          <div className="card">
            <h3>Collaborative Code Editor</h3>

            <p>
              Write, edit, and review code simultaneously with your teammates
              without switching platforms.
            </p>
          </div>

          <div className="card">
            <h3>Real-Time Chat</h3>

            <p>
              Communicate instantly with your team while collaborating on
              projects and discussions.
            </p>
          </div>
          <div className="card">
            <h3>Video & Audio Calling</h3>

            <p>
              Connect with your teammates through high-quality voice and video
              calls without leaving the collaborative workspace.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
