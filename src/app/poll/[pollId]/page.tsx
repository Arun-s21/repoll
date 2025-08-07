'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


type OptionType = {

    _id:string;
    text:string;
    votes:number;

}

type PollType = {
    _id:string;
    question:string;
    options:OptionType[];           //array of type OptionType
    expiresAt:string;               //not of new Date type because when backend will send data it sends it in json format(simple text/string)
}

export default function PollPage(){
    const params = useParams<{pollId:string}>();               //get the params that has pollId as string
    const [poll,setPoll] = useState<PollType | null>(null);    // | is or operator for types
    const[isLoading,setIsLoading] = useState(true);
    const[error, setError] = useState<string | null>(null);     //using this state to better represent errors that occur while getting the code,we could've used alert instead too but that is ugly and not customizable 
    const[hasVoted,setHasVoted] = useState(false);


    




   

        const fetchPoll = async()=>{
            const {pollId} =params;

            if(!pollId) return;

            try{

                const repsonse = await axios.get(`/api/poll/${pollId}`);
                setPoll(repsonse.data.poll);
            }
            catch(error:any){
                console.error('Error fetching poll: ',error);
                setError('Failed to load poll.');
            }
            finally{
                setIsLoading(false);
            }
        };
    




    const handleVote=async(optionId:string)=>{
        try{

            if (!poll) {
      alert('Poll data is not loaded yet. Please wait a moment.');
      return; 
    }


            await axios.post('/api/vote',{
                pollId:poll?._id,
                optionId:optionId

            });
            setHasVoted(true);
            
            alert('Thank you for your vote');
            await fetchPoll();

        }
        catch (err: any) {
      console.error('Error casting vote:', err);
      alert('Failed to cast vote.');
    }


    }



    useEffect(() => {
    if (params.pollId) {
      fetchPoll();
    }
  }, [params.pollId]);

  if (isLoading) {
    return <div>Loading poll...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!poll) {
    return <div>Poll not found.</div>;
  }

      return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center text-yellow-400 mb-6">{poll.question}</h1>
        <div className="space-y-4">
          {hasVoted ? (
            // 2. If the user has voted, show the chart
            <div>
              <p className="text-center text-gray-300 mb-4">Thank you for voting! Here are the results:</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={poll.options} layout="vertical">
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis type="category" dataKey="text" width={100} stroke="#94a3b8" />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}}/>
                  <Bar dataKey="votes" fill="#facc15" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            // 3. Otherwise, show the voting buttons
            poll.options.map((option) => 
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
        <p className="text-center text-sm text-gray-500 pt-4">
          Poll expires at: {new Date(poll.expiresAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}








