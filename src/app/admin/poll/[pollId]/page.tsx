'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from 'axios';

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


    },[params.pollId]);


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
      <ul>
        {poll.options.map((option) => (
          <li key={option._id}>
            {option.text}
          </li>
        ))}
      </ul>
      <p>This poll expires at: {new Date(poll.expiresAt).toLocaleString()}</p>
    </div>
  );
}


