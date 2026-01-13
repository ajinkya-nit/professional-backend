import  asyncHandler  from "../utils/asyncHandler.js"
import ApiError from '../utils/ApiError.js'
import { User } from "../models/user.model.js"
import uploadOncloudinary from "../utils/cloudinary.js" 
import ApiResponse from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    const {fullName, email, username, password}= req.body
    console.log("email", email)

    if(
        [fullName, email, username, password].some(check => check?.trim() === "")
    )
    {
        throw new ApiError(400, "All fields are required.") 
    }

    //Checking if the user exists...

    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists!")
    }

    //handling images!
    //files methood is give by multer
    const avatarLocalPath = req.files?.avatar[0]?.path //In this we requested the file from multer
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required!")
    }
    
    //Upload them to cloudinary

    const avatar = await uploadOncloudinary(avatarLocalPath)
    const coverImage = await uploadOncloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required!")
    }

    //Making entry in db

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" //this excludes these thing
    )  // _id is automatically added by mongoDB this has unique id give by it
    
    if(!createdUser){
        throw new ApiError(500, "Something went wrong!")
    }

    res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )
})

export default registerUser