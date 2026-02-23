"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, Monitor, Cpu, Loader2 } from 'lucide-react';
import { apiCall } from '../../utils/api';

const SignUp = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token !== "null") {
      router.push("/homePage");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await apiCall('/user/register', 'POST', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      router.push('/signin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:flex flex-col gap-10">
          <Link href="/" className="inline-block transform transition-hover hover:scale-105">
             <Image src="/assets/logo.png" alt="Nexora" width={180} height={60} priority />
          </Link>
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Premium Streaming
            </div>
            
            <h1 className="text-6xl font-black tracking-tighter leading-none">
              Create your <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-orange-400">Nexora account.</span>
            </h1>
            
            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
              Join a global community of film lovers. Unlock unlimited movies, series, and originals in one ultra-fast, ad-free platform.
            </p>
          </div>

          <div className="flex items-center gap-12 border-t border-white/10 pt-10">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <Monitor className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">30,000+</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Titles in our library</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <Cpu className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold italic">Enterprise-grade</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Security & privacy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sign Up Card */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/3 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
            {/* Subtle card glow */}
            <div className="absolute inset-0 bg-linear-to-tr from-orange-600/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Sign up to start watching</h2>
              <p className="text-gray-400 text-sm italic">No contracts. Cancel anytime during your free trial.</p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Full name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                  <input 
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your full name" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500/50 focus:bg-white/8 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500/50 focus:bg-white/8 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-10 text-sm focus:outline-none focus:border-orange-500/50 focus:bg-white/8 transition-all"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Confirm</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500/50 focus:bg-white/8 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-orange-500 focus:ring-offset-0 focus:ring-0" 
                  required
                />
                <label htmlFor="terms" className="text-[11px] text-gray-400 font-medium leading-relaxed">
                  I agree to the <a href="#" className="underline hover:text-white">Terms of Service</a> and <a href="#" className="underline hover:text-white">Privacy Policy</a>.
                </label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-linear-to-r from-blue-600 to-orange-600 hover:from-blue-500 hover:to-orange-500 font-bold text-sm transition-all shadow-lg shadow-orange-600/20 hover:scale-[1.02] active:scale-[0.98] mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register'}
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-gray-500 font-medium">
              Already have an account? <Link href="/signin" className="text-white hover:text-orange-400 font-bold transition-colors italic">Sign in instead.</Link>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              <span>Protected with 256-bit SSL</span>
              <div className="flex gap-4">
                <a href="#" className="hover:text-gray-400">Security</a>
                <a href="#" className="hover:text-gray-400">Cookie settings</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
