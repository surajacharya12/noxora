"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, LogOut, Camera, Edit2, Play, Heart, Clock } from "lucide-react";
import Navbar from "../components/navbar";
import { apiCall } from "../../utils/api";
import MovieCard, { Movie } from "../components/card";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [recentlyWatched, setRecentlyWatched] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ username: "", password: "" });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token === "undefined" || token === "null") {
            router.push("/signin");
            return;
        }
        
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setFormData({ username: parsedUser.username, password: "" });
        }
        
        fetchProfileData();
    }, [router]);

    const fetchProfileData = async () => {
        try {
            const [wishlist, progress] = await Promise.all([
                apiCall('/wishlist'),
                apiCall('/progress')
            ]);
            
            setWishlistCount(wishlist.length);
            
            // Fetch first 5 recently watched items details
            const sortedProgress = progress
                .sort((a: any, b: any) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())
                .slice(0, 6);
                
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
            
            setRecentlyWatched(detailedProgress.filter(i => i !== null));
        } catch (error) {
            console.error("Error fetching profile data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await apiCall('/user/update', 'PUT', formData);
            setUser(res.user);
            localStorage.setItem("user", JSON.stringify(res.user));
            setIsEditing(false);
            setFormData(prev => ({ ...prev, password: "" })); // Clear password after update
            alert("Profile updated successfully!");
        } catch (error) {
            alert("Failed to update profile");
        }
    };

    const handleLogout = () => {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
    );

    return (
        <div className="bg-[#020617] min-h-screen text-white">
            <Navbar />
            
            <main className="pt-24 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
                {/* Header / Banner */}
                <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden mb-12 group">
                    <div className="absolute inset-0 bg-linear-to-br from-cyan-600/20 via-blue-900/40 to-black/80" />
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574267431629-994c849f99d4?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-50 transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 flex flex-col md:flex-row items-end gap-8">
                        <div className="relative group/avatar">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-linear-to-br from-cyan-500 to-blue-600 p-1 shadow-2xl overflow-hidden ring-4 ring-white/5">
                                <div className="w-full h-full bg-[#0b1020] rounded-[1.4rem] flex items-center justify-center relative overflow-hidden">
                                    <User size={64} className="text-cyan-500/50" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <Camera size={24} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex-1 pb-4">
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2 drop-shadow-2xl">
                                {user?.username}
                            </h1>
                            <div className="flex flex-wrap gap-4 text-gray-400 font-bold">
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                    <Mail size={16} className="text-cyan-400" />
                                    {user?.email}
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                    <Shield size={16} className="text-green-400" />
                                    Premium Member
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Stats & Actions */}
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 transition-all cursor-default group">
                                <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Heart size={24} className="text-cyan-400" />
                                </div>
                                <div className="text-3xl font-black mb-1">{wishlistCount}</div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">In Wishlist</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 transition-all cursor-default group">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Play size={24} className="text-blue-400" />
                                </div>
                                <div className="text-3xl font-black mb-1">{recentlyWatched.length}</div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Last Watched</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-[#0b1020] border border-white/10 rounded-[2.5rem] p-8 space-y-4">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                                <span className="w-2 h-6 bg-cyan-500 rounded-full" />
                                Account Settings
                            </h3>
                            
                            {!isEditing ? (
                                <>
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group font-bold"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-all">
                                                <Edit2 size={18} />
                                            </div>
                                            Edit Profile
                                        </div>
                                    </button>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-between p-4 bg-red-500/5 hover:bg-red-500/10 rounded-2xl transition-all group font-bold text-red-500"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                                                <LogOut size={18} />
                                            </div>
                                            Sign Out
                                        </div>
                                    </button>
                                </>
                            ) : (
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block">Username</label>
                                        <input 
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block">New Password</label>
                                        <input 
                                            type="password"
                                            placeholder="Leave blank to keep current"
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-white"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button 
                                            type="submit"
                                            className="flex-1 bg-cyan-500 text-black font-black py-3 rounded-xl hover:bg-cyan-400 active:scale-95 transition-all"
                                        >
                                            Save Changes
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 bg-white/5 text-white font-black py-3 rounded-xl hover:bg-white/10 active:scale-95 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Activity */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-3xl font-black mb-8 tracking-tight flex items-center gap-4">
                                <span className="w-2 h-10 bg-blue-600 rounded-full" />
                                Recently Watched
                            </h2>
                            
                            {recentlyWatched.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {recentlyWatched.map((item) => (
                                        <div key={item.id} className="relative group overflow-hidden rounded-[2rem] bg-[#0b1020] border border-white/10 hover:border-cyan-500 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10">
                                            <div className="aspect-video relative overflow-hidden">
                                                <img 
                                                    src={`https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`} 
                                                    alt={item.title || item.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                                                <button 
                                                    onClick={() => router.push(`/watch/${item.release_date ? 'movie' : 'tv'}/${item.id}`)}
                                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]"
                                                >
                                                    <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center text-black scale-50 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
                                                        <Play size={32} fill="black" />
                                                    </div>
                                                </button>
                                                
                                                {/* Progress Bar */}
                                                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                                                    <div className="h-full bg-cyan-500 shadow-lg shadow-cyan-500/50" style={{ width: '65%' }} />
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h4 className="font-black text-lg mb-2 line-clamp-1">{item.title || item.name}</h4>
                                                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock size={12} />
                                                        {new Date(item.progress.lastWatched).toLocaleDateString()}
                                                    </div>
                                                    <div className="bg-white/5 px-2 py-0.5 rounded-md border border-white/5 capitalize">
                                                        {item.progress.mediaType}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] py-20 text-center">
                                    <Play size={48} className="text-gray-600 mx-auto mb-6" />
                                    <p className="text-gray-400 font-bold">No watch history yet. Start watching something!</p>
                                    <button 
                                        onClick={() => router.push('/homePage')}
                                        className="mt-6 bg-cyan-500 text-black px-8 py-3 rounded-xl font-black hover:bg-cyan-400 transition-all"
                                    >
                                        Explore Now
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
