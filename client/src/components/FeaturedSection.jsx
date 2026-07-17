import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle'
import MovieCard from './MoviesCard'
import { useAppContext } from '../context/AppContext'

const FeaturedSection = () => {
  const navigate = useNavigate()
  const { shows } = useAppContext()

  const featuredMovies = Array.isArray(shows)
    ? shows.filter((show) => show && show._id).slice(0, 4)
    : []

  if (featuredMovies.length === 0) {
    return null
  }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden'>

      <div className='relative flex items-center justify-between pt-20 pb-10'>
        <BlurCircle top='0' right='-80px' />

        <div className='flex flex-col gap-1'>
          <p className='text-xs font-semibold tracking-[0.2em] text-primary uppercase'>Now Showing</p>
          <h2 className='text-2xl font-bold tracking-tight'>In Theatres</h2>
        </div>

        <button
          onClick={() => navigate('/movies')}
          className='group flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer'
        >
          View All
          <ArrowRight className='group-hover:translate-x-1 transition-transform w-4 h-4' />
        </button>
      </div>

      <div className='flex flex-wrap max-sm:justify-center gap-8 mt-8'>
        {featuredMovies.map((show) => (
          <MovieCard key={show._id} movie={show} />
        ))}
      </div>

      <div className='flex justify-center mt-20'>
        <button
          onClick={() => {
            navigate('/movies')
          }}
          className='group flex items-center gap-2 px-10 py-3 text-sm bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all rounded-full font-medium tracking-wide cursor-pointer'
        >
          Browse All Movies
          <ArrowRight className='group-hover:translate-x-0.5 transition-transform w-4 h-4' />
        </button>
      </div>
    </div>
  )
}

export default FeaturedSection