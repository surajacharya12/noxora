import React from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const ContentSection = () => {
  const movies = [
    {
      id: 1,
      title: "Velocity Strike",
      desc: "A high-octane action thriller where an elite team...",
      img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=500",
    },
    {
      id: 2,
      title: "Underworld Kings",
      desc: "A powerful crime family battles for control of the city...",
      img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500",
    },
    {
      id: 3,
      title: "Titan Force",
      desc: "When Earth faces an alien invasion, a team of superheroes...",
      img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=500",
    },
  ];

  return (
    <section className="bg-[#020617] pb-20 px-4 md:px-12 -mt-20 relative z-20 mt-5">
      {/* 1. Glow Search Bar (from screenshot) */}
      <div className="max-w-3xl mx-auto mb-20">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur-lg opacity-75 group-focus-within:opacity-100 transition duration-1000"></div>
          <input
            type="text"
            placeholder="Search movies, series, documentaries..."
            className="relative w-full bg-[#0b1020]/80 border border-white/10 rounded-2xl py-5 px-8 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-xl transition-all"
          />
        </div>
      </div>

      {/* 2. Featured This Week Slider */}
      <div className="relative group/slider">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Featured This Week
          </h2>
          <div className="flex gap-2">
            <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/5">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/5">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Movie Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="group relative aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:scale-[1.02] cursor-pointer shadow-2xl"
            >
              {/* Background Image */}
              <img
                src={movie.img}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

              {/* "Featured" Badge */}
              <div className="absolute top-4 left-4 bg-orange-600 text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-lg">
                Featured
              </div>

              {/* Content Detail */}
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                  {movie.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4 group-hover:text-gray-200 transition-colors">
                  {movie.desc}
                </p>

                {/* Hover Action Buttons */}
                <div className="flex items-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-bold transition-all">
                    <Play className="w-4 h-4 fill-white" /> Watch Now
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold border border-white/10">
                    More Info
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Section Title for next row (Action & Adventure) */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-8">Action & Adventure</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="min-w-[200px] aspect-[2/3] bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
