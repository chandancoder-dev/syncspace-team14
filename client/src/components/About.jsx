import "../styles/About.css";

function About() {
  return (
    <div className="about-container">
      <div className="about-card">
        <h1>About SyncSpace</h1>

        <p>
          SyncSpace is a real-time collaborative workspace built for developers,
          students, and technical interviewers. It enables multiple users to
          code, brainstorm, and communicate together in a shared environment.
        </p>

        <h2>Our Mission</h2>

        <p>
          Our mission is to simplify technical collaboration by providing a
          secure platform where teams can write code, draw ideas, and solve
          problems together in real time.
        </p>

        <h2>Key Features</h2>

        <ul>
          <li>Real-time collaborative code editor.</li>
          <li>Interactive whiteboard for architecture and brainstorming.</li>
          <li>Live chat for seamless communication.</li>
          <li>
            Secure coding rooms for pair programming and technical interviews.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default About;
