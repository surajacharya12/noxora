"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/navbar";
import MovieCard, { Movie } from "../components/card";
import MovieDetailModal from "../components/MovieDetailModal";
import { apiCall } from "../../utils/api";

function SearchContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || "";
    
    const [isAuth, setIsAuth] = useState(false);
    const [results, setResults] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [wishlist, setWishlist] = useState<number[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token === "undefined" || token === "null") {
            router.push("/");
        } else {
            setIsAuth(true);
            fetchData();
        }
    }, [router, query]);

    const fetchData = async () => {
        if (!query) {
            setResults([]);
            setLoading(false);
            return;
        }
        
        setLoading(true);
        try {
            const [searchData, wishlistData] = await Promise.all([
                apiCall(`/search?query=${encodeURIComponent(query)}`),
                apiCall('/wishlist')
            ]);
            setResults(searchData);
            setWishlist(wishlistData.map((item: any) => item.mediaId));
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
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
            
            <h1 className="text-4xl font-black mb-12 flex items-center gap-4">
                <span className="w-3 h-12 bg-cyan-500 rounded-full" />
                Results for: <span className="text-cyan-400 ml-2">"{query}"</span>
            </h1>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-20">
                    {results.map((item) => (
                        <MovieCard 
                            key={item.id} 
                            movie={item} 
                            onInfoClick={setSelectedMovie}
                            onToggleWishlist={handleToggleWishlist}
                            isInWishlist={wishlist.includes(item.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <p className="text-2xl font-bold">No results found for your search.</p>
                    <p className="mt-2">Try different keywords or check for typos.</p>
                </div>
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

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
