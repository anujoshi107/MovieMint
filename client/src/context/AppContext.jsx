import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchIsAdmin = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/admin/is-admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsAdmin(Boolean(data.isAdmin));

      if (!data.isAdmin && location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error("You are not authorized to access admin dashboard");
      }
    } catch (error) {
      setIsAdmin(false);

      if (location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error(
          error.response?.data?.message ||
          "You are not authorized to access admin dashboard"
        );
      }

      console.error(error);
    }
  };

  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");

      if (data.success) {
        const validShows = Array.isArray(data.shows) ? data.shows.filter(movie => movie !== null && movie !== undefined) : [];
        setShows(validShows);
      } else {
        setShows([]);
      }
    } catch (error) {
      setShows([]);
      console.error(error);
    }
  };

  const fetchFavoriteMovies = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/user/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setFavoriteMovies(Array.isArray(data.movies) ? data.movies : []);
      } else {
        setFavoriteMovies([]);
      }
    } catch (error) {
      setFavoriteMovies([]);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    if (isLoaded && user) {
      fetchIsAdmin();
      fetchFavoriteMovies();
    }

    if (isLoaded && !user) {
      setIsAdmin(false);
      setFavoriteMovies([]);
    }
  }, [isLoaded, user]);

  const value = {
    axios,
    fetchIsAdmin,
    user,
    getToken,
    navigate,
    isAdmin,
    shows,
    favoriteMovies,
    fetchFavoriteMovies,
    fetchShows,
    image_base_url,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);