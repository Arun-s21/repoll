'use client';

import { useState } from "react";
import axios from 'axios';
import { useRouter} from "next/navigation";

export default function CreatePollPage(){

    const router = useRouter();
    const [question,setQuestion] = useState('');
    const [options,setOptions] = useState([' ',' ']);
    const [durationInMinutes,setDurationInMinutes] = useState(60);
    const [isSubmitting,setIsSubmitting] = useState(false);


    const handleOptionChange = (index:number, changeInOption:string)=>{             //const functions are defined due to consistency and because const functions are not hoisted
                                                                                    //meaning const functions are never called automatically by js on top of the call stack unlike traditional functions which can lead to unexpected results
                                                        //index->array index where the modification occurs or the user is currently typing
                                                        //changeInOptions-> user typed burger and then adds an 's' so changInOption->Burgers index->index of the original burger array element
        const newOptions = [...options];                //this function works while user is still writing the options
        newOptions[index] = changeInOption;             //as user writes onChange(e)=>{setOptions(e.target.value)} is called
        setOptions(newOptions);                         // newOptions array is created with the updated option and the option at that specific index is changed and then our state variable is updated
    }

    const addOptions = ()=>{
        setOptions([...options,'']);            //adding a new blank space in the options array for the user to edit
                                                //react will render a new blank space at the end of options box
                                                //as the user will type into it handleOptionChange will come into effect 

    }

    const removeOptions = (index:number)=>{         //we pass the index that we want to remove from the options
    const newOptions = options.filter((_,i)=> i!=index);        //filter and the condition is i==index then skip that element
    setOptions(newOptions);                 //set options to the new filtered array
    

    }   

    const onSubmit = async(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        setIsSubmitting(true);
        try{
            const response = await axios.post('/api/create-poll',{
                question,
                options,
                durationInMinutes
            });

            const pollId = response.data.poll._id;

            alert(`Poll created successfully at ${pollId}, Now redirecting...`);
            router.push(`/admin/poll/${pollId}`);

        }

        catch(error){
            console.error('Error occurred while creating poll:',error);
            alert('Some unexpected error occurred while creating poll. \nPlease try again');

        }

        finally{
            setIsSubmitting(false);
        }
    }


        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
                <h1 className="text-4xl font-bold text-center text-yellow-400">Create new poll</h1>
                <form onSubmit={onSubmit}>
                    <div>
                        <label htmlFor='question'> Poll Question:</label>
                        <br/>
                        <input className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500" id='question' type='text' value={question} onChange={(e)=>{setQuestion(e.target.value)}} />

                    </div>
               <div>
          <label>Options:</label>
          {options.map((option, index) => (             //for each option in the options array, we create a different div element with key=index of that element
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input className="flex-grow p-2 bg-slate-700 border border-slate-600 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
              />
              {options.length > 2 && (                  //for removing we need the index of the element whichn we already have from the options.map
                <button className="ml-2 bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"

                 type="button" onClick={() => removeOptions(index)} style={{ marginLeft: '0.5rem' }}>            
                  Remove
                </button>
              )}
            </div>
          ))}
          

          <button className="mt-2 text-yellow-400 font-semibold hover:text-yellow-500" type='button' onClick={addOptions}>Add Option</button>
            </div>

          <div>
          <label htmlFor='duration'>Duration (in minutes):</label>
          <br/>

        
          <input className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"

 type='number' id='duration' value={durationInMinutes} onChange={(e)=>setDurationInMinutes(Number(e.target.value))} required />


          </div>

          <button className="w-full py-3 mt-4 font-semibold text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-md hover:opacity-90 transition-opacity" type='submit' disabled={isSubmitting}>{isSubmitting?'Creating...':'Create Poll'}</button>



        </form>
        </div>



        </div>
        );


    }







