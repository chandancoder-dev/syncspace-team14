import Features from "./Features";
import "../styles/Hero.css";

function Home() {
  return (
    <>
      <section className="hero">
        <h1>Build, code, and brainstorm together in one collaborative workspace.</h1>
        <p>
          Create secure coding rooms where developers and students can work together,
          edit code, share ideas, and communicate seamlessly.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            marginTop: "24px",
            width: "100%",
          }}
        >
          <button
            style={{
              padding: "14px 32px",
              backgroundColor: "#2563eb",
              color: "#fff",
              fontWeight: 600,
              fontSize: "16px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              width: "auto",
              display: "inline-block",
            }}
          >
            Create Room
          </button>
          <button
            style={{
              padding: "14px 32px",
              backgroundColor: "transparent",
              color: "#3b82f6",
              fontWeight: 600,
              fontSize: "16px",
              borderRadius: "10px",
              border: "2px solid #3b82f6",
              cursor: "pointer",
              width: "auto",
              display: "inline-block",
            }}
          >
            Join Room
          </button>
        </div>
      </section>

      <Features />
    </>
  );
}

export default Home;