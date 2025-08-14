'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

type OptionType = {
  _id: string;
  text: string;
  votes: number;
};

type PollType = {
  _id: string;
  question: string;
  options: OptionType[];
  expiresAt: string;
};

export default function AdminPollPage() {
  const params = useParams<{ pollId: string }>();
  const router = useRouter();
  const [poll, setPoll] = useState<PollType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoll = useCallback(async () => {
    const { pollId } = params;
    if (!pollId) return;
    try {
      const response = await axios.get(`/api/poll/${pollId}`);
      setPoll(response.data.poll);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load poll.');
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  // This useEffect fetches the initial poll data
  useEffect(() => {
    fetchPoll();
  }, [fetchPoll]);

  // This useEffect sets up a polling timer to get live updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Only fetch if the poll is not expired
      if (poll && new Date() < new Date(poll.expiresAt)) {
        fetchPoll();
      }
    }, 5000); // Refreshes every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [poll, fetchPoll]);


  const publicUrl = poll ? `${window.location.origin}/poll/${poll._id}` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    alert('Poll link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,1)_70%)] flex justify-center items-center min-h-screen bg-slate-900">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,1)_70%)] flex flex-col justify-center items-center min-h-screen bg-slate-900 text-white p-4 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="text-gray-300">{error || 'Poll not found.'}</p>
        <Link href="/admin/dashboard" className="mt-6 text-yellow-400 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isExpired = new Date() > new Date(poll.expiresAt);

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,1)_70%)] flex flex-col items-center min-h-screen bg-slate-900 text-white p-4 md:p-8">
       <div className="w-full max-w-4xl">
        <Link href="/admin/dashboard" className="text-yellow-400 hover:underline mb-4 inline-block">
          &larr; Back to Dashboard
        </Link>
        <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg backdrop-blur-sm">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-yellow-400 mb-2">{poll.question}</h1>
            <p className={`text-sm ${isExpired ? 'text-red-500' : 'text-gray-400'}`}>
              Status: {isExpired ? 'Ended' : 'Live'} &bull; Ends at: {new Date(poll.expiresAt).toLocaleString()}
            </p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Shareable Link
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={publicUrl}
                readOnly
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-l-md text-gray-200"
              />
              <button
                onClick={copyToClipboard}
                className="bg-yellow-400 text-slate-900 font-semibold px-4 py-2 rounded-r-md hover:bg-yellow-500 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">Live Results</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={poll.options} layout="vertical" margin={{ left: 50 }}>
                <XAxis type="number" stroke="#94a3b8" allowDecimals={false} />
                <YAxis type="category" dataKey="text" width={150} stroke="#94a3b8" />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}}/>
                <Bar dataKey="votes" fill="#facc15" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}