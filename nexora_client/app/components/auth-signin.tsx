"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Monitor, Cpu, Chrome, Apple, Loader2 } from 'lucide-react';
import { apiCall } from '../../utils/api';

const SignIn = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
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

    try {
      const response = await apiCall('/user/login', 'POST', formData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      router.push('/homePage');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:flex flex-col gap-10">
          <Link href="/" className="inline-block transform transition-hover hover:scale-105">
             <Image src="/assets/logo.png" alt="Nexora" width={180} height={60} priority />
          </Link>
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Welcome Back
            </div>
            
            <h1 className="text-6xl font-black tracking-tighter leading-none">
              Sign in to <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-orange-400">Nexora.</span>
            </h1>
            
            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
              Log in to your account to continue watching your favorite movies, series, and exclusive originals across all your devices.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Monitor className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Multi-device</h3>
                <p className="text-gray-500 text-sm italic">Seamless syncing</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Enterprise-grade</h3>
                <p className="text-gray-500 text-sm italic">Security & privacy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sign In Card */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/3 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
            {/* Subtle card glow */}
            <div className="absolute inset-0 bg-linear-to-tr from-blue-600/5 via-transparent to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Sign in to your account</h2>
              <p className="text-gray-400 text-sm">Enter your details to continue watching.</p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
                  <a href="#" className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-offset-0 focus:ring-0" 
                />
                <label htmlFor="remember" className="text-xs text-gray-400 font-medium cursor-pointer">Remember me for 30 days</label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-linear-to-r from-blue-600 to-orange-600 hover:from-blue-500 hover:to-orange-500 font-bold text-sm transition-all shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                {!loading && <span className="text-lg">→</span>}
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-gray-500 font-medium">
              Don't have an account? <Link href="/signup" className="text-white hover:text-blue-400 font-bold transition-colors">Sign up</Link>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              <span>Protected by 256-bit SSL</span>
              <div className="flex gap-4">
                <a href="#" className="hover:text-gray-400">Security</a>
                <a href="#" className="hover:text-gray-400">Cookie Settings</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
