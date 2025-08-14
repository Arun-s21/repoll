import dbConnect from '@/lib/dbConnect';
import PollModel from '@/models/Poll';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest){
    await dbConnect();
    
    try{
        const url = new URL(request.url);               //get url from the URL
                                                        // split(/) breaks the url into parts ['','api','poll','pollId']
        const pollId = url.pathname.split('/').pop();   //extracting pollId from the  pop gets us the very last part i.e pollId

        const poll = await PollModel.findById(pollId);



         if (!poll) {
      return NextResponse.json(
        { success: false, message: 'Poll not found' },
        { status: 404 }
      );
    }



    // const now = new Date();
    // if (now > poll.expiresAt) {
    //   return NextResponse.json(
    //     { success: false, message: 'This poll has expired' },
    //     { status: 410 } // 410 more specific status for expired resources
    //   );
    // }


    

    return NextResponse.json(
      {
        success: true,
        poll: {
          _id:poll._id,
          question: poll.question,
          options: poll.options,
          expiresAt: poll.expiresAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching poll:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching poll' },
      { status: 500 }
    );


    }



}