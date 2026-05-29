import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { dummyDateTimeData, dummyShowsData } from '../assets/assets';
import { PlayCircleIcon, StarIcon, Heart } from 'lucide-react';
import BlurCircle from './BlurCircle';
import timeFormat from '../lib/timeFormat';
import DateSelect from '../components/DateSelect';
import MovieCard from './MoviesCard';
import Loading from '../components/Loading';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setshow] = useState(null);

  const getshow = async () => {
    const movie = dummyShowsData.find(m => m._id == id);
    setshow({ 
      movie: movie,
      datetime: dummyDateTimeData
    });
  }

  useEffect(() => {
    getshow();
  }, [id])

  if (!show || !show.movie) {
    return (
      <div className="pt-32 px-6 md:px-16 lg:px-24 xl:px-44 text-center">
        <Loading />
      </div>
    );
  }

  // Filter similar movies dynamically (excluding current movie)
  const similarMovies = dummyShowsData.filter(m => m._id != id).slice(0, 4);

  return show ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 pt-32 pb-20 overflow-hidden'>

      {/* Main Container */}
      <div className='flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start'>

        {/* Poster */}
        <img
          src={show.movie.poster_path}
          alt={show.movie.title}
          className='w-[270px] min-w-[270px] h-[400px] object-cover rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.6)] border border-white/10'
        />

        {/* Details */}
        <div className='flex flex-col gap-4 relative flex-1 w-full'>

          <BlurCircle top="-20px" left="40px" />
          <BlurCircle bottom="-40px" right="-40px" />

          <p className='text-xs font-semibold text-primary tracking-widest uppercase'>
            {show.movie.original_language === 'en' ? 'ENGLISH' : show.movie.original_language?.toUpperCase() || 'ENGLISH'}
          </p>

          <h1 className='text-4xl md:text-5xl font-bold tracking-tight text-white mt-1'>
            {show.movie.title}
          </h1>

          <div className='flex items-center gap-2 mt-1'>
            <StarIcon className='w-5 h-5 text-primary fill-primary' />
            <span className='text-sm md:text-base font-semibold text-gray-200'>
              {show.movie.vote_average?.toFixed(1) || '7.5'} User Rating
            </span>
          </div>

          <p className='text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl mt-2'>
            {show.movie.overview}
          </p>

          <p className='text-sm md:text-base text-gray-300 font-medium mt-2'>
            {timeFormat(show.movie.runtime)} <span className='text-gray-500 mx-1.5'>•</span>{" "}
            {show.movie.genres?.map(g => g.name).join(", ")} <span className='text-gray-500 mx-1.5'>•</span>{" "}
            {new Date(show.movie.release_date).getFullYear()}
          </p>

          <div className='flex flex-wrap items-center gap-4 mt-6'>
            <button className='flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm font-semibold transition duration-300 text-white cursor-pointer'>
              <PlayCircleIcon className='w-5 h-5' />
              Watch Trailer
            </button>

            <a href="#dateSelect" className='px-8 py-3 bg-primary hover:bg-primary-dull text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-primary/20 transition duration-300 text-center cursor-pointer'>
              Buy Tickets
            </a>

            <button className='p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition duration-300 text-white flex items-center justify-center cursor-pointer aspect-square'>
              <Heart className='w-5 h-5' />
            </button>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <p className='text-xl md:text-2xl font-semibold text-white mt-20'>Your Favorite Cast</p>
      <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
        <div className='flex items-start gap-6 md:gap-8 w-max py-2 px-1'>
          {show.movie.casts.slice(0, 12).map((cast, index) => (
            <div key={index} className='flex flex-col items-center text-center w-20 md:w-24 group cursor-pointer'>
              <div className='relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border border-white/10 shadow-md group-hover:scale-105 transition-transform duration-300'>
                <img 
                  src={cast.profile_path} 
                  alt={cast.name} 
                  className='w-full h-full object-cover'
                />
              </div>
              <p className='font-medium text-xs text-gray-300 group-hover:text-white mt-3 leading-snug line-clamp-2 max-w-[90px] transition-colors duration-300'>
                {cast.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Date/Showtime selection */}
      <DateSelect dateTime={show.datetime} id={id} />

      {/* Similar Movies Section */}
      <p className='text-xl md:text-2xl font-semibold text-white mt-20 mb-8'>You May Also Like</p>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {similarMovies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>

      <div className='flex justify-center mt-20'>
        <button 
          onClick={() => { navigate('/movies'); scrollTo(0, 0) }} 
          className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'
        >
          Show more
        </button>
      </div>
    </div>
  ) : <Loading />
}

export default MovieDetails;