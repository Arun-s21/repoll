import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';


export async function middleware(request: NextRequest){

    const path = request.nextUrl.pathname;

    const isAdminPath = path.startsWith('/admin');

    const token = request.cookies.get('token')?.value || '';

    if(isAdminPath){

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
        catch(_error){
            return NextResponse.redirect(new URL('/admin/sign-in',request.url));
        }

        //if path the user trying to access is not admin path let user proceed without any checks
        


    }
     return NextResponse.next();



}

export const config = {
    mathcer:['/admin:path*'],
};