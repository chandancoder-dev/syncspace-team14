import "../styles/Features.css";
import { FaChalkboard, FaCode, FaComments, FaVideo } from "react-icons/fa";

function Features() {
  return (
    <section className="features">
      <div className="features-container">
        <div className="features-tagline">Why Choose SyncSpace</div>

        <h2>Powerful Collaboration Features</h2>

        <p className="features-subtitle">
          Everything you need to brainstorm, code, communicate, and collaborate
          with your team in one modern workspace.
        </p>

        <div className="feature-cards">
          <div className="card">
            <div className="icon-box">
              <FaChalkboard />
            </div>

            <h3>Interactive Whiteboard</h3>

            <p>
              Brainstorm ideas, sketch diagrams, and visualize concepts together
              in real time.
            </p>
          </div>

          <div className="card">
            <div className="icon-box">
              <FaCode />
            </div>

            <h3>Collaborative Code Editor</h3>

            <p>
              Write, edit, and review code simultaneously with teammates without
              switching platforms.
            </p>
          </div>

          <div className="card">
            <div className="icon-box">
              <FaComments />
            </div>

            <h3>Real-Time Chat</h3>

            <p>
              Communicate instantly while discussing ideas, solving problems,
              and collaborating together.
            </p>
          </div>

          <div className="card">
            <div className="icon-box">
              <FaVideo />
            </div>

            <h3>Video & Audio Calling</h3>

            <p>
              Stay connected through high-quality voice and video meetings
              without leaving your workspace.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
