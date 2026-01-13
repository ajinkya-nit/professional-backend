import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema = new Schema({
    username: {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true  //*ye searching fields ko optime kar deta hai
    },
    email: {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullName: {
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        index:true
    },
    avatar: {
        type: String, //we will use cloudinary url
        required: true,
    },
    coverImage: {
        type:String
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    }


}, { timestamps: true })


userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
     //* This will check and run this only when the user set,updates the password
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)