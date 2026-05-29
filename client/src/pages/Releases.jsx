import React, { useState } from 'react'
import { dummyNewReleases } from '../assets/newReleases'
import BlurCircle from './BlurCircle'
import { Bell, BellRing, Calendar, Clock, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

function Releases() {
  const [subscribed, setSubscribed] = useState({})

  const handleNotifyClick = (movieId, movieTitle) => {
    setSubscribed((prev) => {
      const alreadySubscribed = !!prev[movieId]
      if (alreadySubscribed) {
        toast('You are already on the waitlist for ' + movieTitle)
        return prev
      }
      toast.success(`Waitlist Joined! We will alert you on the release date of "${movieTitle}"!`, {
        icon: '🔔',
        style: {
          borderRadius: '12px',
          background: '#1F2937',
          color: '#fff',
          border: '1px solid rgba(248, 69, 101, 0.2)'
        }
      })
      return { ...prev, [movieId]: true }
    })
  }

  // Beautifully calculate the dynamic countdown from current date
  const getCountdownString = (releaseDateStr) => {
    try {
      const releaseDate = new Date(releaseDateStr)
      const now = new Date()
      
      const diffMs = releaseDate - now
      if (diffMs <= 0) {
        return 'Now Showing in Theaters!'
      }

      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
      
      if (diffDays > 30) {
        const months = Math.floor(diffDays / 30)
        const remainingDays = diffDays % 30
        if (remainingDays === 0) {
          return `Releasing in ${months} month${months > 1 ? 's' : ''}`
        }
        return `Releasing in ${months}m ${remainingDays}d`
      }

      return `Releasing in ${diffDays} day${diffDays > 1 ? 's' : ''}!`
    } catch {
      return releaseDateStr
    }
  }

  const formattedDate = (dateStr) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 pt-32 pb-20 min-h-screen text-white relative overflow-hidden">
      <BlurCircle top='-80px' left='-80px' />
      <BlurCircle bottom='-80px' right='-80px' />

      {/* Header section */}
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center mb-16 relative z-10">
        <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          Coming Soon
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Hollywood Releases
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-xl">
          Discover the most anticipated blockbusters, tracks, and sequels arriving in theaters. Join the waitlists to get notified the second ticket bookings open!
        </p>
      </div>

      {/* Releases Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {dummyNewReleases.map((movie) => {
          const isSubscribed = !!subscribed[movie._id]
          const countdown = getCountdownString(movie.release_date)
          const isReleased = countdown.includes('Now Showing')

          return (
            <div
              key={movie._id}
              className="flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300 group shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform hover:-translate-y-1.5"
            >
              {/* Poster Backdrop */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-950">
                <img
                  src={movie.backdrop_path}
                  alt={movie.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                
                {/* Countdown Badge overlay */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold tracking-wide uppercase shadow-md flex items-center gap-1.5 ${
                    isReleased 
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                      : 'bg-primary text-white shadow-primary/20 animate-pulse'
                  }`}>
                    <Calendar className="w-3.5 h-3.5" />
                    {countdown}
                  </span>
                </div>
              </div>

              {/* Movie Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight group-hover:text-primary transition-colors duration-300">
                    {movie.title}
                  </h3>
                  
                  <span className="text-[10px] text-gray-500 italic block mt-1">
                    "{movie.tagline}"
                  </span>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {movie.genres.map((genre) => (
                      <span key={genre.id} className="px-2 py-0.5 bg-white/10 rounded-md text-[10px] font-semibold text-gray-300">
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-400 text-xs mt-4 line-clamp-3 leading-relaxed">
                    {movie.overview}
                  </p>
                </div>

                {/* Card footer details & action */}
                <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                  <div className="flex flex-col gap-0.5 text-left">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Release Date</span>
                    <span className="text-xs font-bold text-gray-200">{formattedDate(movie.release_date)}</span>
                  </div>

                  {isReleased ? (
                    <span className="px-4 py-2 bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
                      Released ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => handleNotifyClick(movie._id, movie.title)}
                      className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-lg ${
                        isSubscribed
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                          : 'bg-primary hover:bg-primary-dull text-white shadow-primary/20'
                      }`}
                    >
                      {isSubscribed ? (
                        <>
                          <BellRing className="w-3.5 h-3.5" />
                          Subscribed
                        </>
                      ) : (
                        <>
                          <Bell className="w-3.5 h-3.5" />
                          Notify Me
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Releases
