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
    if(!this.isModified("password")) return;
     //* This will check and run this only when the user set,updates the password
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema)