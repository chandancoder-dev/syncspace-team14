import { FaCode, FaChalkboard, FaComments, FaShieldAlt } from "react-icons/fa";

import "../styles/About.css";

function About() {
  return (
    <section className="about">
      <div className="about-container">
        <div className="about-left">
          <div className="about-tag">About SyncSpace</div>

          <h1>
            Built for Modern
            <span> Collaboration</span>
          </h1>

          <p className="about-description">
            SyncSpace is a real-time collaborative workspace designed for
            developers, students, and technical interviewers. Our platform
            combines coding, brainstorming, and communication into one seamless
            experience, making teamwork faster and more productive.
          </p>

          <div className="mission-box">
            <h3>Our Mission</h3>

            <p>
              To simplify technical collaboration by providing one secure
              platform where teams can code, brainstorm, communicate, and
              innovate together in real time.
            </p>
          </div>
        </div>

        <div className="about-right">
          <div className="feature-item">
            <div className="feature-icon">
              <FaCode />
            </div>

            <div>
              <h3>Collaborative Coding</h3>
              <p>Write and edit code together instantly.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <FaChalkboard />
            </div>

            <div>
              <h3>Interactive Whiteboard</h3>
              <p>Visualize ideas with real-time drawing tools.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <FaComments />
            </div>

            <div>
              <h3>Live Communication</h3>
              <p>Chat and collaborate without leaving your workspace.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <FaShieldAlt />
            </div>

            <div>
              <h3>Secure Collaboration</h3>
              <p>Private rooms for interviews and pair programming.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
