"use client";

import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { apiCall } from '../../utils/api';
import MovieCard, { Movie } from './card';

interface ContinueWatchingProps {
    onInfoClick: (movie: Movie) => void;
    onToggleWishlist?: (movie: Movie) => void;
    wishlist?: number[];
}

const ContinueWatching = ({ onInfoClick, onToggleWishlist, wishlist = [] }: ContinueWatchingProps) => {
    const [watchedItems, setWatchedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchRecentlyWatched = async () => {
            try {
                const progress = await apiCall('/progress');
                
                if (!progress || progress.length === 0) {
                    setLoading(false);
                    return;
                }

                // Fetch first 10 recently watched items details
                const sortedProgress = progress
                    .sort((a: any, b: any) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())
                    .slice(0, 10);
                    
                const detailedProgress = await Promise.all(
                    sortedProgress.map(async (p: any) => {
                        try {
                            const details = await apiCall(p.mediaType === 'movie' ? `/movies/${p.mediaId}` : `/series/${p.mediaId}`);
                            return { ...details, progress: p };
                        } catch (err) {
                            return null;
                        }
                    })
                );
                
                setWatchedItems(detailedProgress.filter(i => i !== null));
            } catch (error) {
                console.error("Error fetching recently watched:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentlyWatched();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    if (loading || watchedItems.length === 0) return null;

    return (
        <section className="bg-[#020617] pb-10 px-4 md:px-12 relative z-30">
            <div className="relative">
                <div className="flex items-center justify-between mb-8 px-2">
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        <span className="w-2 h-8 bg-cyan-500 rounded-full" />
                        Continue Watching
                    </h2>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => scroll('left')}
                            className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-all border border-white/10 shadow-lg active:scale-95 group"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:text-cyan-400" />
                        </button>
                        <button 
                            onClick={() => scroll('right')}
                            className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-all border border-white/10 shadow-lg active:scale-95 group"
                        >
                            <ChevronRight className="w-5 h-5 group-hover:text-cyan-400" />
                        </button>
                    </div>
                </div>

                <div 
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x scroll-smooth"
                >
                    {watchedItems.map((item) => (
                        <div key={item.id} className="snap-start relative group">
                            <MovieCard 
                                movie={item} 
                                variant="standard" 
                                onInfoClick={onInfoClick} 
                                onToggleWishlist={onToggleWishlist}
                                isInWishlist={wishlist.includes(item.id)}
                            />
                            {/* Progress Overlay */}
                            <div className="absolute top-3 right-3 bg-[#0b1020]/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-[10px] font-bold text-gray-400 flex items-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Clock size={10} className="text-cyan-500" />
                                {new Date(item.progress.lastWatched).toLocaleDateString()}
                            </div>
                            {/* Progress Bar */}
                            <div className="mt-[-8px] h-1 w-[calc(100%-8px)] mx-auto bg-white/10 rounded-full overflow-hidden relative z-20">
                                <div className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: '65%' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ContinueWatching;
