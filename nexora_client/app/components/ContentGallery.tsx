"use client";

import React, { useEffect, useState } from 'react';
import MovieCard, { Movie } from './card';
import { apiCall } from '../../utils/api';

interface ContentGalleryProps {
  onInfoClick: (movie: Movie) => void;
  onToggleWishlist?: (movie: Movie) => void;
  wishlist?: number[];
}

const ContentGallery = ({ onInfoClick, onToggleWishlist, wishlist = [] }: ContentGalleryProps) => {
  const [trendingAll, setTrendingAll] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingTV, setTrendingTV] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [allRes, moviesRes, tvRes] = await Promise.all([
                    apiCall('/trending?type=all'),
                    apiCall('/trending?type=movie'),
                    apiCall('/trending?type=tv')
                ]);
                setTrendingAll(allRes.results || []);
                setTrendingMovies(moviesRes.results || []);
                setTrendingTV(tvRes.results || []);
            } catch (error) {
                console.error("Error fetching gallery data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

  if (loading) return null;

  return (
    <div className="bg-[#020617] text-white p-4 md:p-12 space-y-20 relative z-20">
      
      {/* SECTION: Trending Now (Ranked) */}
      <section>
        <h2 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-3">
          <span className="w-2 h-8 bg-blue-600 rounded-full" />
          Top 10 Today
        </h2>
        <div className="flex gap-8 overflow-x-auto pb-10 no-scrollbar snap-x">
          {trendingAll.slice(0, 10).map((m, i) => (
            <div key={m.id} className="snap-start">
               <MovieCard 
                movie={m} 
                variant="ranked" 
                rank={i + 1} 
                onInfoClick={onInfoClick} 
                onToggleWishlist={onToggleWishlist}
                isInWishlist={wishlist.includes(m.id)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: Popular Movies */}
      <section>
        <h2 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-3">
          <span className="w-2 h-8 bg-cyan-500 rounded-full" />
          Popular Movies
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x">
          {trendingMovies.map(m => (
            <div key={m.id} className="snap-start">
              <MovieCard 
                movie={m} 
                variant="standard" 
                onInfoClick={onInfoClick} 
                onToggleWishlist={onToggleWishlist}
                isInWishlist={wishlist.includes(m.id)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: Must-Watch Series */}
      <section>
        <h2 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-3">
          <span className="w-2 h-8 bg-orange-500 rounded-full" />
          Must-Watch Series
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x">
          {trendingTV.map(m => (
            <div key={m.id} className="snap-start">
              <MovieCard 
                movie={m} 
                variant="standard" 
                onInfoClick={onInfoClick} 
                onToggleWishlist={onToggleWishlist}
                isInWishlist={wishlist.includes(m.id)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: Highly Rated */}
      <section>
        <h2 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-3">
          <span className="w-2 h-8 bg-purple-500 rounded-full" />
          Critically Acclaimed
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x">
          {[...trendingMovies].reverse().map(m => (
            <div key={m.id} className="snap-start">
              <MovieCard 
                movie={m} 
                variant="standard" 
                onInfoClick={onInfoClick} 
                onToggleWishlist={onToggleWishlist}
                isInWishlist={wishlist.includes(m.id)}
              />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default ContentGallery;