import React from 'react';
import { Play, CheckCircle2, Monitor, Smartphone, Cpu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const NexoraLanding = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-screen min-h-[800px] w-full overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://storage.googleapis.com/banani-generated-images/generated-images/1f5ceb4c-51ff-4800-b886-dc06efe3a783.jpg"
            alt="Cinematic Background"
            className="w-full h-full object-cover scale-105"
          />
          {/* Gradients to match the "Noir" look */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/60 via-[#020617]/40 to-[#020617]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-[#020617]/20" />
        </div>

        {/* Header / Navbar */}
        <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5 text-2xl font-black tracking-tighter">
            <Image src="/assets/logo.png" alt="Nexora" width={200} height={200} />
          </div>

         

          <div className="flex items-center gap-4">
            <Link href="/signin" className="text-sm font-bold hover:text-blue-400 transition-colors cursor-pointer">
              Sign In
            </Link>
            <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-600/20 cursor-pointer">
              Subscribe
            </Link>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100%-80px)] text-center px-4">
         

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Unlimited Stories.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">One Platform.</span>
          </h1>

          <p className="max-w-2xl text-lg text-gray-400 mb-10 leading-relaxed">
            Experience the next generation of entertainment. Stream ultra-high 
            definition movies, exclusive series, and mind-bending documentaries.
          </p>

          <Link href="/signup" className="group relative bg-orange-600 hover:bg-orange-500 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(234,88,12,0.4)] cursor-pointer">
            Start Watching Now →
          </Link>

          {/* Hero Stats */}
          <div className="mt-16 flex items-center gap-12 border-t border-white/10 pt-10">
            <div className="text-center">
              <div className="text-2xl font-bold">10,000+</div>
              <div className="text-xs uppercase tracking-widest text-gray-500 font-bold mt-1">Titles</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold">4K HDR</div>
              <div className="text-xs uppercase tracking-widest text-gray-500 font-bold mt-1">Quality</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold">Ad-Free</div>
              <div className="text-xs uppercase tracking-widest text-gray-500 font-bold mt-1">Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Next-Gen Viewing</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            We've engineered our platform from the ground up to deliver the most 
            immersive entertainment experience possible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Monitor className="w-6 h-6 text-blue-500" />}
            title="4K Ultra HD Streaming"
            desc="Immerse yourself in breathtaking detail with our vast library of native 4K HDR content."
          />
          <FeatureCard 
            icon={<Smartphone className="w-6 h-6 text-blue-500" />}
            title="Multi-Device Support"
            desc="Start on your TV, continue on your tablet, finish on your phone with seamless sync."
          />
          <FeatureCard 
            icon={<Cpu className="w-6 h-6 text-blue-500" />}
            title="Smart Recommendations"
            desc="Our AI engine learns what you love and curates personalized suggestions just for you."
          />
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

// Reusable Glass Card Component
const FeatureCard = ({ icon, title, desc }: FeatureCardProps) => (
  <div className="group p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/20 transition-all">
    <div className="mb-6">{icon}</div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default NexoraLanding;