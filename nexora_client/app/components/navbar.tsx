"use client";

import React, { useState, useEffect } from "react";
import { Search, User, Menu, X, Bell, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!(token && token !== "undefined" && token !== "null"));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue)}`);
      setIsSearchOpen(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearch?.(val);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-12 py-4 flex items-center justify-between ${
        isScrolled
          ? "bg-[#020617]/95 backdrop-blur-md border-b border-white/10"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      {/* LEFT SIDE: Logo & Desktop Links */}
      <div className="flex items-center gap-8">
        <Link
          href="/homePage"
          className="transition-transform active:scale-95"
        >
          <Image src="/assets/logo.png" alt="Nexora" width={100} height={40} className="object-contain" />
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-[13px] font-bold tracking-wide uppercase text-gray-400">
          <Link href="/homePage" className="text-white hover:text-cyan-400 transition-colors">Home</Link>
          <Link href="/movies" className="hover:text-white transition-colors">Movies</Link>
          <Link href="/series" className="hover:text-white transition-colors">Series</Link>
          <Link href="/trending" className="hover:text-white transition-colors">Trending</Link>
          <Link href="/request" className="hover:text-white transition-colors">Request</Link>
          {isAuth && <Link href="/mylist" className="hover:text-white transition-colors">My List</Link>}
        </div>
      </div>

      {/* RIGHT SIDE: Icons & Profile */}
      <div className="flex items-center gap-6">
        <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'w-48 md:w-64' : 'w-10'}`}>
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={handleSearchChange}
              className={`w-full bg-white/10 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 backdrop-blur-md transition-all ${
                isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            />
            <button 
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`absolute left-0 top-0 h-10 w-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors ${isSearchOpen ? 'text-cyan-400' : ''}`}
            >
              <Search size={20} />
            </button>
          </form>
        </div>

     
        {/* Profile or Auth Buttons */}
        {isAuth ? (
          <button 
            onClick={() => router.push('/profile')}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="hidden sm:inline text-xs font-bold tracking-wide text-gray-300 group-hover:text-white">
              Profile
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <Link 
              href="/signin"
              className="hidden sm:block text-xs font-bold text-gray-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/signup"
              className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
            >
              Sign Up
            </Link>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#020617] border-b border-white/10 py-8 flex flex-col items-center gap-6 lg:hidden animate-in fade-in slide-in-from-top-4 backdrop-blur-xl">
          <Link href="/homePage" className="text-lg font-bold" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/movies" className="text-lg font-bold" onClick={() => setMobileMenuOpen(false)}>Movies</Link>
          <Link href="/series" className="text-lg font-bold" onClick={() => setMobileMenuOpen(false)}>Series</Link>
          <Link href="/trending" className="text-lg font-bold" onClick={() => setMobileMenuOpen(false)}>Trending</Link>
          <Link href="/request" className="text-lg font-bold" onClick={() => setMobileMenuOpen(false)}>Request</Link>
          {isAuth && <Link href="/mylist" className="text-lg font-bold" onClick={() => setMobileMenuOpen(false)}>My List</Link>}
          {!isAuth && (
            <div className="flex flex-col items-center gap-4 mt-4">
              <Link href="/signin" className="text-lg font-bold" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link href="/signup" className="bg-cyan-500 text-black px-8 py-3 rounded-2xl font-bold" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
