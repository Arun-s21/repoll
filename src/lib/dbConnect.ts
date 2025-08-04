
import mongoose from 'mongoose';


type connectionObject ={        //defining for typesafety
    isConnected?:number         //optional
};

const connection:connectionObject={};       //defining a connection, initially empty meaning user hasnt yet conneceted to the db

async function dbConnect(){
    if(connection.isConnected){         //here we are checking if our connection object has a isConnected property and if it is true then we are already connected to the db so no need to connect again
        console.log('Already connected to the db');
        return ;
    }
    //if not connected i.e connection.isConnected doesnt exist or is undefined move forward and connect to the db

    try{
        const db = await mongoose.connect(process.env.DATABASE_URL || '');
        connection.isConnected = db.connections[0].readyState;          //now we update our connections object 
        //db.connections[0] means the first connection in the db array that just connected to our db
        //.readyState returns its state like connected->1 connecting->2 disconnected->3 
        //so now the connections.isConnected:1 
        //next time if server tries to again connect to the db our server will first check if connections.isConnected:1
        //it wont connect again and just return from here

        console.log('db connected successfully');


    }
    catch(error){
        console.error('Database connection failed:', error);
        process.exit(1);
    }
    
}
export default dbConnect;

