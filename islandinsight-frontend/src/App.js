import React from "react";
import Navbar from "./components/Navbar";
import LatestNewsCard from "./components/LatestNewsCard";
import NewsGrid from "./components/newsGrid";
import { AuthProvider } from "./context/AuthContext";
import SignUpPane from "./components/SignUpPane"; 
function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <SignUpPane />
        <Navbar />
        <LatestNewsCard />
        <NewsGrid />
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;
