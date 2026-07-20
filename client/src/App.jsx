import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./components/About";
import Features from "./components/Features";
import Login from "./components/Login";
import NavBar from "./components/Navbar";
import CreateRoom from "./pages/CreateRoom";
import WorkSpace from "./pages/workspace/WorkSpace";
import Dashboard from "./pages/Dashboard";

function App() {
  const location = useLocation();

  const hideNav =
    location.pathname.startsWith("/workspace") ||
    location.pathname.startsWith("/dashboard");

  return (
    <>
      {!hideNav && <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/workspace" element={<WorkSpace />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;