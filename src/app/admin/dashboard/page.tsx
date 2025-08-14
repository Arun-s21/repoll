'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

type PollType ={
    _id:string;
    question:string;
    createdAt:string;
};

export default function AdminPageDashboard(){

    const [polls, setPolls] = useState<PollType[]>([]);
    const[isLoading,setIsLoading] = useState(true);

    useEffect(()=>{
        const fetchPolls = async()=>{
            try{
                const response = await axios.get('/api/admin/polls');
                setPolls(response.data.polls);
            }
            catch (error) {
        console.error('Error fetching polls:', error);
        alert('Could not fetch your polls.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolls();

    },[]);
if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Link href="/admin/create-poll" className="bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
              Create New Poll
            </Link>
            
          </div>
        </header>

        <main>
          <h2 className="text-2xl font-semibold mb-4 text-gray-300">Your Polls</h2>
          {polls.length > 0 ? (
            <div className="space-y-4">
              {polls.map((poll) => (
                <div key={poll._id} className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg flex justify-between items-center backdrop-blur-sm">
                  <div>
                    <p className="text-lg font-semibold text-gray-200">{poll.question}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Created: {new Date(poll.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/poll/${poll._id}`} className="text-yellow-400 hover:underline text-sm" target="_blank">
                      View Public Page
                    </Link>
                    {/* We can add a link to the admin results page here later */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-800/50 border border-slate-700 rounded-lg backdrop-blur-sm">
              <p className="text-lg text-gray-400">You haven't created any polls yet.</p>
              <Link href="/admin/create-poll" className="text-yellow-400 hover:underline mt-4 inline-block font-semibold">
                Create your first one!
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}