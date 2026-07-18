import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CreateRoom from "./pages/CreateRoom";

import About from "./components/About";
import Features from "./components/Features";
import NavBar from "./components/navbar";
import Login from "./components/Login";

import "./styles/navbar.css";

function App() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-room" element={<CreateRoom />} />
      </Routes>
    </>
  );
}

export default App;
