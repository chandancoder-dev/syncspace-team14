import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateRoom from "./pages/CreateRoom";
import Register from "./pages/Register";
import WorkSpace from "./pages/workspace/WorkSpace";

// Components
import About from "./components/About";
import Features from "./components/Features";
import Login from "./components/Login";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";

function AppContent() {
  const location = useLocation();
  const hideChrome =
    location.pathname.startsWith("/workspace") ||
    location.pathname.startsWith("/dashboard");

  return (
    <>
      {!hideChrome && <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/workspace/:roomId" element={<WorkSpace />} />
      </Routes>

      {!hideChrome && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;