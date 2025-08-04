import dbConnect from '@/lib/dbConnect';
import PollModel from '@/models/poll';

export async function POST(request:Request){

    await dbConnect();

    try{

        const{ question,options,durationInMinutes } = await request.json();
        //basic validation checks 
         if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return Response.json(
        { success: false, message: 'Invalid poll data provided' },
        { status: 400 }

      );

    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationInMinutes*60*1000);  //converts the minutes to seconds and adds that to 
    //the current time of the system so that poll expires after the designated minutes/seconds from the time poll is created

    const pollOptions = options.map((insideText:string)=>({     //user will enter options from a frontend state lets say options[]
    text:insideText,                                            // we're gonna store those options in an in memory array called options 
    votes:0                                                     //this map function converts that array of simple options to another array like
    }));                                                        //options[]=['yes','no','maybe']
                                                                //pollOptions[]=[{text:'yes',votes:0},{text:'no',votes:0},{text:maybe,votes:0}]
                                                                // then we'll save these pollOptions according to our options schema in the mongo database
                
                                                                
    
                                                                
    const newPoll = new PollModel({
        question,
        options:pollOptions,
        expiresAt
    });
    
    await newPoll.save();

    return Response.json({
        success: true,
        message: 'Poll created successfully',
        poll: newPoll,
      },
      { status: 201
    });


    }

    catch(error){
        console.error('Error creating poll:', error);
    return Response.json(
      { success: false, message: 'Error creating poll' },
      { status: 500 }
    );
  }



}