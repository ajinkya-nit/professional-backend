import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

    const videoAggregate = Video.aggregate([
        {
            $match: {
                $or: [
                    { title: { $regex: query || "", $options: "i" } },
                    { description: { $regex: query || "", $options: "i" } }
                ]
            }
        },
        {
            $match: userId ? { owner: new mongoose.Types.ObjectId(userId) } : {}
        },
        {
            $match: { isPublished: true }
        },
        {
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    { $project: { username: 1, avatar: 1 } }
                ]
            }
        },
        { $unwind: "$owner" }
    ]);

    const result = await Video.aggregatePaginate(videoAggregate, {
        page: parseInt(page),
        limit: parseInt(limit)
    });

    return res.status(200).json(new ApiResponse(200, result, "Videos fetched"));
});


const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, isPublished} = req.body
    
    if(!title || !description || !req.file?.path){
        throw new ApiError(400, "Title, description and video file are required")
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const uploadedVideo = await uploadOnCloudinary(videoLocalPath);

    if(!uploadedVideo?.url){
        throw new ApiError(400, "Error while uploading video")
    }

    const thumbnailUrl = uploadedVideo?.thumbnails?.length ? uploadedVideo.thumbnails[0].url : ""

    const newVideo = new Video({
        videoFile: uploadedVideo.url,
        thumbnail: thumbnailUrl,
        title,
        description,
        duration: uploadedVideo.duration,
        owner: req.user?._id,
        isPublished = isPublished !== undefined ? isPublished : true
    })

    await newVideo.save()

    return res.status(201).json(new ApiResponse(201, newVideo, "Video published successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    (!isValidObjectId(videoId)) && throw new ApiError(400, "Invalid video ID")

    const video =  await Video.findById(videoId).populate("owner", "name email avatar")

    if(!video){
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    // 1. Validate the videoId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // 2. Ensure at least one field is being updated
    if (!(title || description || req.file?.path)) {
        throw new ApiError(400, "At least one field (title, description, or thumbnail) is required for update");
    }

    // 3. Find the video to check ownership
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // 4. Authorization: Only the owner can update the video
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You do not have permission to update this video");
    }

    // 5. Handle Thumbnail Update
    let thumbnail;
    if (req.file?.path) {
        const uploadedThumbnail = await uploadOnCloudinary(req.file.path);
        if (!uploadedThumbnail.url) {
            throw new ApiError(400, "Error while uploading new thumbnail");
        }
        thumbnail = uploadedThumbnail.url;
    }

    // 6. Perform the update in the database
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title: title || video.title,
                description: description || video.description,
                thumbnail: thumbnail || video.thumbnail
            }
        },
        { new: true } // Returns the updated document
    );

    // 7. Return the response
    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video details updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video ID")
    }

    const video =  await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    
    if(video.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You do not have permission to delete this video")
    }

    await Video.findByIdAndDelete(videoId)

    return res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video ID")
    }

    const video =  await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "Video not found")
    }
    if(video.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You do not have permission to update this video")
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res.status(200).json(new ApiResponse(200, video, `Video is now ${video.isPublished ? "published" : "unpublished"} successfully`))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}