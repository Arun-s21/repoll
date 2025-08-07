'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from 'axios';
import { io } from "socket.io-client";

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
    const[isloading,setIsLoading] = useState(true);
    const[error, setError] = useState<string | null>(null);     //using this state to better represent errors that occur while getting the code,we could've used alert instead too but that is ugly and not customizable 
    const[hasVoted,setHasVoted] = useState(false);


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


        }
        catch (err: any) {
      console.error('Error casting vote:', err);
      alert('Failed to cast vote.');
    }


    }




    useEffect(()=>{

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

        fetchPoll();


    },[params.pollId]);

    useEffect(()=>{
                //connecting to socket.io server
                const socket = io();


                return()=>{
                    socket.disconnect();            //closing the connection to prevent memory leaks
                }


            },[]);


    if(isloading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>Error:{error}</div>
    }

    if(!poll){
        return <div>Poll not found</div>
    }


      return (
    <div>
      <h1>{poll.question}</h1>
      <div>
        {poll.options.map((option) => (
          <button
            key={option._id}
            onClick={() => handleVote(option._id)}
            style={{ display: 'block', margin: '0.5rem 0', padding: '0.5rem 1rem' }}
          >
            {option.text}
          </button>
        ))}
      </div>

      <p>This poll expires at: {new Date(poll.expiresAt).toLocaleString()}</p>
    </div>
  );
}


