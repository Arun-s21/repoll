import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';


export async function middleware(request: NextRequest){

    const token = request.cookies.get('token')?.value || '';

    

        if(!token){
            //if user doesnt have token and tries to access admin path, redirect to login page

            return NextResponse.redirect(new URL('/admin/sign-in',request.url));
        }
        //if user has the token we have to verify it
        try{
            const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

            await jwtVerify(token,secret);
            //if no error then let user proceed further
            return NextResponse.next();

        }
        catch{
            return NextResponse.redirect(new URL('/admin/sign-in',request.url));
        }

      

    }



export const config = {                     
    matcher:['/admin/create-poll','/admin/dashboard'],               //tells the middleware to run for /admin
};