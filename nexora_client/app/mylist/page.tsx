"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import MovieCard, { Movie } from "../components/card";
import MovieDetailModal from "../components/MovieDetailModal";
import { apiCall } from "../../utils/api";
import { Heart } from "lucide-react";

export default function MyListPage() {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token === "undefined" || token === "null") {
            router.push("/");
        } else {
            setIsAuth(true);
            fetchWishlist();
        }
    }, [router]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const wishlistData = await apiCall('/wishlist');
            
            // Fetch details for each item in parallel
            const detailPromises = wishlistData.map((item: any) => 
                apiCall(`/${item.mediaType === 'movie' ? 'movies' : 'series'}/${item.mediaId}`)
            );
            
            const movieDetails = await Promise.all(detailPromises);
            // Filter out any null responses
            setMovies(movieDetails.filter(m => m !== null));
        } catch (error) {
            console.error("Error fetching wishlist details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (movie: Movie) => {
        try {
            const wishlistItems = await apiCall('/wishlist');
            const item = wishlistItems.find((i: any) => i.mediaId === movie.id.toString());
            if (item) {
                await apiCall(`/wishlist/${item._id}`, 'DELETE');
                setMovies(prev => prev.filter(m => m.id !== movie.id));
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };

    if (!isAuth) return null;

    return (
        <div className="bg-[#020617] min-h-screen pt-24 px-4 md:px-12">
            <Navbar />
            
            <div className="mb-12">
                <h1 className="text-4xl font-black flex items-center gap-4">
                    <span className="w-3 h-12 bg-red-500 rounded-full" />
                    My List
                </h1>
                <p className="text-gray-400 mt-2 ml-7">Your personally curated collection of favorites</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                </div>
            ) : movies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {movies.map((movie) => (
                        <MovieCard 
                            key={movie.id} 
                            movie={movie} 
                            onInfoClick={setSelectedMovie}
                            onToggleWishlist={handleRemoveFromWishlist}
                            isInWishlist={true}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Heart size={40} className="text-gray-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-300">Your list is empty</h2>
                    <p className="text-gray-500 mt-2 max-w-md">
                        Start adding movies and series to your list by clicking the + button on any title.
                    </p>
                </div>
            )}

            <MovieDetailModal 
                movie={selectedMovie} 
                onClose={() => setSelectedMovie(null)} 
                onToggleWishlist={handleRemoveFromWishlist}
                wishlist={movies.map(m => m.id)}
            />
        </div>
    );
}
