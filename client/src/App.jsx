import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home"
import About from "./components/About"
import Features from "./components/Features"
import NavBar from "./components/navbar"
import WhiteBoard from "./page/whiteboard/Whiteboard"
import "./styles/navbar.css"

function App() {
  const location = useLocation();
  const hideNav = location.pathname === "/whiteboard";

  return (
    <>
      {!hideNav && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/whiteboard" element={<WhiteBoard />} />
      </Routes>
    </>
  );
}

export default App;