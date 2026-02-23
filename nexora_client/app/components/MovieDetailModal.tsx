"use client";

import React, { useEffect, useState } from 'react';
import { X, Play, Plus, Star, Check, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Movie } from './card';
import { apiCall } from '../../utils/api';

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  onToggleWishlist?: (movie: Movie) => void;
  wishlist?: number[];
}

const MovieDetailModal = ({ movie, onClose, onToggleWishlist, wishlist = [] }: MovieDetailModalProps) => {
  const router = useRouter();
  const [fullDetails, setFullDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movie) {
      const fetchFullDetails = async () => {
        setLoading(true);
        try {
          const type = movie.release_date ? 'movies' : 'series';
          const data = await apiCall(`/${type}/${movie.id}`);
          setFullDetails(data);
        } catch (error) {
          console.error("Error fetching movie details:", error);
          setFullDetails(movie);
        } finally {
          setLoading(false);
        }
      };
      fetchFullDetails();
    } else {
      setFullDetails(null);
    }
  }, [movie]);

  if (!movie) return null;

  const displayMovie = fullDetails || movie;
  const title = displayMovie.title || displayMovie.name || "Untitled";
  const rating = (displayMovie.vote_average || 0).toFixed(1);
  const year = (displayMovie.release_date || displayMovie.first_air_date || "").substring(0, 4);
  const duration = displayMovie.runtime 
    ? `${Math.floor(displayMovie.runtime / 60)}h ${displayMovie.runtime % 60}m`
    : displayMovie.episode_run_time?.[0] 
      ? `${displayMovie.episode_run_time[0]}m`
      : "N/A";
      
  const backdrop = displayMovie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${displayMovie.backdrop_path}` 
    : displayMovie.img;

  const genres = displayMovie.genres || [];
  const typeText = displayMovie.release_date ? 'Movie' : 'TV Series';
  const isInWishlist = wishlist.includes(movie.id);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      {/* Backdrop Blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-5xl bg-[#020617] rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10 animate-in fade-in zoom-in duration-500 max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-50 p-2.5 bg-black/40 hover:bg-black/60 rounded-full text-white border border-white/10 backdrop-blur-xl transition-all active:scale-90"
        >
          <X size={24} />
        </button>

        {/* Banner Area */}
        <div className="relative aspect-video w-full">
          <img src={backdrop} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-[#020617]/20 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-[#020617] via-transparent to-transparent opacity-60" />
          
          <div className="absolute bottom-12 left-12 right-12">
            <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl mb-6 border border-white/20">
              <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
                {title}
              </h2>
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1.5 bg-cyan-500/20 border border-cyan-400/30 px-3 py-1.5 rounded-xl text-cyan-400 font-black shadow-lg shadow-cyan-500/10">
                <Star size={16} fill="currentColor" />
                <span>{rating}</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-gray-300 font-bold">
                {year}
              </div>
              <div className="bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-gray-300 font-bold flex items-center gap-2">
                <Clock size={16} />
                {duration}
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => movie && router.push(`/watch/${movie.release_date ? 'movie' : 'tv'}/${movie.id}`)}
                className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-black hover:bg-cyan-400 transition-all active:scale-95 shadow-2xl"
              >
                <Play size={24} fill="black" />
                Watch Now
              </button>
              <button 
                onClick={() => onToggleWishlist?.(movie)}
                className={`flex items-center gap-3 ${isInWishlist ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-white/5 hover:bg-white/10'} border border-white/10 backdrop-blur-xl px-10 py-4 rounded-2xl font-black text-white transition-all active:scale-95 shadow-2xl`}
              >
                {isInWishlist ? <Check size={24} /> : <Plus size={24} />}
                {isInWishlist ? 'In List' : 'Add to List'}
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="p-12 md:px-16 pb-20">
          <div className="grid md:grid-cols-12 gap-16">
            <div className="md:col-span-8">
              <h3 className="text-2xl font-black mb-6 text-white tracking-tight">Description</h3>
              <p className="text-gray-400 leading-relaxed text-xl font-medium">
                {displayMovie.overview || displayMovie.description || displayMovie.desc || "No description available."}
              </p>
            </div>
            
            <div className="md:col-span-4 space-y-12">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 mb-6 font-mono">Genres</h3>
                <div className="flex flex-wrap gap-3">
                  {genres.length > 0 ? genres.map((g: any) => (
                    <span key={g.id} className="px-5 py-2.5 bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-[13px] font-black text-cyan-400 transition-colors">
                      {g.name}
                    </span>
                  )) : (
                    <>
                      <span className="px-5 py-2.5 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl text-[13px] font-black text-cyan-400">Sci-Fi</span>
                      <span className="px-5 py-2.5 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl text-[13px] font-black text-cyan-400">Adventure</span>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 mb-4 font-mono">Type</h3>
                <p className="text-white text-xl font-black tracking-tight">{typeText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
