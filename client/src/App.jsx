import { Routes, Route } from "react-router-dom";
import Home from "./components/Home"
import About from "./components/About"
import Features from "./components/Features"
import NavBar from "./components/navbar"
import "./styles/navbar.css"
function App() {
  return (
    <>
     <NavBar/>
      <Routes>
        <Route path = "/" element={<Home/>}/>
        <Route path = "/about" element={<About/>}/>
        <Route path = "/features" element={<Features/>}/>
      </Routes>
    </>
  );
}

export default App;