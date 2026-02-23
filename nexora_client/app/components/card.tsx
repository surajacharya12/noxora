"use client";

import React from 'react';
import { Play, Plus, Info, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  // Fallbacks for hardcoded data
  img?: string;
  rating?: string;
  year?: string;
  desc?: string;
}

interface MovieCardProps {
  movie: Movie;
  variant?: 'standard' | 'featured' | 'ranked';
  rank?: number | null;
  onInfoClick?: (movie: Movie) => void;
  onToggleWishlist?: (movie: Movie) => void;
  isInWishlist?: boolean;
  badgeText?: string;
}

const MovieCard = ({ 
  movie, 
  variant = 'standard', 
  rank = null, 
  onInfoClick,
  onToggleWishlist,
  isInWishlist,
  badgeText
}: MovieCardProps) => {
  const router = useRouter();
  const title = movie.title || movie.name || "Untitled";
  const rating = movie.vote_average?.toFixed(1) || movie.rating || "0.0";
  const year = (movie.release_date || movie.first_air_date || movie.year || "").substring(0, 4);
  const image = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : movie.img || "/assets/placeholder.jpg";

  // Standard Vertical Card
  if (variant === 'standard') {
    return (
      <div 
        onClick={() => onInfoClick?.(movie)}
        className="min-w-[180px] md:min-w-[220px] group cursor-pointer relative"
      >
        <div className="relative aspect-2/3 rounded-2xl overflow-hidden border border-white/10 group-hover:border-blue-500/50 transition-all duration-500 shadow-xl">
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-[#020617]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
             <div className="flex items-center gap-2 mb-3">
               <button 
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/watch/${movie.release_date ? 'movie' : 'tv'}/${movie.id}`);
                }}
                className="bg-white p-2.5 rounded-full text-black hover:bg-cyan-400 transition-colors shadow-lg"
               >
                 <Play size={16} fill="currentColor"/>
               </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist?.(movie);
                  }}
                  className={`backdrop-blur-md p-2.5 rounded-full border transition-colors shadow-lg ${
                    isInWishlist 
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" 
                      : "bg-white/10 border-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <Plus size={16} className={isInWishlist ? "text-cyan-400" : "text-white"}/>
                </button>
               <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onInfoClick?.(movie);
                }}
                className="bg-white/10 backdrop-blur-md p-2.5 rounded-full border border-white/20 hover:bg-white/30 transition-colors shadow-lg"
               >
                 <Info size={16} className="text-white"/>
               </button>
             </div>
          </div>
        </div>

        {/* Info below image */}
        <div className="mt-4 px-1">
          <h4 className="font-bold text-sm truncate group-hover:text-cyan-400 transition-colors duration-300">{title}</h4>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center gap-1 text-[11px] font-black text-cyan-500">
              <span className="text-cyan-500">★</span> {rating}
            </div>
            <span className="text-[11px] font-bold text-gray-500">{year}</span>
          </div>
        </div>
      </div>
    );
  }

  // Featured Wide Card
  if (variant === 'featured') {
    const featuredImage = movie.backdrop_path 
      ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` 
      : movie.img;
    
    return (
      <div 
        onClick={() => onInfoClick?.(movie)}
        className="relative aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10 group cursor-pointer shadow-2xl transition-all duration-500 hover:scale-[1.02]"
      >
        <img src={featuredImage} alt={title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
        {badgeText && (
          <div className="absolute top-4 left-4 bg-orange-600 text-[10px] font-black uppercase px-3 py-1 rounded-lg tracking-tighter shadow-lg z-10">
            {badgeText}
          </div>
        )}
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-2xl font-bold mb-1 group-hover:text-cyan-400 transition-colors">{title}</h3>
          <p className="text-gray-400 text-xs line-clamp-1 mb-4">{movie.overview || movie.desc}</p>
          <div className="flex items-center gap-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/watch/${movie.release_date ? 'movie' : 'tv'}/${movie.id}`);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95"
            >
              <Play size={14} fill="white"/> Watch Now
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onInfoClick?.(movie);
              }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-xl text-xs font-bold border border-white/10 transition-all shadow-lg active:scale-95"
            >
              More Info
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Top Ranked Card
  if (variant === 'ranked') {
    return (
      <div 
        onClick={() => onInfoClick?.(movie)}
        className="min-w-[220px] md:min-w-[260px] flex items-end group cursor-pointer relative pt-10"
      >
        <span className="text-[140px] font-black leading-none text-white/10 absolute -left-4 -bottom-4 z-0 group-hover:text-cyan-500/20 transition-colors duration-500 italic">
          {rank}
        </span>
        <div className="relative z-10 w-3/4 ml-auto aspect-2/3 rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:-translate-y-3 group-hover:border-cyan-500/50">
           <img src={image} alt={title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-[#020617]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
              <div className="flex items-center gap-2 mb-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/watch/${movie.release_date ? 'movie' : 'tv'}/${movie.id}`);
                  }}
                  className="bg-white p-2 rounded-full text-black hover:bg-cyan-400 transition-colors shadow-lg"
                >
                  <Play size={14} fill="currentColor"/>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist?.(movie);
                  }}
                  className={`backdrop-blur-md p-2 rounded-full border transition-colors shadow-lg ${
                    isInWishlist 
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" 
                      : "bg-white/10 border-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <Plus size={14} className={isInWishlist ? "text-cyan-400" : "text-white"}/>
                </button>
                <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   onInfoClick?.(movie);
                 }}
                 className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20 hover:bg-white/30 transition-colors shadow-lg"
                >
                  <Info size={14} className="text-white"/>
                </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MovieCard;
