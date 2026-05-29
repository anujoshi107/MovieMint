import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { dummyDateTimeData, dummyDashboardData, dummyShowsData } from '../assets/assets'
import BlurCircle from './BlurCircle'
import { Clock } from 'lucide-react'

function SeatLayout() {
  const { id, date } = useParams()

  const [show, setShow] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null) // timing object from dummyDateTimeData[date]
  const [selectedSeats, setSelectedSeats] = useState([])

  useEffect(() => {
    // `:id` sometimes comes as `_id` (string) and sometimes as numeric `id`.
    const movie = dummyShowsData.find((m) => m._id == id || m.id == id)
    setShow(
      movie
        ? {
            movie,
            datetime: dummyDateTimeData,
          }
        : null
    )
    // reset when route changes
    setSelectedSlot(null)
    setSelectedSeats([])
  }, [id, date])

  const timings = useMemo(() => {
    if (!show?.datetime || !date) return []
    return show.datetime[date] || []
  }, [show, date])

  // Auto-select the first timing slot when timings load (UX improvement matching screenshots)
  useEffect(() => {
    if (timings.length > 0 && !selectedSlot) {
      setSelectedSlot(timings[0])
    }
  }, [timings, selectedSlot])

  const activeShow = useMemo(() => {
    if (!show?.movie) return null

    const movieId = show.movie._id
    const slotDateKey = selectedSlot?.time ? new Date(selectedSlot.time).toISOString().slice(0, 10) : date

    // Prefer an activeShow that matches both movie + date, but fall back to any activeShow for the movie.
    return (
      dummyDashboardData.activeShows.find((s) => s.movie?._id == movieId && s.showDateTime?.slice(0, 10) == slotDateKey) ||
      dummyDashboardData.activeShows.find((s) => s.movie?._id == movieId) ||
      null
    )
  }, [show, selectedSlot, date])

  const occupiedSeats = activeShow?.occupiedSeats || {}
  const showPrice = activeShow?.showPrice || 0

  const formatTime = (isoString) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return isoString
    }
  }

  const handleSeatClick = (seatId) => {
    if (occupiedSeats[seatId]) return

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) return prev.filter((s) => s !== seatId)
      return [...prev, seatId]
    })
  }

  const renderSeatRow = (row, count = 9) => (
    <div key={row} className="flex items-center gap-2.5">
      {Array.from({ length: count }, (_, i) => {
        const seatId = `${row}${i + 1}`
        const isOccupied = !!occupiedSeats[seatId]
        const isSelected = selectedSeats.includes(seatId)
        return (
          <button
            key={seatId}
            type="button"
            onClick={() => handleSeatClick(seatId)}
            disabled={isOccupied}
            className={`w-9 h-9 flex items-center justify-center rounded-md border text-[11px] font-semibold transition-all duration-300 cursor-pointer ${
              isOccupied
                ? 'border-white/5 bg-white/5 text-white/10 cursor-not-allowed'
                : isSelected
                  ? 'bg-primary border-primary text-white shadow-[0_0_12px_rgba(248,69,101,0.4)] scale-105'
                  : 'border-primary/40 text-gray-300 bg-transparent hover:border-primary hover:text-white'
            }`}
          >
            {seatId}
          </button>
        )
      })}
    </div>
  )

  /** Front: A–B full width centered. Middle/back: left block + aisle + right block. */
  const renderSplitBlock = (leftRows, rightRows) => (
    <div className="mt-4 flex justify-center items-start gap-8 md:gap-12 lg:gap-16 w-full">
      <div className="flex flex-col gap-2.5">{leftRows.map((r) => renderSeatRow(r))}</div>
      <div className="flex flex-col gap-2.5">{rightRows.map((r) => renderSeatRow(r))}</div>
    </div>
  )

  const totalAmount = selectedSeats.length * showPrice

  const onBookNow = async () => {
    if (!selectedSlot) return toast.error('Please select a timing')
    if (selectedSeats.length === 0) return toast.error('Please select at least 1 seat')

    const loadingToast = toast.loading('Redirecting to Stripe Checkout...')

    try {
      const response = await fetch('http://localhost:5000/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieTitle: show.movie.title,
          selectedSeats: selectedSeats,
          showPrice: showPrice,
          totalAmount: totalAmount,
          date: date,
          time: selectedSlot.time,
          movieId: id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate payment')
      }

      toast.dismiss(loadingToast)
      toast.success('Ready for Checkout!')
      
      // Redirect directly to Stripe Hosted Checkout
      window.location.href = data.url
    } catch (err) {
      toast.dismiss(loadingToast)
      console.error(err)
      toast.error(err.message || 'Server connection error. Make sure your local backend is running.')
    }
  }

  if (!show || !show.movie) {
    return (
      <div className="pt-32 px-6 md:px-16 lg:px-24 xl:px-44 text-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 pt-32 pb-20 min-h-screen overflow-hidden">
      <BlurCircle top='-80px' left='-80px'/>
      <BlurCircle bottom='-80px' right='-80px'/>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-start justify-center">
        
        {/* Left timings card */}
        <div className="w-full md:w-[260px] min-w-[260px] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
          <p className="text-lg font-semibold text-white mb-4">Available Timings</p>
          {timings.length === 0 ? (
            <p className="text-sm text-gray-400">No timings available.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {timings.map((slot) => {
                const selected = selectedSlot?.time === slot.time
                return (
                  <button
                    key={slot.time}
                    onClick={() => {
                      setSelectedSlot(slot)
                      setSelectedSeats([]) // reset selected seats for new slot
                    }}
                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                      selected
                        ? 'bg-primary/20 text-white border-primary shadow-[0_0_15px_rgba(248,69,101,0.2)] ring-1 ring-primary'
                        : 'bg-transparent text-gray-300 border-white/10 hover:bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <Clock className={`w-4 h-4 ${selected ? 'text-primary' : 'text-gray-400'}`} />
                    <span className="text-sm font-semibold tracking-wide">{formatTime(slot.time)}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Seat map area */}
        <div className="flex-1 w-full flex flex-col items-center">
          
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center">Select your seat</h2>

          {/* Screen curve */}
          <div className="w-full flex flex-col items-center mt-6 mb-12">
            <div className="w-full max-w-[400px] h-4 border-t-[3px] border-primary/60 rounded-[50%_50%_0_0] opacity-80 shadow-[0_-2px_10px_rgba(248,69,101,0.3)]"></div>
            <div className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase -mt-1">SCREEN SIDE</div>
          </div>

          {!selectedSlot ? (
            <p className="text-sm text-gray-300 text-center mt-6">
              Select a timing on the left to see occupied seats.
            </p>
          ) : (
            <div className="flex flex-col items-center w-full">
              {/* Front block: A & B centered under screen */}
              <div className="flex flex-col items-center gap-2.5 w-full">
                {['A', 'B'].map((row) => renderSeatRow(row))}
              </div>

              {/* Middle block: C,D | aisle | E,F */}
              {renderSplitBlock(['C', 'D'], ['E', 'F'])}

              {/* Back block: G,H | aisle | I,J */}
              {renderSplitBlock(['G', 'H'], ['I', 'J'])}
            </div>
          )}

          {/* Centered Proceed to Checkout Button */}
          {selectedSeats.length > 0 && (
            <div className="mt-12 flex justify-center w-full">
              <button
                type="button"
                onClick={onBookNow}
                className="px-10 py-3.5 bg-primary hover:bg-primary-dull text-white text-sm font-semibold rounded-full shadow-[0_4px_20px_rgba(248,69,101,0.3)] hover:shadow-[0_6px_25px_rgba(248,69,101,0.4)] transition-all duration-300 cursor-pointer flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Proceed to Checkout
                <span className="text-base font-bold">→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SeatLayout
