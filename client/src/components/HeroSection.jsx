import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Deadpool & Wolverine (2024) — official TMDB HD backdrop
const BACKDROP = 'https://image.tmdb.org/t/p/original/cOoVcVQ3i1m5b2xtqKBtoTSbxC1.jpg'

const HeroSection = () => {
    const navigate = useNavigate()

    return (
        <div
            className='relative flex flex-col items-start justify-center px-6 md:px-16 lg:px-36 bg-cover bg-center h-screen'
            style={{ backgroundImage: `url(${BACKDROP})` }}
        >
            {/* Dark red gradient overlay to match theme */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" /> 
            {/* Subtle red tint to push toward theme color
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(180,20,40,0.18) 0%, transparent 70%)' }} />

            {/* Left-aligned content — exact layout from reference */}
            <div className="relative z-10 flex flex-col gap-4 max-w-lg">

                {/* Marvel Studios logo */}
                <img
                    src={assets.marvelLogo}
                    alt="Marvel Studios"
                    className="h-9 w-auto"
                    style={{ maxWidth: '180px' }}
                />

                {/* Title */}
                <h1 className='text-5xl md:text-[68px] md:leading-[1.1] font-semibold'>
                    Deadpool <br /> &amp; Wolverine
                </h1>

                {/* Genre · Year · Runtime */}
                <div className='flex items-center gap-4 text-gray-300 text-sm'>
                    <span>Action | Comedy | Sci-Fi</span>
                    <div className='flex items-center gap-1'>
                        <CalendarIcon className='w-4 h-4' /> 2024
                    </div>
                    <div className='flex items-center gap-1'>
                        <ClockIcon className='w-4 h-4' /> 2h 8m
                    </div>
                </div>

                {/* Description */}
                <p className='text-gray-300 text-sm leading-relaxed'>
                    A listless Wade Wilson must reluctantly suit-up again with an even more reluctant Wolverine when his homeworld faces an existential threat.
                </p>

                {/* CTA Button */}
                <button
                    onClick={() => navigate('/movies')}
                    className='flex items-center gap-2 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer w-fit mt-2'
                >
                    Explore Movies
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

export default HeroSection