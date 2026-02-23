"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ContentGallery from "../components/ContentGallery";
import ContentSection from "../components/featured";
import ContinueWatching from "../components/ContinueWatching";
import Hero from "../components/hero";
import Navbar from "../components/navbar";
import MovieDetailModal from "../components/MovieDetailModal";
import { Movie } from "../components/card";
import { apiCall } from "../../utils/api";

export default function HomePage() {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [wishlist, setWishlist] = useState<number[]>([]);

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
            const data = await apiCall('/wishlist');
            setWishlist(data.map((item: any) => item.mediaId));
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    };

    const handleToggleWishlist = async (movie: Movie) => {
        try {
            const isInWishlist = wishlist.includes(movie.id);
            if (isInWishlist) {
                const wishlistItems = await apiCall('/wishlist');
                const item = wishlistItems.find((i: any) => i.mediaId === movie.id.toString());
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

    const handleInfoClick = (movie: Movie) => {
        setSelectedMovie(movie);
    };



    if (!isAuth) return null;

    return (
        <div className="bg-[#020617] min-h-screen">
            <Navbar />
            <Hero 
                onInfoClick={handleInfoClick} 
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
            />
            
            <div className="relative z-20">
                <ContentSection 
                    onInfoClick={handleInfoClick} 
                    onToggleWishlist={handleToggleWishlist}
                    wishlist={wishlist}
                />
                <ContinueWatching 
                    onInfoClick={handleInfoClick} 
                    onToggleWishlist={handleToggleWishlist}
                    wishlist={wishlist}
                />
                <ContentGallery 
                    onInfoClick={handleInfoClick} 
                    onToggleWishlist={handleToggleWishlist}
                    wishlist={wishlist}
                />
            </div>

            <MovieDetailModal 
                movie={selectedMovie} 
                onClose={() => setSelectedMovie(null)} 
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
            />
        </div>
    );
}