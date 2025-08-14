'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  // A simple handler to guide new users to the sign-up page
  const handleGetStarted = () => {
    router.push('/admin/sign-up');
  };

  return (
    // Main container with dark background and centered content
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      
      {/* Navbar Section */}
      <nav className="w-full max-w-5xl mx-auto flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold text-yellow-400">RePoll</h1>
        <div>
          <Link href="/admin/sign-in" className="bg-yellow-400 text-slate-900 font-semibold px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors mr-4">
    Admin Sign In
          </Link>

          
        </div>
      </nav>

      {/* Main Content Section */}
      <main className="flex flex-col items-center justify-center text-center flex-grow">
        <h2 className="text-5xl md:text-7xl font-extrabold mb-4">
          Create <span className="text-yellow-400">Live Polls</span>, Instantly.
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl">
          Engage your audience with real-time anonymous polls. Perfect for classrooms, live events, and streams.
        </p>
        
        
        <button
          onClick={handleGetStarted}
          className="px-8 py-4 font-bold text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-md hover:opacity-90 transition-opacity text-lg"
        >
          Get Started for Free
        </button>
      </main>

      
    </div>
  );
}