'use client';

import { use, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

 return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-yellow-400">
            Create rePoll Account
          </h1>
          <p className="mt-2 text-gray-400">
            Sign up to start creating polls
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 bg-slate-700 border border-slate-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 bg-slate-700 border border-slate-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 animate-pulse cursor-pointer font-semibold text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <div className="text-center text-gray-400">
          <p>
            Already have an account?{' '}
            <Link href="/admin/sign-in" className="text-yellow-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}