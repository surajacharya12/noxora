"use client";

import React, { useState, useEffect } from "react";
import { Search, User, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for that "Netflix-style" transparent-to-solid transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-12 py-4 flex items-center justify-between ${
        isScrolled
          ? "bg-[#020617]/90 backdrop-blur-md border-b border-white/10"
          : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      {/* LEFT SIDE: Logo & Desktop Links */}
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600"
        >
          <Image src="/assets/logo.png" alt="Nexora" width={100} height={100} />
        </Link>

        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link
            href="/"
            className="text-white hover:text-cyan-400 transition-colors"
          >
            Home
          </Link>
          <Link href="/movies" className="hover:text-white transition-colors">
            Movies
          </Link>
          <Link href="/series" className="hover:text-white transition-colors">
            Series
          </Link>
          <Link href="/trending" className="hover:text-white transition-colors">
            Trending
          </Link>
          <Link href="/mylist" className="hover:text-white transition-colors">
            My List
          </Link>
        </div>
      </div>

      {/* RIGHT SIDE: Search & Profile */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Search Bar - Visible on both Mobile and Desktop */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-white/10 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50 w-32 sm:w-48 lg:w-64 transition-all"
          />
        </div>

        {/* Profile Button */}
        <button className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 px-3 py-1.5 rounded-lg transition-all">
          <User className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
            Profile
          </span>
        </button>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU (Links only) */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#020617] border-b border-white/10 py-6 flex flex-col items-center gap-6 lg:hidden animate-in fade-in slide-in-from-top-4">
          <Link
            href="/"
            className="text-lg font-semibold"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/movies"
            className="text-lg font-semibold"
            onClick={() => setMobileMenuOpen(false)}
          >
            Movies
          </Link>
          <Link
            href="/series"
            className="text-lg font-semibold"
            onClick={() => setMobileMenuOpen(false)}
          >
            Series
          </Link>
          <Link
            href="/trending"
            className="text-lg font-semibold"
            onClick={() => setMobileMenuOpen(false)}
          >
            Trending
          </Link>
          <Link
            href="/mylist"
            className="text-lg font-semibold"
            onClick={() => setMobileMenuOpen(false)}
          >
            My List
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
