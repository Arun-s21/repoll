'use client';

import { useEffect, useState,useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AxiosError } from 'axios';
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

export default function PollPage() {
  const params = useParams<{ pollId: string }>();
  const [poll, setPoll] = useState<PollType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const fetchPoll = useCallback(async () => {
    const { pollId } = params;
    if (!pollId) return;
    try {
      const response = await axios.get(`/api/poll/${pollId}`);
      setPoll(response.data.poll);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'Failed to load poll.');
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  const handleVote = async (optionId: string) => {
    if (!poll) return;
    try {
      await axios.post('/api/vote', {
        pollId: poll._id,
        optionId: optionId,
      });
      // After voting, we just set hasVoted to true. We don't need to fetch again.
      setHasVoted(true);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'Failed to cast vote');
    }
  };

  useEffect(() => {
    if (params.pollId) {
      fetchPoll();
    }
  }, [params.pollId,fetchPoll]);

  useEffect(() => {
    if (poll) {
      const checkExpiry = () => {
        const now = new Date();
        const expiryDate = new Date(poll.expiresAt);
        
       
        if (now > expiryDate && !isExpired) {
          setIsExpired(true);
          // When it expires, fetch the final results one last time
          fetchPoll(); 
          if (intervalId) clearInterval(intervalId); // Stop the timer
        }
      };

      const intervalId = setInterval(checkExpiry, 1000); // Check every second

      // Run the check once immediately when the component loads
      checkExpiry();

      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [poll, isExpired, fetchPoll]); // Added isExpired and fetchPoll to the dependency array


  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,1)_70%)] flex justify-center items-center min-h-screen bg-slate-900">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,1)_70%)] flex justify-center items-center min-h-screen bg-slate-900 text-white p-4 text-center">
        <div>
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!poll) {
    return <div>Poll not found.</div>;
  }

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,1)_70%)] flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center text-yellow-400 mb-6">{poll.question}</h1>
        <div className="space-y-4">
          {/* This is the main conditional rendering logic */}
          {isExpired ? (
            // Phase 3: Poll has ended, show final results
            <div>
              <p className="text-center text-red-500 font-semibold mb-4">This poll has ended. Final Results:</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={poll.options} layout="vertical">
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis type="category" dataKey="text" width={100} stroke="#94a3b8" />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}}/>
                  <Bar dataKey="votes" fill="#facc15" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : hasVoted ? (
            // Phase 2: User has voted, show "thank you" message
            <div className="text-center py-10">
              <p className="text-2xl font-semibold text-lime-400">Thank you for your vote!</p>
              <p className="text-gray-400 mt-2">Results will be shown once the poll ends.</p>
            </div>
          ) : (
            // Phase 1: Poll is active, show voting buttons
            poll.options.map((option) => (
              <button
                key={option._id}
                onClick={() => handleVote(option._id)}
                className="w-full p-4 font-semibold text-white bg-slate-700 rounded-md hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-300"
              >
                {option.text}
              </button>
            ))
          )}
        </div>
        {!isExpired && (
          <p className="text-center text-sm text-gray-500 pt-4">
            Poll expires at: {new Date(poll.expiresAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}