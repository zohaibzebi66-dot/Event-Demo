import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import Admin from "./pages/Admin";
import HotelLogin from "./pages/hotel/HotelLogin";
import HotelSignup from "./pages/hotel/HotelSignup";
import HotelDashboard from "./pages/hotel/HotelDashboard";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/hotel/login" element={<HotelLogin />} />
            <Route path="/hotel/signup" element={<HotelSignup />} />
            <Route path="/hotel/dashboard" element={<HotelDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
