import React from 'react';
import MovieCard from './card';

const ContentGallery = () => {
  const sampleMovies = [
    { title: "Velocity Strike", rating: "8.5", year: "2026", img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400", desc: "A high-octane action thriller." },
    { title: "Quantum Horizon", rating: "9.1", year: "2026", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400", desc: "Space exploration at its finest." },
    // ... add more
  ];

  return (
    <div className="bg-[#020617] text-white p-8 space-y-16">

  
  <section>
        <h2 className="text-2xl font-bold mb-6">Action & Adventure</h2>
        <div className="flex gap-8 overflow-x-auto pb-8 no-scrollbar">
          {sampleMovies.map((m, i) => <MovieCard key={m.title} movie={m} variant="ranked" rank={i + 1} />)}
        </div>
      </section>
      {/* SECTION: Top 10 Movies */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Top 10 Movies Today</h2>
        <div className="flex gap-8 overflow-x-auto pb-8 no-scrollbar">
          {sampleMovies.map((m, i) => <MovieCard key={m.title} movie={m} variant="ranked" rank={i + 1} />)}
        </div>
      </section>

        <section>
        <h2 className="text-2xl font-bold mb-6">Top 10 Series Today</h2>
        <div className="flex gap-8 overflow-x-auto pb-8 no-scrollbar">
          {sampleMovies.map((m, i) => <MovieCard key={m.title} movie={m} variant="ranked" rank={i + 1} />)}
        </div>
      </section>

      {/* SECTION: Genre Row (Sci-Fi Masterpieces) */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Sci-Fi Masterpieces</h2>
        <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar">
          {sampleMovies.map(m => <MovieCard key={m.title} movie={m} variant="standard" />)}
        </div>
      </section>

    <section>
        <h2 className="text-2xl font-bold mb-6">Award-Winning Drama</h2>
        <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar">
          {sampleMovies.map(m => <MovieCard key={m.title} movie={m} variant="standard" />)}
        </div>
      </section>


    </div>
  );
};

export default ContentGallery;