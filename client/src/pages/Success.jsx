import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { Check, Calendar, Clock, MapPin, Sparkles, Home, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import BlurCircle from './BlurCircle'

function Success() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useUser()

  const movieTitle = searchParams.get('movie') || 'Unknown Movie'
  const seatsStr = searchParams.get('seats') || ''
  const seats = seatsStr ? seatsStr.split(',') : []
  const totalAmount = searchParams.get('amount') || '0'
  const price = searchParams.get('price') || '0'
  const date = searchParams.get('date') || ''
  const time = searchParams.get('time') || ''

  useEffect(() => {
    // Show a success toast on mount
    toast.success('Payment completed successfully! Enjoy your show!')
  }, [])

  const formattedTime = (isoString) => {
    try {
      if (!isoString) return ''
      const d = new Date(isoString)
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return isoString
    }
  }

  const formattedDate = (dateStr) => {
    try {
      if (!dateStr) return ''
      const d = new Date(dateStr)
      return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 pt-32 pb-20 min-h-screen overflow-hidden text-white flex flex-col items-center justify-center relative">
      <BlurCircle top='-80px' left='-80px' />
      <BlurCircle bottom='-80px' right='-80px' />

      {/* Success Badge */}
      <div className="flex flex-col items-center mb-8 relative z-10 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 relative shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-pulse">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
            <Check className="w-8 h-8 text-emerald-400 stroke-[3]" />
          </div>
        </div>
        <p className="text-emerald-400 text-sm font-bold uppercase tracking-[0.25em] mb-1">Booking Confirmed</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Thanks for your purchase{user?.firstName ? `, ${user.firstName}` : ''}!
        </h1>
        <p className="text-gray-400 text-sm mt-2 text-center max-w-md">
          Your payment was processed successfully. Present the virtual ticket below at the theater.
        </p>
      </div>

      {/* Ticket Container */}
      <div className="w-full max-w-[480px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative z-10 animate-slide-up">
        {/* Sparkles Decoration */}
        <div className="absolute top-4 right-4 text-primary/40">
          <Sparkles className="w-5 h-5 animate-spin-slow" />
        </div>

        {/* Ticket Header (Movie Info) */}
        <div className="p-6 md:p-8 pb-4">
          <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-[10px] font-bold tracking-widest uppercase">
            Movie Ticket
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3 tracking-tight">
            {movieTitle}
          </h2>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>MovieMint Cinemas &bull; IMAX Screen 2</span>
          </div>
        </div>

        {/* Dynamic Dotted Tear Line with circular notches */}
        <div className="relative flex items-center justify-between w-full my-2">
          <div className="w-5 h-8 bg-black border-r border-white/10 rounded-r-full -ml-2.5"></div>
          <div className="flex-1 border-t-2 border-dashed border-white/20 mx-2"></div>
          <div className="w-5 h-8 bg-black border-l border-white/10 rounded-l-full -mr-2.5"></div>
        </div>

        {/* Ticket Details */}
        <div className="p-6 md:p-8 pt-4">
          <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Show Date</span>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-200">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{formattedDate(date)}</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Show Time</span>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-200">
                <Clock className="w-4 h-4 text-primary" />
                <span>{formattedTime(time)}</span>
              </div>
            </div>
            <div className="space-y-1 col-span-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Booked Seats</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {seats.map((seat) => (
                  <span key={seat} className="px-2.5 py-1 bg-white/10 border border-white/15 rounded-lg text-xs font-bold text-gray-200">
                    {seat}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Ticket Price</span>
              <p className="text-sm font-bold text-gray-200">${price} each</p>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Total Amount</span>
              <p className="text-base font-extrabold text-primary">${totalAmount}.00</p>
            </div>
          </div>

          {/* Simulated Premium Barcode / QR Code Area */}
          <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center border border-white/5">
            <div className="w-full h-14 flex items-center justify-between gap-[2px] opacity-70 mb-2.5">
              {Array.from({ length: 42 }).map((_, i) => {
                const heights = ['h-full', 'h-5/6', 'h-4/5', 'h-2/3']
                const widths = ['w-[1px]', 'w-[2px]', 'w-[3px]', 'w-[4px]']
                const h = heights[(i * 7) % heights.length]
                const w = widths[(i * 3) % widths.length]
                return <div key={i} className={`bg-white ${w} ${h} rounded-full`}></div>
              })}
            </div>
            <span className="text-[9px] font-mono tracking-[0.4em] text-gray-400">
              MM-{searchParams.get('session_id')?.substring(12, 24).toUpperCase() || 'BOOKING-SUCCESS'}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 relative z-10 w-full max-w-[480px]">
        <button
          onClick={() => navigate('/')}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-dull text-white text-sm font-semibold rounded-full shadow-[0_4px_20px_rgba(248,69,101,0.3)] transition-all duration-300 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </button>
        
        <button
          onClick={() => {
            window.print()
          }}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer"
        >
          <CreditCard className="w-4 h-4 text-primary" />
          Print Ticket
        </button>
      </div>
    </div>
  )
}

export default Success
