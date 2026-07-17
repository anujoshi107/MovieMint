import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const image_base_url =
    import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const navigate = useNavigate();

  const userId = user?.id || null;

  /*
   * Store the latest getToken function in a ref.
   * This keeps the API functions stable and prevents effects
   * from rerunning only because getToken received a new reference.
   */
  const getTokenRef = useRef(getToken);

  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  // Check whether the signed-in user is an admin
  const fetchIsAdmin = useCallback(async () => {
    try {
      const token = await getTokenRef.current();

      if (!token) {
        setIsAdmin(false);
        return false;
      }

      const { data } = await axios.get(
        "/api/admin/is-admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const adminStatus = Boolean(
        data.success && data.isAdmin
      );

      setIsAdmin(adminStatus);

      return adminStatus;
    } catch (error) {
      setIsAdmin(false);

      console.error(
        "Admin check failed:",
        error.response?.data?.message ||
          error.message ||
          error
      );

      return false;
    }
  }, []);

  // Fetch movies that have upcoming shows
  const fetchShows = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/show/all");

      if (data.success && Array.isArray(data.shows)) {
        const validShows = data.shows.filter(
          (movie) => movie && movie._id
        );

        setShows(validShows);
      } else {
        setShows([]);
      }
    } catch (error) {
      setShows([]);

      console.error(
        "Failed to fetch shows:",
        error.response?.data?.message ||
          error.message ||
          error
      );
    }
  }, []);

  // Fetch the signed-in user's favorite movies
  const fetchFavoriteMovies = useCallback(async () => {
    try {
      const token = await getTokenRef.current();

      if (!token) {
        setFavoriteMovies([]);
        return;
      }

      const { data } = await axios.get(
        "/api/user/favorites",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success && Array.isArray(data.movies)) {
        const validMovies = data.movies.filter(
          (movie) => movie && movie._id
        );

        setFavoriteMovies(validMovies);
      } else {
        setFavoriteMovies([]);
      }
    } catch (error) {
      setFavoriteMovies([]);

      console.error(
        "Failed to fetch favorites:",
        error.response?.data?.message ||
          error.message ||
          error
      );
    }
  }, []);

  // Fetch public shows when AppProvider first mounts
  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  // Initialize user information after Clerk finishes loading
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    // No user is signed in
    if (!userId) {
      setIsAdmin(false);
      setIsAdminLoading(false);
      setFavoriteMovies([]);
      return;
    }

    const initializeUser = async () => {
      setIsAdminLoading(true);

      try {
        await Promise.all([
          fetchIsAdmin(),
          fetchFavoriteMovies(),
        ]);
      } finally {
        /*
         * This was the important missing part.
         * It removes the loading screen after the requests finish.
         */
        setIsAdminLoading(false);
      }
    };

    initializeUser();
  }, [
    isLoaded,
    userId,
    fetchIsAdmin,
    fetchFavoriteMovies,
  ]);

  const value = {
    axios,

    user,
    isLoaded,
    getToken,
    navigate,

    isAdmin,
    isAdminLoading,
    fetchIsAdmin,

    shows,
    fetchShows,

    favoriteMovies,
    fetchFavoriteMovies,

    image_base_url,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useAppContext must be used inside AppProvider"
    );
  }

  return context;
};