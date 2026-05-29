import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import ReactPlayer from 'react-player'
import BlurCircle from './BlurCircle'
import { PlayCircleIcon } from 'lucide-react'

const TrailersSection = () => {

    const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])
    const [playing, setPlaying] = useState(false)

    const handleTrailerSelect = (trailer) => {
        setCurrentTrailer(trailer)
        setPlaying(true)
    }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
      <p className='text-gray-300 font-medium text-lg max-w-[960px] mx-auto'>Trailers</p>

      <div className='relative mt-6 max-w-[960px] mx-auto'>
        <BlurCircle top='-100px' right='-100px'/>
        <div className='w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-sm'>
          <ReactPlayer 
            src={currentTrailer.videoUrl} 
            controls={true} 
            playing={playing}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className="react-player" 
            width="100%" 
            height="100%"
          />
        </div>
      </div>

      <div className='group grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 mt-8 max-w-[960px] mx-auto'>
        {dummyTrailers.map((trailer)=>{
            const isActive = currentTrailer.videoUrl === trailer.videoUrl;
            return (
                <div 
                    key={trailer.image} 
                    className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                        isActive 
                            ? 'ring-2 ring-primary opacity-100' 
                            : 'opacity-70 group-hover:opacity-40 hover:!opacity-100'
                    }`} 
                    onClick={() => handleTrailerSelect(trailer)}
                >
                    <img 
                        src={trailer.image} 
                        alt="trailer thumbnail" 
                        className='w-full h-full object-cover brightness-75 hover:brightness-90 transition duration-300'
                    />
                    <PlayCircleIcon 
                        strokeWidth={1.6} 
                        className={`absolute top-1/2 left-1/2 w-8 h-8 md:w-12 md:h-12 transform -translate-x-1/2 -translate-y-1/2 transition duration-300 ${
                            isActive ? 'text-primary scale-110' : 'text-white/80 group-hover:text-white'
                        }`}
                    />
                </div>
            );
        })}
      </div>
    </div>
  )
}

export default TrailersSection

