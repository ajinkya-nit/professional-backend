import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import path from 'path'


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

// Upload a local file to Cloudinary and remove the local temp file safely.
const safeUnlink = (filePath) => {
    try {
        if (!filePath) return
        const resolved = path.resolve(filePath)
        if (fs.existsSync(resolved)) {
            fs.unlinkSync(resolved)
        } else {
            console.warn('safeUnlink: file not found, skipping unlink:', resolved)
        }
    } catch (err) {
        console.error('safeUnlink: failed to remove file', filePath, err)
    }
}

const uploadOncloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        console.log('uploadOncloudinary: uploading ->', localFilePath)
        const response = await cloudinary.uploader.upload(
            localFilePath,
            { resource_type: 'auto' }
        )
        console.log('File Upload Successful!!')
        console.log(response.url, 'File Public URL')
        safeUnlink(localFilePath)
        return response;
    } catch (error) {
        // Attempt to remove temp file if it exists, but do not throw further from cleanup
        safeUnlink(localFilePath)
        console.error('uploadOncloudinary error:', error)
        return null
    }
}

export default uploadOncloudinary