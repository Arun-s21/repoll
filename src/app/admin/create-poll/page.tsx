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
            const response = axios.post('/api/create-poll',{
                question,
                options,
                durationInMinutes
            });

            const pollId = (await response).data._id;

            alert('Poll created successfully, Now redirecting...');
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
            <div>
                <h1>Create new poll</h1>
                <form onSubmit={onSubmit}>
                    <div>
                        <label htmlFor='question'> Poll Question:</label>
                        <br/>
                        <input id='question' type='text' value={question} onChange={(e)=>{setQuestion(e.target.value)}} />

                    </div>
               <div>
          <label>Options:</label>
          {options.map((option, index) => (             //for each option in the options array, we create a different div element with key=index of that element
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
              />
              {options.length > 2 && (                  //for removing we need the index of the element whichn we already have from the options.map
                <button type="button" onClick={() => removeOptions(index)} style={{ marginLeft: '0.5rem' }}>            
                  Remove
                </button>
              )}
            </div>
          ))}
          

          <button type='button' onClick={addOptions}>Add Option</button>
            </div>

          <div>
          <label htmlFor='duration'>Duration (in minutes):</label>
          <br/>

        
          <input type='number' id='duration' value={durationInMinutes} onChange={(e)=>setDurationInMinutes(Number(e.target.value))} required />


          </div>

          <button type='submit' disabled={isSubmitting}>{isSubmitting?'Creating...':'Create Poll'}</button>



        </form>



        </div>
        );


    }







