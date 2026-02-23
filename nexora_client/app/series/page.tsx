"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import MovieCard, { Movie } from "../components/card";
import MovieDetailModal from "../components/MovieDetailModal";
import { apiCall } from "../../utils/api";
import { Filter } from "lucide-react";

const TV_GENRES = [
    { id: 'all', name: 'All' },
    { id: 10759, name: 'Action & Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 18, name: 'Drama' },
    { id: 9648, name: 'Mystery' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
];

export default function SeriesPage() {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);
    const [series, setSeries] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedGenre, setSelectedGenre] = useState<string | number>('all');
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
            fetchSeries(1, true);
        }
    }, [selectedGenre, isAuth]);

    const fetchInitialData = async () => {
        try {
            const wishlistData = await apiCall('/wishlist');
            if (Array.isArray(wishlistData)) {
                setWishlist(wishlistData.map((item: any) => item.mediaId));
            }
            await fetchSeries(1, true);
        } catch (error) {
            console.error("Error fetching initial data:", error);
        }
    };

    const fetchSeries = async (pageNum: number, isNewGenre: boolean = false) => {
        if (isNewGenre) setLoading(true);
        else setLoadingMore(true);

        try {
            const data = await apiCall(`/series?genre=${selectedGenre}&page=${pageNum}`);
            const results = data.results || [];
            
            if (isNewGenre) {
                setSeries(results);
                setPage(1);
            } else {
                setSeries(prev => [...prev, ...results]);
                setPage(pageNum);
            }
            setTotalPages(data.total_pages || 1);
        } catch (error) {
            console.error("Error fetching series:", error);
            if (isNewGenre) setSeries([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleSeeMore = () => {
        if (page < totalPages) {
            fetchSeries(page + 1);
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
                await apiCall('/wishlist', 'POST', { mediaId: movie.id, mediaType: 'tv' });
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
                    <span className="w-3 h-12 bg-orange-500 rounded-full" />
                    TV Series
                </h1>

                {/* Genre Filters */}
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    <div className="flex items-center gap-2 text-gray-500 mr-2">
                        <Filter size={18} />
                        <span className="text-sm font-bold uppercase tracking-wider text-white">Filters</span>
                    </div>
                    {TV_GENRES.map((genre) => (
                        <button
                            key={genre.id}
                            onClick={() => setSelectedGenre(genre.id)}
                            className={`px-6 py-2.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all duration-300 border ${
                                selectedGenre === genre.id
                                    ? 'bg-orange-500 border-orange-400 text-black shadow-lg shadow-orange-500/20'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {genre.name}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {Array.isArray(series) && series.map((item) => (
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
                                className="group relative px-12 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50 text-white"
                            >
                                {loadingMore ? (
                                    <div className="flex items-center gap-3">
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-orange-500" />
                                        Loading...
                                    </div>
                                ) : (
                                    "See More Series"
                                )}
                                <div className="absolute inset-0 bg-orange-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
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
