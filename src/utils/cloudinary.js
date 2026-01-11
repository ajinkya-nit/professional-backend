import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

//Uploading the first asset

const uploadOncloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload
        (localFilePath,
            {
                resource_type: "auto"
            }
        )
        console.log("File Upload Successful!!")
        console.log(response.url, "File Public URL")
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) //removes the locally saved temp file as upload operation failed
        console.log(error)
    }
}

export default uploadOncloudinary