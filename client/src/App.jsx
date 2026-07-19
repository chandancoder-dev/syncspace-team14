import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Features from "./components/Features";
import Login from "./components/Login";
import DNavbar from "./components/DNavbar";
import CreateRoom from "./pages/CreateRoom";
import WorkSpace from "./pages/workspace/WorkSpace";
import Dashboard from "./pages/Dashboard";

function App() {
  const location = useLocation();
  const hideNav = location.pathname.startsWith("/workspace");

  return (
    <>
      {!hideNav && <DNavbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/features" element={<Features />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/workspace" element={<WorkSpace />} />

        {/* Your Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;