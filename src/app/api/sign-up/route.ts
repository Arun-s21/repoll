import dbConnect from "@/lib/dbConnect";
import AdminModel from "@/models/admin";
import bcrypt from "bcryptjs";

export async function POST(request:Request){
    await dbConnect();

    try{

        const {email, password} = await request.json();

        const existingUser = await AdminModel.findOne({email});

        if(existingUser){
            return Response.json({
                success:false,message:'Admin with this email already exists'
            },
        {
            status:400
        });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newAdmin = new AdminModel({
            email:email,
            password:hashedPassword
        });
        await newAdmin.save(); 




   return Response.json(
      { success: true, message: 'Admin account created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating admin:', error);
    return Response.json(
      { success: false, message: 'Error creating admin' },
      { status: 500 }
    );
  }
}