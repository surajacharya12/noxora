"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import MovieCard, { Movie } from "../components/card";
import MovieDetailModal from "../components/MovieDetailModal";
import { apiCall } from "../../utils/api";
import { TrendingUp, Film, Tv } from "lucide-react";

export default function TrendingPage() {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);
    const [trending, setTrending] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedType, setSelectedType] = useState<string>('all');
    const [totalPages, setTotalPages] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token === "undefined" || token === "null") {
            router.push("/");
        } else {
            setIsAuth(true);
            fetchInitialData();
        }
    }, [router]);

    useEffect(() => {
        if (isAuth) {
            fetchTrendingContent(1, true);
        }
    }, [selectedType, isAuth]);

    const fetchInitialData = async () => {
        try {
            const wishlistData = await apiCall('/wishlist');
            if (Array.isArray(wishlistData)) {
                setWishlist(wishlistData.map((item: any) => item.mediaId));
            }
            await fetchTrendingContent(1, true);
        } catch (error) {
            console.error("Error fetching initial data:", error);
        }
    };

    const fetchTrendingContent = async (pageNum: number, isNewType: boolean = false) => {
        if (isNewType) setLoading(true);
        else setLoadingMore(true);

        try {
            const data = await apiCall(`/trending?type=${selectedType}&page=${pageNum}`);
            const results = Array.isArray(data) ? data : (data.results || []);
            
            if (isNewType) {
                setTrending(results);
                setPage(1);
            } else {
                setTrending(prev => [...prev, ...results]);
                setPage(pageNum);
            }
            setTotalPages(data.total_pages || 1);
        } catch (error) {
            console.error("Error fetching trending:", error);
            if (isNewType) setTrending([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleSeeMore = () => {
        if (page < totalPages) {
            fetchTrendingContent(page + 1);
        }
    };

    const handleToggleWishlist = async (movie: Movie) => {
        try {
            const isInWishlist = wishlist.includes(movie.id);
            if (isInWishlist) {
                const wishlistItems = await apiCall('/wishlist');
                const item = wishlistItems.find((i: any) => i.mediaId === movie.id.toString() || i.mediaId === movie.id);
                if (item) {
                    await apiCall(`/wishlist/${item._id}`, 'DELETE');
                    setWishlist(prev => prev.filter(id => id !== movie.id));
                }
            } else {
                await apiCall('/wishlist', 'POST', { 
                    mediaId: movie.id, 
                    mediaType: movie.release_date ? 'movie' : 'tv' 
                });
                setWishlist(prev => [...prev, movie.id]);
            }
        } catch (error) {
            console.error("Error toggling wishlist:", error);
        }
    };

    if (!isAuth) return null;

    return (
        <div className="bg-[#020617] min-h-screen pt-24 px-4 md:px-12">
            <Navbar />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <h1 className="text-4xl font-black flex items-center gap-4 text-white">
                    <span className="w-3 h-12 bg-blue-600 rounded-full" />
                    Trending Now
                </h1>

                {/* Type Filters */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSelectedType('all')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-black transition-all border ${
                            selectedType === 'all'
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                    >
                        <TrendingUp size={16} /> All
                    </button>
                    <button
                        onClick={() => setSelectedType('movie')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-black transition-all border ${
                            selectedType === 'movie'
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                    >
                        <Film size={16} /> Movies
                    </button>
                    <button
                        onClick={() => setSelectedType('tv')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-black transition-all border ${
                            selectedType === 'tv'
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                    >
                        <Tv size={16} /> TV Series
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {Array.isArray(trending) && trending.map((item) => (
                            <MovieCard 
                                key={item.id} 
                                movie={item} 
                                onInfoClick={setSelectedMovie}
                                onToggleWishlist={handleToggleWishlist}
                                isInWishlist={wishlist.includes(item.id)}
                            />
                        ))}
                    </div>

                    {page < totalPages && (
                        <div className="flex justify-center mt-16 pb-20">
                            <button
                                onClick={handleSeeMore}
                                disabled={loadingMore}
                                className="group relative px-12 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black transition-all active:scale-95 text-white disabled:opacity-50"
                            >
                                {loadingMore ? (
                                    <div className="flex items-center gap-3">
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-blue-500" />
                                        Loading...
                                    </div>
                                ) : (
                                    "See More Trending"
                                )}
                                <div className="absolute inset-0 bg-blue-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                            </button>
                        </div>
                    )}
                </>
            )}

            <MovieDetailModal 
                movie={selectedMovie} 
                onClose={() => setSelectedMovie(null)} 
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
            />
        </div>
    );
}
