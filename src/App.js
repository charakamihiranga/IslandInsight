import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LatestNewsCard from "./components/LatestNewsCard";
import NewsGrid from "./components/NewsGrid";
import { AuthProvider } from "./context/AuthContext";
import SignUpPane from "./components/SignUpPane";
import TechNewsGrid from "./components/TechNewsGrid";
import BusinessNewsGrid from "./components/BusinessNewsGrid";
import SportNewsGrid from "./components/SportNewsGrid";
function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
          <Route path="/" element={[<LatestNewsCard/>, <NewsGrid/>]} />
          <Route path="/technology" element={<TechNewsGrid/>} />
          <Route path="/business" element={<BusinessNewsGrid/>} />
          <Route path="/sport" element={<SportNewsGrid/>} />
          </Routes>
        </Router>
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;
