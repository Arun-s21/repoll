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

    if(isLoading){
        return(
            <div>Loading your polls...</div>
        );
    }

    return(
        <div>
            <h1>Admin Dashboard</h1>
            <Link href='/admin/create-poll'>Create a new poll</Link>
            <hr/>
            <h2>Your Polls</h2>
            {polls.length >0?(
                <ul>
                    {polls.map((poll)=>(

                        <li key={poll._id}>
                        <p>{poll.question}</p>
                        </li>
                    )
                    
                    
                    )}
                </ul>


            ):(
                <p>You have not created any polls yet</p>

            )}


        </div>



    );


}
