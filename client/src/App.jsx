import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import SeatLayout from './pages/SeatLayout';
import MyBookings from './pages/MyBookings';
import Favorite from './pages/Favorite';
import Success from './pages/Success';
import Releases from './pages/Releases';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const isAdminRoute = useLocation().pathname.startsWith('/admin');

  return (
    <>
      <Toaster />   
      
      {/* Show navbar/footer only on non‑admin pages (adjust logic as needed) */}
      {!isAdminRoute && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/success" element={<Success />} />
        <Route path="/releases" element={<Releases />} />
      </Routes>
      
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;