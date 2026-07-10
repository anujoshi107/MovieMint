import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CalendarIcon, StarIcon } from 'lucide-react'
import BlurCircle from '../components/BlurCircle'

const TMDB_BASE = import.meta.env.VITE_TMDB_BASE_URL
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY
const POSTER_URL = 'https://image.tmdb.org/t/p/w500'

const Releases = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUpcomingMovies = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.get(`${TMDB_BASE}/movie/upcoming`, {
        params: { language: 'en-US', page: 1, region: 'US' },
        headers: { Authorization: `Bearer ${TMDB_KEY}`, accept: 'application/json' },
      })
      setMovies((data.results || []).slice(0, 10))
    } catch (err) {
      setError('Failed to load upcoming releases. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUpcomingMovies()
  }, [])

  return (
    <div className="relative min-h-screen px-6 md:px-16 lg:px-24 xl:px-44 pt-32 pb-24 overflow-hidden">
      <BlurCircle top="-100px" left="-100px" />
      <BlurCircle bottom="100px" right="-100px" />

      {/* Page Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">Coming Soon</p>
        <h1 className="text-4xl md:text-5xl font-bold">Upcoming Releases</h1>
        <p className="text-gray-400 mt-3 max-w-lg">The most anticipated Hollywood blockbusters heading to theaters.</p>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-pulse">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/5 aspect-[2/3]" />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center py-40">
          <p className="text-gray-400 text-lg">{error}</p>
          <button
            onClick={fetchUpcomingMovies}
            className="mt-4 px-6 py-2 bg-primary hover:bg-primary-dull rounded-full text-sm font-medium transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Movie Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/5 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(248,69,101,0.15)] transition-all duration-500"
            >
              {/* Poster */}
              <div className="relative aspect-[2/3] overflow-hidden">
                <img
                  src={movie.poster_path ? `${POSTER_URL}${movie.poster_path}` : '/placeholder.png'}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Rating */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-xs font-medium">
                  <StarIcon className="w-3 h-3 text-primary fill-primary" />
                  {movie.vote_average > 0 ? movie.vote_average.toFixed(1) : 'N/A'}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="font-semibold text-sm truncate mb-2">{movie.title}</p>
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <CalendarIcon className="w-3 h-3" />
                  {movie.release_date || 'TBA'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Releases
