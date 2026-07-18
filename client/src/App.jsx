// import { Routes, Route } from "react-router-dom";
// import { useLocation } from "react-router-dom";
// import Home from "./components/Home"
// import About from "./components/About"
// import Features from "./components/Features"
// import Dashboard from "./pages/Dashboard";
// import NavBar from "./components/navbar"
// import "./styles/navbar.css"
// function App() {
//   const location = useLocation();
//   const showNavBar = location.pathname !== "/dashboard";

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-100">
//       {showNavBar ? <NavBar /> : null}
//       <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
//         <Routes>
//         <Route path = "/" element={<Home/>}/>
//         <Route path = "/about" element={<About/>}/>
//         <Route path = "/features" element={<Features/>}/>
//         <Route path="/dashboard" element={<Dashboard />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }

// export default App;

import Dashboard from "./pages/Dashboard";

function App() {
  return <Dashboard />;
}

export default App;