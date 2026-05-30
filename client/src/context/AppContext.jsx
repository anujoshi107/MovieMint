import React, { createContext, useContext, useState, useEffect } from 'react';
import { dummyShowsData } from '../assets/assets';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [shows] = useState(dummyShowsData);
  
  // Lazy state initialization for local storage persistence
  const [favoriteMovies, setFavoriteMovies] = useState(() => {
    try {
      const saved = localStorage.getItem('moviemint_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('moviemint_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync favorites with localStorage
  useEffect(() => {
    localStorage.setItem('moviemint_favorites', JSON.stringify(favoriteMovies));
  }, [favoriteMovies]);

  // Sync bookings with localStorage
  useEffect(() => {
    localStorage.setItem('moviemint_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const toggleFavorite = (movie) => {
    setFavoriteMovies((prev) => {
      const exists = prev.some((m) => m._id === movie._id);
      if (exists) {
        return prev.filter((m) => m._id !== movie._id);
      } else {
        return [...prev, movie];
      }
    });
  };

  const addBooking = (newBooking) => {
    setBookings((prev) => {
      // Avoid duplicate booking entries if session ID is matching
      const isDuplicate = prev.some((b) => b.sessionId === newBooking.sessionId);
      if (isDuplicate) return prev;
      return [newBooking, ...prev];
    });
  };

  return (
    <AppContext.Provider
      value={{
        shows,
        favoriteMovies,
        bookings,
        toggleFavorite,
        addBooking,
        image_base_url: '', // Left empty since the mock data includes full tmdb/unsplash URLs
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
