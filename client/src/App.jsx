import React from "react";
import Navbar from "./components/Navbar";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favorite from "./pages/Favorite";
import Releases from "./pages/Releases";

import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";

import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddShows from "./pages/admin/AddShows";
import ListShows from "./pages/admin/ListShows";
import ListBookings from "./pages/admin/ListBookings";

import { useAppContext } from "./context/AppContext";
import { SignIn } from "@clerk/clerk-react";
import Loading from "./components/Loading";

const App = () => {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  const { user, isAdmin, isAdminLoading } = useAppContext();

  const getAdminRouteElement = () => {
    // User is not signed in
    if (!user) {
      return (
        <div className="min-h-screen flex justify-center items-center">
          <SignIn fallbackRedirectUrl="/admin" />
        </div>
      );
    }

    // Wait for the backend admin check
    if (isAdminLoading) {
      return <Loading />;
    }

    // Signed-in user is not an admin
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }

    // Signed-in user is an admin
    return <Layout />;
  };

  return (
    <>
      <Toaster />

      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/movies" element={<Movies />} />

        <Route
          path="/movies/:id"
          element={<MovieDetails />}
        />

        <Route
          path="/movies/:id/:date"
          element={<SeatLayout />}
        />

        <Route
          path="/my-bookings"
          element={<MyBookings />}
        />

        <Route
          path="/loading/:nextUrl"
          element={<Loading />}
        />

        <Route
          path="/releases"
          element={<Releases />}
        />

        <Route
          path="/favorite"
          element={<Favorite />}
        />

        <Route
          path="/admin/*"
          element={getAdminRouteElement()}
        >
          <Route index element={<Dashboard />} />

          <Route
            path="add-shows"
            element={<AddShows />}
          />

          <Route
            path="list-shows"
            element={<ListShows />}
          />

          <Route
            path="list-bookings"
            element={<ListBookings />}
          />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;