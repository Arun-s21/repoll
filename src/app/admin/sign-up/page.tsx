'use client';

import { use, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminSignUpPage(){

const router = useRouter();

const [email,setEmail] = useState('');
const [password,setPassword] = useState('');
const [isSubmitting,setIsSubmitting] = useState(false);

    const onSubmit = async(event:React.FormEvent<HTMLFormElement>)=>{

        event.preventDefault();
        setIsSubmitting(true);
        try{

            await axios.post('/api/sign-up',{
                email,
                password
            });

            alert('Admin account created successfully! You can now log in');
            router.push('/admin/sign-in');


        }
        catch(error:any){
            console.error('Error creating admin: ',error);
            alert(error.response?.data?.message ||'Unexpected error occurred while creating your account');
        }

        finally{
            setIsSubmitting(false);
        }


    };


    return(

        <div>
            <h1>Create a new rePoll Admin account</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor='email'>Email:</label>
                    <br/>
                    <input id='email' type='email' value={email} onChange={(e)=>{setEmail(e.target.value)}} required />

                </div>

                <div>
                    <label htmlFor='password'>Password:</label>
                    <br/>
                    <input id='password' type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}} required />

                </div>

                <button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Creating...':'Sign-Up'}</button>


            </form>




        </div>

    );


}
