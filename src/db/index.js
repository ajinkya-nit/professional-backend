import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        //*the connectionInstance will hold the response after connecting the database
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)

    } catch (error) {
        console.log("MONGODB connection error", error);
        process.exit(1) //*their are many methods we will learn this in node js currently we will use the 1
    }
    
}


export default connectDB