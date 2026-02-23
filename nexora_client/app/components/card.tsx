import React from 'react';
import { Play, Plus, Info, Star } from 'lucide-react';

interface Movie {
  title: string;
  rating: string;
  year: string;
  img: string;
  desc?: string;
}

interface MovieCardProps {
  movie: Movie;
  variant?: 'standard' | 'featured' | 'ranked';
  rank?: number | null;
}

const MovieCard = ({ movie, variant = 'standard', rank = null }: MovieCardProps) => {
  // Standard Vertical Card (used in Action, Sci-Fi, etc.)
  if (variant === 'standard') {
    return (
      <div className="min-w-[180px] md:min-w-[220px] group cursor-pointer">
        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 group-hover:border-blue-500/50 transition-all duration-300">
          <img src={movie.img} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <div className="flex gap-2">
              <button className="bg-white p-2 rounded-full text-black hover:bg-blue-400 transition-colors"><Play size={16} fill="currentColor"/></button>
              <button className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/10 hover:bg-white/30 transition-colors"><Plus size={16}/></button>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <h4 className="font-bold text-sm truncate group-hover:text-cyan-400 transition-colors">{movie.title}</h4>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold mt-1">
            <span className="flex items-center gap-0.5 text-cyan-500"><Star size={10} fill="currentColor"/> {movie.rating}</span>
            <span>{movie.year}</span>
          </div>
        </div>
      </div>
    );
  }

  // Featured Wide Card (used in Featured This Week)
  if (variant === 'featured') {
    return (
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10 group cursor-pointer shadow-2xl">
        <img src={movie.img} alt={movie.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute top-4 left-4 bg-orange-600 text-[10px] font-black uppercase px-3 py-1 rounded-lg">Featured</div>
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-2xl font-bold mb-1 group-hover:text-cyan-400 transition-colors">{movie.title}</h3>
          <p className="text-gray-400 text-xs line-clamp-1 mb-4">{movie.desc}</p>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-xs font-bold transition-all"><Play size={14} fill="white"/> Watch Now</button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold border border-white/10">More Info</button>
          </div>
        </div>
      </div>
    );
  }

  // Top Ranked Card (Big Number behind poster)
  if (variant === 'ranked') {
    return (
      <div className="min-w-[220px] md:min-w-[260px] flex items-end group cursor-pointer relative pt-10">
        <span className="text-[140px] font-black leading-none text-white/10 absolute -left-4 -bottom-4 z-0 group-hover:text-blue-500/20 transition-colors">
          {rank}
        </span>
        <div className="relative z-10 w-3/4 ml-auto aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-transform group-hover:-translate-y-2">
           <img src={movie.img} alt={movie.title} className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }
};

export default MovieCard;