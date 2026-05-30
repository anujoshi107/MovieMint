import React from 'react'
import { useAppContext } from '../context/AppContext'
import MovieCard from './MoviesCard'
import BlurCircle from './BlurCircle'
import { Heart, Film } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Favorite() {
  const { favoriteMovies } = useAppContext()
  const navigate = useNavigate()

  return (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[60vh]'>
      <BlurCircle top="70px" left="0px"/>
      <BlurCircle bottom="50px" right="50px"/>
      
      <h1 className='text-2xl font-bold my-6 tracking-tight text-white'>Your Favorite Movies</h1>
      
      {favoriteMovies.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white/5 border border-white/10 rounded-3xl max-w-2xl mx-auto backdrop-blur-md shadow-xl">
          <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-6 text-primary border border-primary/30 shadow-[0_0_20px_rgba(248,69,101,0.2)] animate-pulse">
            <Heart className="w-8 h-8 fill-primary" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Favorites Yet</h2>
          <p className="text-gray-400 text-sm max-w-md mb-8 leading-relaxed">
            Explore our curated selection of blockbusters and tap the heart icon on any movie to save it here!
          </p>
          <button 
            onClick={() => navigate('/movies')}
            className="px-8 py-3.5 bg-primary hover:bg-primary-dull text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-primary/20 transition duration-300 flex items-center gap-2 cursor-pointer"
          >
            <Film className="w-4 h-4" />
            Explore Movies
          </button>
        </div>
      ) : (
        <div className='flex flex-wrap max-sm:justify-center gap-8'>
          {favoriteMovies.map(movie => 
            <MovieCard movie = {movie} key = {movie._id} />
          )}
        </div>
      )}
    </div>
  )
}

export default Favorite
