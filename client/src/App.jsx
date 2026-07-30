import "./styles/variables.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateRoom from "./pages/CreateRoom";
import Register from "./pages/Register";
import WorkSpace from "./pages/workspace/WorkSpace";
import ForgetPassword from "./pages/ForgotPassword";
import Rooms from "./pages/Rooms";

// Components
import About from "./components/About";
import Features from "./components/Features";
import Login from "./components/Login";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import JoinRoom from "./components/JoinRoom";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
  const location = useLocation();

  const hideChrome =
    location.pathname.startsWith("/workspace") ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/create-room") ||
    location.pathname.startsWith("/join-room");

  return (
    <>
      {!hideChrome && <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />

        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/createroom"
          element={
            <ProtectedRoute>
              <CreateRoom />
            </ProtectedRoute>
          }
        />

        <Route path="/rooms" element={<Rooms />} />

        <Route
          path="/joinroom"
          element={
            <ProtectedRoute>
              <JoinRoom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workspace/:roomId"
          element={
            <ProtectedRoute>
              <WorkSpace />
            </ProtectedRoute>
          }
        />
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
