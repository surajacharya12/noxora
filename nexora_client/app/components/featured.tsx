"use client";

import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import MovieCard, { Movie } from "./card";
import { apiCall } from "../../utils/api";

interface ContentSectionProps {
  onInfoClick: (movie: Movie) => void;
  onToggleWishlist?: (movie: Movie) => void;
  wishlist?: number[];
}

const ContentSection = ({ onInfoClick, onToggleWishlist, wishlist = [] }: ContentSectionProps) => {
  const router = useRouter();
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await apiCall('/trending?type=movie');
        setFeaturedMovies(data.results?.slice(0, 10) || []); // Get results array
      } catch (error) {
        console.error("Error fetching featured:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) return null;

  return (
    <section className="bg-[#020617] pb-10 px-4 md:px-12 -mt-16 pt-10 relative z-30">
      
      {/* 1. GLOWING SEARCH BAR */}
      <div className="max-w-4xl mx-auto mb-20">
        <form onSubmit={handleSearchSubmit} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 rounded-2xl blur-xl opacity-50 group-focus-within:opacity-100 transition duration-1000"></div>
          <div className="relative flex items-center">
            <Search className="absolute left-6 w-6 h-6 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search movies, series, documentaries..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0b1020]/80 border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 backdrop-blur-2xl transition-all placeholder:text-gray-600 font-medium text-white"
            />
          </div>
        </form>
      </div>

      {/* 3. FEATURED THIS WEEK SLIDER */}
      <div className="relative">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-3xl font-black tracking-tight">
              Featured This Week
            </h2>
            <div className="flex gap-3">
              <button 
                onClick={() => scroll('left')}
                className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all border border-white/10 shadow-lg active:scale-95 group"
              >
                <ChevronLeft className="w-6 h-6 group-hover:text-cyan-400" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all border border-white/10 shadow-lg active:scale-95 group"
              >
                <ChevronRight className="w-6 h-6 group-hover:text-cyan-400" />
              </button>
            </div>
          </div>

          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-10 no-scrollbar snap-x scroll-smooth"
          >
            {featuredMovies.map((movie) => (
              <div key={movie.id} className="min-w-[85%] md:min-w-[45%] lg:min-w-[32%] snap-start first:ml-2">
                <MovieCard 
                  movie={movie} 
                  variant="featured" 
                  onInfoClick={onInfoClick} 
                  onToggleWishlist={onToggleWishlist}
                  isInWishlist={wishlist.includes(movie.id)}
                />
              </div>
            ))}
          </div>
        </div>
      
    </section>
  );
};

export default ContentSection;
