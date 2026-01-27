import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const likedAlready = await Like.findOne({
        user: req.user?._id,
        video: videoId
    })

    if (likedAlready) {
        await Like.deleteOne({
            _id: likedAlready._id
        })
        return res.status(200)
            .json(new ApiResponse(200, null, "Video unliked successfully"))
    }

    const newLike = await Like.create({
        user: req.user?._id,
        video: videoId
    })

    return res.status(201)
        .json(new ApiResponse(201, newLike, "Video liked successfully"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const likedAlready = await Like.findOne({
        user: req.user?._id,
        comment: commentId
    })

    if (likedAlready) {
        await Like.deleteOne({
            _id: likedAlready._id
        })
        return res.status(200)
            .json(new ApiResponse(200, null, "Comment unliked successfully"))
    }

    const newLike = await Like.create({
        user: req.user?._id,
        comment: commentId
    })

    return res.status(201)
        .json(new ApiResponse(201, newLike, "Comment liked successfully"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id")
    }

    const likedAlready = await Like.findOne({
        user: req.user?._id,
        comment: commentId

    })

    if (likedAlready) {
        await Like.deleteOne({
            _id: likedAlready._id
        })
        return res.status(200)
            .json(new ApiResponse(200, null, "Tweet unliked successfully"))
    }

    const newLike = await Like.create({
        user: req.user?._id,
        tweet: tweetId
    })

    return res.status(201)
        .json(new ApiResponse(201, newLike, "Tweet liked successfully"))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetail",
                pipeline: [
                    {
                        // Nested lookup to get the video owner's info
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner"
                        }
                    },
                    {
                        $addFields: {
                            owner: { $first: "$owner" }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                videoDetail: { $first: "$videoDetail" }
            }
        },
        {
            $project: {
                _id: 1,
                videoDetail: {
                    _id: 1,
                    videoFile: 1,
                    thumbnail: 1,
                    title: 1,
                    description: 1,
                    views: 1,
                    owner: {
                        username: 1,
                        fullName: 1,
                        avatar: 1
                    }
                }
            }
        }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}