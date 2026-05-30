import React from 'react'
import { useAppContext } from '../context/AppContext'
import { Calendar, Clock, MapPin, Ticket, Sparkles, Receipt } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle'

function MyBookings() {
  const { bookings, shows } = useAppContext()
  const navigate = useNavigate()

  const formattedDate = (dateStr) => {
    try {
      if (!dateStr) return ''
      const d = new Date(dateStr)
      return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const formattedTime = (isoString) => {
    try {
      if (!isoString) return ''
      const d = new Date(isoString)
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return isoString
    }
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 pt-32 pb-20 min-h-screen text-white relative overflow-hidden">
      <BlurCircle top='-80px' left='-80px' />
      <BlurCircle bottom='-80px' right='-80px' />

      {/* Header */}
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center mb-16 relative z-10">
        <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 animate-pulse">
          <Ticket className="w-3.5 h-3.5" />
          History
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          My Bookings
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-xl">
          View all your purchased movie tickets. Present any active ticket details at the theater counter for entry.
        </p>
      </div>

      {/* Bookings List */}
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col gap-8">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white/5 border border-white/10 rounded-3xl max-w-2xl mx-auto backdrop-blur-md shadow-xl w-full">
            <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-6 text-primary border border-primary/30 shadow-[0_0_20px_rgba(248,69,101,0.2)] animate-pulse">
              <Receipt className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No Bookings Found</h2>
            <p className="text-gray-400 text-sm max-w-md mb-8 leading-relaxed">
              It looks like you haven't booked any tickets yet. Catch the latest releases now!
            </p>
            <button 
              onClick={() => navigate('/movies')}
              className="px-8 py-3.5 bg-primary hover:bg-primary-dull text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-primary/20 transition duration-300 flex items-center gap-2 cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              Book Movie Tickets
            </button>
          </div>
        ) : (
          bookings.map((booking, idx) => {
            const movieObj = shows.find(s => s.title.toLowerCase() === booking.movieTitle.toLowerCase())
            const posterPath = movieObj ? movieObj.poster_path : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=300&q=80'

            return (
              <div 
                key={booking.sessionId || idx} 
                className="w-full flex flex-col md:flex-row bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300 shadow-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform hover:-translate-y-1"
              >
                {/* Movie Poster */}
                <div className="w-full md:w-48 h-64 md:h-auto relative overflow-hidden bg-gray-950 flex-shrink-0">
                  <img 
                    src={posterPath} 
                    alt={booking.movieTitle} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-gray-950/80 via-transparent to-transparent md:hidden"></div>
                </div>

                {/* Ticket Body */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[9px] font-bold tracking-widest uppercase">
                        Paid ✓
                      </span>
                      <span className="text-[10px] font-mono text-gray-500">
                        ID: {booking.sessionId?.substring(12, 24).toUpperCase() || 'SUCCESS'}
                      </span>
                    </div>

                    <h2 className="text-2xl font-extrabold text-white mt-3 tracking-tight">
                      {booking.movieTitle}
                    </h2>
                    
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>MovieMint Cinemas &bull; IMAX Screen 2</span>
                    </div>

                    {/* Schedule detail grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Show Date</span>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-300">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>{formattedDate(booking.date)}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Show Time</span>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-300">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          <span>{formattedTime(booking.time)}</span>
                        </div>
                      </div>
                      <div className="space-y-1 col-span-2 sm:col-span-1">
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Seats ({booking.seats.length})</span>
                        <p className="text-xs font-bold text-gray-200 truncate">{booking.seats.join(', ')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Metadata Footer */}
                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex flex-col gap-0.5 text-left">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Booked on</span>
                      <span className="text-[11px] text-gray-400">
                        {booking.bookedAt ? new Date(booking.bookedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recently'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Amount Paid</span>
                      <span className="text-xl font-extrabold text-primary">${booking.totalAmount}.00</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default MyBookings
