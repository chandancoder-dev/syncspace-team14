import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Register from "./pages/Register";

function AppContent() {
  const location = useLocation();

  const hideNav =
    location.pathname.startsWith("/workspace") ||
    location.pathname.startsWith("/dashboard");

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
    </Routes>
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