'use client'
import { useRouter } from "next/navigation";
export default function Home() {

  const router = useRouter();
  const onSubmit = ()=>{
    alert('Redirecting you to the sign-up page...Please wait');
    router.push('/admin/sign-up');

  }

  return (
    <div>
   <h1>This is the landing page for rePoll</h1>
   <button onClick={onSubmit}>sign-up</button>
   
   </div>
  );
}
