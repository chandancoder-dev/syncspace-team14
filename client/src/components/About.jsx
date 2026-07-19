import "../styles/About.css";

function About() {
  return (
    <div className="about-container">
      <div className="about-card">
        <h1>About SyncSpace</h1>

        <p>
          SyncSpace is a collaborative coding platform where developers can
          create and join coding rooms to write, edit, and share code together
          in real time.
        </p>

        <h2>Our Mission</h2>

        <p>
          Our mission is to make coding collaboration simple, fast, and
          accessible for students, developers, and teams around the world.
        </p>

        <h2>Key Features</h2>

        <ul>
          <li>Create public and private coding rooms.</li>
          <li>Collaborate with teammates in real time.</li>
          <li>Support for multiple programming languages.</li>
          <li>Simple and responsive user interface.</li>
        </ul>
      </div>
    </div>
  );
}

export default About;
