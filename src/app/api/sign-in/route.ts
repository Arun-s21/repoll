import dbConnect from '@/lib/dbConnect';
import AdminModel from '@/models/admin';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(request:Request){        //we use POST here but we are not saving anything to the db still we use post instead of get 
                                                    //this is because in GET request the enetered information by the user is shown in the URL which can be a security vulnerability
    await dbConnect();

    try{

        const {email , password} = await request.json();

        const admin = await AdminModel.findOne({email});

        if(!admin){
            return Response.json({
                success:false,message:'Invalid credentials'
            },
        {status:401});
        }

        const isPasswordCorrect = await bcrypt.compare(password,admin.password);

        if(!isPasswordCorrect){
            return Response.json({
                success:false,message:'Invalid password'
            },
        {status:401});

        }

        //both password and email are correct so now we make a JWT for the user

        const tokenPayload  = {
            id:admin._id.toString(),
            email:admin.email
        };

        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const token = await new SignJWT(tokenPayload).setProtectedHeader({alg:'HS256'}).setExpirationTime('1d').sign(secret);

        const response = Response.json({
            success:true,message:'Login Successful'

        },{
            status:200
        });

         response.headers.set(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; Max-Age=86400`
    );

        return response;





    }

catch (error) {
    console.error('Error during admin sign-in:', error);
    return Response.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}