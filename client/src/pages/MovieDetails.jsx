import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { dummyDateTimeData, dummyShowsData } from '../assets/assets';
import { PlayCircleIcon, StarIcon } from 'lucide-react';
import BlurCircle from './BlurCircle';
import timeFormat from '../lib/timeFormat';
import { dummyCastsData } from '../assets/assets';
import DateSelect from '../components/DateSelect';
import MovieCard from './MoviesCard';
import Loading from '../components/Loading';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setshow] = useState(null);

  const getshow = async () => {
    const movie = dummyShowsData.find(m => m._id == id);
    setshow({ movie : movie ,
      datetime : dummyDateTimeData

    });
  }

  useEffect(() => {
    getshow();
  }, [id])

  if (!show || !show.movie) {
    return <div className="mt-20 px-10"><p>loading..</p></div>
  }

  return show ? (
    <div className='mt-20 px-10'>

      {/* Main Container */}
      <div className='flex gap-8'>

        {/* Poster */}
        <img
          src={show.movie.poster_path}
          alt=""
          className='w-[250px] h-[360px] object-cover rounded-lg'
        />

        {/* Details */}
        <div className='flex flex-col gap-3 relative'>

          <BlurCircle top="30px" left="40px" />

          <p className='text-sm text-gray-400'>ENGLISH</p>

          <h1 className='text-3xl font-bold'>
            {show.movie.title}
          </h1>

          <div className='flex items-center gap-2'>
            <StarIcon className='text-yellow-600' />
            <span>8.5</span>
          </div>

          <p className='mt-4 overflow-auto text-sm text-white/60 w-[700px]'>
            {show.movie.overview}
          </p>

          <p>
            {timeFormat(show.movie.runtime)} •{" "}
            {show.movie.genres?.map(g => g.name).join(", ")} •{" "}
            {new Date(show.movie.release_date).getFullYear()}
          </p>

          <div className='flex gap-3'>
            <button className='flex p-3 bg-gray-700 gap-2 hover:bg-gray-500 rounded-lg'>
              <PlayCircleIcon />
              Watch Trailer
            </button>

            {/* ✅ Anchor fixed */}
            <a href="#dateSelect" className='bg-red-400 p-3 rounded-lg'>
              Buy Tickets
            </a>
          </div>
        </div>
      </div>

      <p className='text-lg font-medium mt-20'>Your Favorite Cast</p>
      <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
        <div className='flex items-center gap-4 w-max px-4'>
          {show.movie.casts.slice(0,12).map((cast,index)=> (
            <div key={index} className='flex flex-col items-center text-center'>
              <img src={cast.profile_path} alt="" className='rounded-full h-20 md:h-20 aspect-square object-cover'/>
              <p className='font-medium text-xs mt-3'>{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ DATE SELECT SECTION (IMPORTANT FIX) */}
      <DateSelect dateTime={show.datetime} id={id} />
      <p className='text-lg font-medium mt-20 mb-8'>You May Also Like</p>
            <div className='flex flex-wrap max-sm:justify-center gap-8'>
                {show.movie.similar?.slice(0,4).map((movie, index)=> (
                  <MovieCard key={index} movie={movie}/>
                ))}
            </div>
            <div className='flex justify-center mt-20'>
                <button onClick={()=> {navigate('/movies'); scrollTo(0,0)}} className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'>Show more</button>
            </div>
    </div>
  ):<Loading/>
}

export default MovieDetails;