import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const subscriberId = req.user._id

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel ID")
    }

    if(channelId.toString() === subscriberId.toString()){
        throw new ApiError(400, "You cannot subscribe to your own channel")
    }

    const channel = await User.findById(channelId)
    if(!channel){
        throw new ApiError(404, "Channel not found")
    }
    const existingSubscription = await Subscription.aggregate([
        {
            $match: {
                channelId: new mongoose.Types.ObjectId(channelId),
                subscriberId: new mongoose.Types.ObjectId(subscriberId)
            }
        }
    ])

    if(existingSubscription.length > 0){
        await Subscription.deleteOne({
            channelId: channelId,
            subscriberId: subscriberId
        })
        return res.status(200).json(new ApiResponse(200, "Unsubscribed successfully"))
    }

    const newSubscription = new Subscription({
        channelId: channelId,
        subscriberId: subscriberId
    })
    await newSubscription.save()
    return res.status(200).json(new ApiResponse(200, "Subscribed successfully"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel ID")
    }

    const channel = await User.findById(channelId)
    if(!channel){
        throw new ApiError(404, "Channel not found")
    }

    const subscribers = await Subscription.aggregate([
        { $match: { channelId: new mongoose.Types.ObjectId(channelId) } },
        {
            $lookup: {
                from: "users",
                localField: "subscriberId",
                foreignField: "_id",
                as: "subscriberDetails"
            }
        },
        { $unwind: "$subscriberDetails" },
        {
            $project: {
                _id: 0,
                subscriberId: "$subscriberDetails._id",
                name: "$subscriberDetails.name",
                email: "$subscriberDetails.email",
                subscribedAt: "$createdAt"
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, "Subscribers fetched successfully", subscribers))

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "Invalid subscriber ID")
    }

    const subscriber = await User.findById(subscriberId)
    if(!subscriber){
        throw new ApiError(404, "Subscriber not found")
    }
    const subscribedChannels = await Subscription.aggregate([
        { $match: { subscriberId: new mongoose.Types.ObjectId(subscriberId) } },
        {
            $lookup: {
                from: "users",
                localField: "channelId",
                foreignField: "_id",
                as: "channelDetails"
            }
        },
        { $unwind: "$channelDetails" },
        { $project: {
                _id: 0,
                channelId: "$channelDetails._id",
                name: "$channelDetails.name",
                email: "$channelDetails.email",
                subscribedAt: "$createdAt"
            }
        }
    ])


    return res.status(200).json(new ApiResponse(200, "Subscribed channels fetched successfully", subscribedChannels))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}