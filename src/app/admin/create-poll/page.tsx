'use client';

import { useState } from "react";
import axios from 'axios';
import { useRouter} from "next/navigation";
import Link from "next/link";

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

    const addOption = ()=>{
        setOptions([...options,'']);            //adding a new blank space in the options array for the user to edit
                                                //react will render a new blank space at the end of options box
                                                //as the user will type into it handleOptionChange will come into effect 

    }

    const removeOption = (index:number)=>{         //we pass the index that we want to remove from the options
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,1)_70%)] relative flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
            <Link href="/admin/dashboard" className="absolute top-6 left-6 text-yellow-400 hover:underline text-sm">
                &larr; Back to Dashboard
            </Link>
            <div className="w-full max-w-2xl p-8 space-y-8 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg backdrop-blur-sm">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-yellow-400">Create New Poll</h1>
                </div>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label htmlFor='question' className="block text-sm font-semibold text-gray-300">Poll Question:</label>
                        <input
                            id='question'
                            type='text'
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full mt-1 p-3 bg-slate-700 border border-slate-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-300">Options:</label>
                        {options.map((option, index) => (
                            <div key={index} className="flex items-center mt-2">
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                    className="flex-grow p-2 bg-slate-700 border border-slate-600 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                                    required
                                />
                                {options.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => removeOption(index)}
                                        className="ml-2 bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type='button'
                            onClick={addOption}
                            className="mt-2 text-yellow-400 font-semibold hover:text-yellow-500"
                        >
                            + Add Option
                        </button>
                    </div>
                    <div>
                        <label htmlFor='duration' className="block text-sm font-semibold text-gray-300">Duration (in minutes):</label>
                        <input
                            type='number'
                            id='duration'
                            value={durationInMinutes}
                            onChange={(e) => setDurationInMinutes(Number(e.target.value))}
                            className="w-full mt-1 p-3 bg-slate-700 border border-slate-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            required
                            min="1"
                        />
                    </div>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className="w-full py-3 mt-4 animate-pulse cursor-pointer font-semibold text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Poll'}
                    </button>
                </form>
            </div>
        </div>
    );
}