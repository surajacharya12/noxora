"use client";

import React, { useEffect, useState } from 'react';
import { Play, Plus, Info, Star, Check } from 'lucide-react';
import { apiCall } from '../../utils/api';
import { Movie } from './card';
import { useRouter } from 'next/navigation';

interface HeroProps {
  onInfoClick?: (movie: Movie) => void;
  onToggleWishlist?: (movie: Movie) => void;
  wishlist?: number[];
}

const Hero = ({ onInfoClick, onToggleWishlist, wishlist = [] }: HeroProps) => {
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroMovie = async () => {
      try {
        const trending = await apiCall('/trending?type=movie');
        if (trending && trending.results && trending.results.length > 0) {
          // Get details for the first trending movie to get richer data
          const details = await apiCall(`/movies/${trending.results[0].id}`);
          setMovie(details);
        }
      } catch (error) {
        console.error("Failed to fetch hero movie:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroMovie();
  }, []);

  if (loading || !movie) {
    return <div className="h-[90vh] bg-[#020617] animate-pulse" />;
  }

  const title = movie.title || movie.name;
  const rating = movie.vote_average?.toFixed(1);
  const year = (movie.release_date || movie.first_air_date || "").substring(0, 4);
  const backdrop = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  const isInWishlist = movie ? wishlist.includes(movie.id) : false;

  return (
    <div className="relative h-[90vh] w-full flex items-end pb-32 px-4 md:px-12 overflow-hidden">
      {/* 1. Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backdrop} 
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Softened Overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 bg-linear-to-r from-[#020617] via-transparent to-transparent opacity-60" />
      </div>

      {/* 2. Hero Content Area */}
      <div className="relative z-10 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 text-white">
          {title}
        </h1>

        {/* Metadata Row (Rating, Year, Genre) */}
        <div className="flex items-center gap-4 mb-6 text-sm font-semibold text-gray-300">
          <div className="flex items-center gap-1.5 bg-blue-600/20 border border-blue-400/30 px-2 py-0.5 rounded-md text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Star className="w-3.5 h-3.5 fill-cyan-400" />
            <span>{rating}</span>
          </div>
          <span>{year}</span>
          <span className="w-1 h-1 rounded-full bg-gray-500" />
          <span>Trending Now</span>
        </div>

        {/* Synopsis */}
        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl line-clamp-3">
          {movie.overview}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Watch Now - White Button */}
          <button 
            onClick={() => movie && router.push(`/watch/${movie.release_date ? 'movie' : 'tv'}/${movie.id}`)}
            className="flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-xl font-bold hover:bg-cyan-400 transition-all active:scale-95 shadow-xl"
          >
            <Play className="w-5 h-5 fill-black" />
            Watch Now
          </button>

          {/* My List - Dark Button */}
          <button 
            onClick={() => movie && onToggleWishlist?.(movie)}
            className={`flex items-center gap-2 ${isInWishlist ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-white/10 hover:bg-white/20'} border border-white/10 backdrop-blur-md px-8 py-3.5 rounded-xl font-bold transition-all active:scale-95 shadow-xl`}
          >
            {isInWishlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isInWishlist ? 'In List' : 'My List'}
          </button>

          {/* Info - Circular/Square Icon Button */}
          <button 
            onClick={() => onInfoClick?.(movie)}
            className="p-4 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md rounded-xl transition-all active:scale-95 shadow-xl group"
          >
            <Info className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
          </button>
        </div>
      </div>
      
      {/* 3. Bottom Gradient Transition to Content */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-[#020617] to-transparent z-0" />
    </div>
  );
};

export default Hero;
