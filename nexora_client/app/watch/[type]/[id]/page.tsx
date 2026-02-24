"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ChevronLeft, Star, Clock, Server, ListFilter, PlayCircle } from "lucide-react";
import Navbar from "../../../components/navbar";
import MovieCard, { Movie } from "../../../components/card";
import { apiCall } from "../../../../utils/api";

export default function WatchPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const type = params.type as string; // 'movie' or 'tv'
    const id = params.id as string;
    
    // TV Specific State
    const [activeSeason, setActiveSeason] = useState(1);
    const [activeEpisode, setActiveEpisode] = useState(1);
    const [episodes, setEpisodes] = useState<any[]>([]);
    const [loadingEpisodes, setLoadingEpisodes] = useState(false);
    
    const [content, setContent] = useState<any>(null);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const [initialProgress, setInitialProgress] = useState(0);
    const [playerSource, setPlayerSource] = useState<'vidsrc' | 'vidking'>('vidsrc');

    const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && token !== "undefined" && token !== "null") {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
        fetchDetails(!!(token && token !== "undefined" && token !== "null"));
    }, [id, type]);

    // Fetch episodes when season changes
    useEffect(() => {
        if (type === 'tv' && isAuth) {
            fetchEpisodes(activeSeason);
        }
    }, [activeSeason, isAuth, id]);

    const fetchEpisodes = async (seasonNum: number) => {
        setLoadingEpisodes(true);
        try {
            const data = await apiCall(`/series/${id}/season/${seasonNum}`);
            setEpisodes(data.episodes || []);
        } catch (error) {
            console.error("Error fetching episodes:", error);
        } finally {
            setLoadingEpisodes(false);
        }
    };

    const fetchDetails = async (authenticated: boolean) => {
        setLoading(true);
        try {
            const endpoint = type === 'movie' ? `/movies/${id}` : `/series/${id}`;
            const promises: Promise<any>[] = [apiCall(endpoint)];
            
            if (authenticated) {
                promises.push(apiCall('/progress'));
            }
            
            const results = await Promise.all(promises);
            const data = results[0];
            setContent(data);

            if (authenticated && results[1]) {
                const progressData = results[1];
                const existingProgress = progressData.find((p: any) => p.mediaId === id);
                if (existingProgress) {
                    setInitialProgress(existingProgress.secondsWatched);
                }
            }

            const recData = await apiCall(`/trending?type=${type === 'movie' ? 'movie' : 'tv'}`);
            setRecommendations((recData.results || []).filter((item: Movie) => item.id.toString() !== id).slice(0, 10));
        } catch (error) {
            console.error("Error fetching watch details:", error);
        } finally {
            setLoading(false);
        }
    };
    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
    );

    const title = content?.title || content?.name || "Untitled";
    const rating = (content?.vote_average || 0).toFixed(1);
    const year = (content?.release_date || content?.first_air_date || "").substring(0, 4);
    const duration = content?.runtime 
        ? `${Math.floor(content.runtime / 60)}h ${content.runtime % 60}m`
        : content?.episode_run_time?.[0] 
          ? `${content.episode_run_time[0]}m`
          : "N/A";
    
    // Construct URLs
    const getPlayerUrl = () => {
        if (playerSource === 'vidking') {
            return type === 'movie' 
                ? `https://www.vidking.net/embed/movie/${id}?color=0dcaf0&autoPlay=true&progress=${initialProgress}`
                : `https://www.vidking.net/embed/tv/${id}/${activeSeason}/${activeEpisode}?color=0dcaf0&autoPlay=true&episodeSelector=true&nextEpisode=true&progress=${initialProgress}`;
        } else {
            return type === 'movie'
                ? `https://vidsrc.to/embed/movie/${id}`
                : `https://vidsrc.to/embed/tv/${id}/${activeSeason}/${activeEpisode}`;
        }
    };

    return (
        <div className="bg-[#020617] min-h-screen text-white">
            <Navbar />
            
            <main className="pt-24 pb-20">
                {/* Header Controls */}
                <div className="px-4 md:px-12 mb-6 flex items-center justify-between">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all active:scale-95 group font-bold text-sm"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>

                    <div className="flex gap-2">
                        <button 
                            onClick={() => setPlayerSource('vidking')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${playerSource === 'vidking' ? 'bg-cyan-500 border-cyan-400 text-black' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                        >
                            <Server size={14} /> Server 1
                        </button>
                        <button 
                            onClick={() => setPlayerSource('vidsrc')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${playerSource === 'vidsrc' ? 'bg-cyan-500 border-cyan-400 text-black' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                        >
                            <Server size={14} /> Server 2
                        </button>
                    </div>
                </div>

                {/* Video Player Section */}
                <div className="w-full aspect-video bg-black relative shadow-2xl overflow-hidden border-y border-white/5 group">
                    <iframe 
                        key={`${playerSource}-${activeSeason}-${activeEpisode}`}
                        src={getPlayerUrl()}
                        className="w-full h-full"
                        allowFullScreen
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-12 px-4 md:px-12 mt-12">
                    {/* Left Side: Details */}
                    <div className="flex-1">
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-xl text-white">
                            {title}
                        </h1>
                        
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-1.5 bg-cyan-500/20 border border-cyan-400/30 px-3 py-1.5 rounded-xl text-cyan-400 font-black shadow-lg">
                                <Star size={18} fill="currentColor" />
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

                        <p className="text-gray-400 text-xl leading-relaxed font-medium mb-12 max-w-4xl">
                            {content?.overview || "No description available."}
                        </p>

                        <div className="flex flex-wrap gap-3 mb-12">
                            {content?.genres?.map((g: any) => (
                                <span key={g.id} className="px-5 py-2.5 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl text-[13px] font-black text-cyan-400">
                                    {g.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: TV Specific Selector */}
                    {type === 'tv' && (
                        <div className="w-full lg:w-[400px] shrink-0">
                            <div className="bg-[#0b1020] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
                                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                                    <h3 className="text-xl font-black flex items-center gap-3">
                                        <ListFilter size={20} className="text-cyan-400" />
                                        Episodes
                                    </h3>
                                    
                                    <select 
                                        value={activeSeason}
                                        onChange={(e) => setActiveSeason(Number(e.target.value))}
                                        className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-500 transition-all cursor-pointer"
                                    >
                                        {content?.seasons?.map((s: any) => (
                                            <option key={s.id} value={s.season_number}>
                                                Season {s.season_number}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="max-h-[500px] overflow-y-auto no-scrollbar p-2">
                                    {loadingEpisodes ? (
                                        <div className="py-20 flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-500" />
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {episodes.map((ep) => (
                                                <button
                                                    key={ep.id}
                                                    onClick={() => setActiveEpisode(ep.episode_number)}
                                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                                                        activeEpisode === ep.episode_number 
                                                            ? 'bg-cyan-500 text-black font-black' 
                                                            : 'hover:bg-white/5 text-gray-400 font-medium'
                                                    }`}
                                                >
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                                                        activeEpisode === ep.episode_number ? 'bg-black/20' : 'bg-white/10'
                                                    }`}>
                                                        {ep.episode_number}
                                                    </div>
                                                    <div className="flex-1 text-left line-clamp-1 text-sm">
                                                        {ep.name}
                                                    </div>
                                                    <PlayCircle className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity ${
                                                        activeEpisode === ep.episode_number ? 'opacity-100 text-black' : 'text-cyan-400'
                                                    }`} />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* More Like This */}
                <div className="px-4 md:px-12 mt-20">
                    <h2 className="text-3xl font-black mb-10 tracking-tight flex items-center gap-4 text-white">
                        <span className="w-2 h-10 bg-cyan-500 rounded-full" />
                        More Like This
                    </h2>
                    
                    <div className="flex gap-6 overflow-x-auto pb-10 no-scrollbar snap-x">
                        {recommendations.map((m) => (
                            <div key={m.id} className="snap-start">
                                <MovieCard 
                                    movie={m} 
                                    onInfoClick={(movie) => router.push(`/watch/${movie.release_date ? 'movie' : 'tv'}/${movie.id}`)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
