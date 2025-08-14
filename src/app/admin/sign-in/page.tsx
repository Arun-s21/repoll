'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AxiosError } from 'axios';
export default function AdminSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('/api/sign-in', {
        email,
        password,
      });

       alert('Login successful! About to redirect...');

      router.replace('/admin/dashboard');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error('Error during admin sign-in:', error);
      alert(error.response?.data?.message || 'Failed to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,1)_70%)] flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-yellow-400">
            RePoll Sign-In
          </h1>
          <p className="mt-2 text-gray-400">
            Welcome back. Please sign in to continue.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 bg-slate-700 border border-slate-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 bg-slate-700 border border-slate-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 animate-pulse cursor-pointer font-semibold text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="text-center text-gray-400">
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/admin/sign-up" className="text-yellow-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}