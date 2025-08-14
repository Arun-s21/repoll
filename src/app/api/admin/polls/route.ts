import dbConnect from '@/lib/dbConnect';
import PollModel from '@/models/poll';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(request:NextRequest){
    await dbConnect();

    try{

        const token = request.cookies.get('token')?.value;

        if(!token){
            return NextResponse.json({message:'Unauthorized'},{status:401});
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const {payload} = await jwtVerify(token,secret);

        const adminId = payload.id as string;

        const polls = await PollModel.find({adminId:adminId}).sort({createdAt:-1});

        return NextResponse.json({success:true, polls},{status:200});

      } catch (error) {
    return NextResponse.json({ message: 'Invalid token or error fetching polls' }, { status: 500 });
  }
}