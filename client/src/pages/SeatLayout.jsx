import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { dummyDateTimeData, dummyDashboardData, dummyShowsData } from '../assets/assets'
import BlurCircle from './BlurCircle'
import { ChevronRightIcon } from 'lucide-react'

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
    <div key={row} className="flex gap-2 mt-2 items-center">
      <span className="w-4 text-sm font-bold text-gray-200 shrink-0">{row}</span>
      <div className="flex flex-wrap items-center gap-2">
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
              className={`h-8 w-8 rounded border text-[10px] font-medium ${
                isOccupied
                  ? 'border-red-500/70 bg-red-500/20 text-red-100 cursor-not-allowed'
                  : `cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white border-primary'
                        : 'border-primary/60 text-gray-200 hover:border-primary'
                    }`
              }`}
            >
              {seatId}
            </button>
          )
        })}
      </div>
    </div>
  )

  /** Front: A–B full width centered. Middle/back: left block + aisle + right block. */
  const renderSplitBlock = (leftRows, rightRows) => (
    <div className="mt-6 flex justify-center items-start gap-10 md:gap-16 lg:gap-24">
      <div className="flex flex-col">{leftRows.map((r) => renderSeatRow(r))}</div>
      <div
        className="hidden sm:block w-px shrink-0 self-stretch min-h-18 bg-primary/25 rounded-full"
        aria-hidden
      />
      <div className="flex flex-col">{rightRows.map((r) => renderSeatRow(r))}</div>
    </div>
  )

  const totalAmount = selectedSeats.length * showPrice

  const onBookNow = () => {
    if (!selectedSlot) return toast('Please select a timing')
    if (selectedSeats.length === 0) return toast('Please select at least 1 seat')

    toast(`Seats booked: ${selectedSeats.join(', ')} (Total: ${totalAmount})`)
    // TODO: navigate to checkout/payment and persist booking
  }

  if (!show || !show.movie) {
    return (
      <div className="mt-20 px-10">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="mt-20 px-10 pb-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-bold">{show.movie.title}</h1>
          <p className="text-sm text-gray-400">Select a timing and seats</p>
        </div>

        <div className="flex items-start justify-center gap-8">
          {/* Left timings card */}
          <div className="w-[280px] bg-primary/10 border border-primary/20 rounded-lg p-5">
            <p className="text-lg font-semibold mb-3">Available Timings</p>
            {timings.length === 0 ? (
              <p className="text-sm text-gray-400">No timings available for this date.</p>
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
                      className={`px-3 py-2 rounded border text-left transition cursor-pointer ${
                        selected
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white/0 text-gray-200 border-primary/30 hover:bg-primary/10'
                      }`}
                    >
                      <p className="text-sm font-medium">{formatTime(slot.time)}</p>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Seat map area */}
          <div className="flex-1 bg-black/20 border border-black rounded-lg p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
              <BlurCircle top='0px' left='-50px'/>
              <BlurCircle  bottom='0px' right='0px'/>
               
                <p className="text-lg font-semibold text-white/90">Select your seat</p>
                <p className="text-sm text-gray-300 mt-1">
                  Legend:{' '}
                  <span className="text-green-400 font-semibold">Available</span> •{' '}
                  <span className="text-red-400 font-semibold">Occupied</span> •{' '}
                  <span className="text-primary font-semibold">Selected</span>
                </p>
              </div>

              <div className="min-w-[220px]">
                <p className="text-sm text-gray-300">Show Price</p>
                <p className="text-xl font-bold text-white">{showPrice || '-'}</p>
                <p className="text-sm text-gray-300 mt-2">Total</p>
                <p className="text-xl font-bold text-white">{totalAmount || 0}</p>
              </div>
            </div>

            {/* Screen */}
            <div className="mt-6">
              <div className="flex flex-col items-center">
                <div className="text-xs font-semibold text-gray-200 tracking-wide mb-2">SCREEN SIDE</div>
                  <div className="w-full h-3 bg-primary/50 rounded-full" />
              </div>
            </div>

            {!selectedSlot ? (
              <p className="text-sm text-gray-300 mt-6">
                Select a timing on the left to see occupied seats.
              </p>
            ) : (
              <div className="mt-4 flex flex-col items-center w-full">
                {/* Front block: A & B centered under screen */}
                <div className="flex flex-col items-center w-full">
                  {['A', 'B'].map((row) => (
                    <div key={row} className="flex justify-center w-full">
                      {renderSeatRow(row)}
                    </div>
                  ))}
                </div>

                {/* Middle block: C,D | aisle | E,F */}
                {renderSplitBlock(['C', 'D'], ['E', 'F'])}

                {/* Back block: G,H | aisle | I,J */}
                {renderSplitBlock(['G', 'H'], ['I', 'J'])}
              </div>
            )}

            <div className="mt-8 flex flex-col items-center gap-4">
              <p className="text-sm text-gray-200 text-center">
                Selected:{' '}
                <span className="font-semibold">
                  {selectedSeats.length ? selectedSeats.join(', ') : '-'}
                </span>
              </p>

              <button
                type="button"
                onClick={onBookNow}
                className="bg-primary text-white px-10 py-3 rounded-full hover:bg-primary/90 transition cursor-pointer inline-flex items-center gap-2 font-medium"
              >
                Proceed to Checkout
                <ChevronRightIcon className="w-5 h-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeatLayout
