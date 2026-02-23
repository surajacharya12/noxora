import React from 'react';
import { Play, Plus, Info, Star } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-[90vh] w-full flex items-end pb-24 px-4 md:px-12 overflow-hidden">
      {/* 1. Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop" 
          alt="Velocity Strike Background"
          className="w-full h-full object-cover"
        />
        {/* Dark Overlays to match the screenshot's 'Noir' feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-transparent" />
      </div>

      {/* 2. Hero Content Area */}
      <div className="relative z-10 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 text-white">
          Velocity Strike
        </h1>

        {/* Metadata Row (Rating, Year, Genre) */}
        <div className="flex items-center gap-4 mb-6 text-sm font-semibold text-gray-300">
          <div className="flex items-center gap-1.5 bg-blue-600/20 border border-blue-400/30 px-2 py-0.5 rounded-md text-cyan-400">
            <Star className="w-3.5 h-3.5 fill-cyan-400" />
            <span>8.5</span>
          </div>
          <span>2026</span>
          <span className="w-1 h-1 rounded-full bg-gray-500" />
          <span>Action</span>
          <span className="w-1 h-1 rounded-full bg-gray-500" />
          <span>Sci-Fi</span>
        </div>

        {/* Synopsis */}
        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl">
          A high-octane action thriller where an elite team races against time to stop a global 
          threat. Explosive action, intense drama, and stunning visuals combine in this edge-of-your-seat cinematic experience.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Watch Now - White Button */}
          <button className="flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95">
            <Play className="w-5 h-5 fill-black" />
            Watch Now
          </button>

          {/* My List - Dark Button */}
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md px-8 py-3.5 rounded-xl font-bold transition-all active:scale-95">
            <Plus className="w-5 h-5" />
            My List
          </button>

          {/* Info - Circular/Square Icon Button */}
          <button className="p-4 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md rounded-xl transition-all active:scale-95">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* 3. Bottom Gradient Transition to Content */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020617] to-transparent z-0" />
    </div>
  );
};

export default Hero;