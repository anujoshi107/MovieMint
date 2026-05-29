import React from 'react'
import { dummyShowsData } from '../assets/assets'
import MovieCard from './MoviesCard'
import BlurCircle from './BlurCircle'
function Movies() {
  return (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle top="70px" left="0px"/>
      <BlurCircle bottom="50px" right="50px"/>
      <h1 className='text-lg font-medium my-4'>Now Showing</h1>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>

      {dummyShowsData.map(movie => 
        <MovieCard movie = {movie} key = {movie._id} />
      )}
      </div>
    </div>
  )
}

export default Movies
