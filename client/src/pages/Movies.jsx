import React from 'react'
import MovieCard from '../components/MoviesCard'
import BlurCircle from '../components/BlurCircle'
import { useAppContext } from '../context/AppContext'

const Movies = () => {
  const { shows } = useAppContext()

  const movieList = Array.isArray(shows)
    ? shows.filter((movie) => movie && movie._id)
    : []

  return movieList.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>

      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className='text-xs font-semibold tracking-[0.2em] text-primary uppercase'>Now Showing</h1>
      <h2 className='text-2xl font-bold tracking-tight mb-8'>In Theatres</h2>

      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {movieList.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center'>No movies available</h1>
    </div>
  )
}

export default Movies