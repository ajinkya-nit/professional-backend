import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleCommentLike, toggleVideoLike, toggleTweetLike, getLikedVideos } from "../controllers/like.controller.js";

const router = Router()

router.route("/toggle-comment-like/:commentId").post(verifyJWT, toggleCommentLike)
router.route("/toggle-video-like/:videoId").post(verifyJWT, toggleVideoLike)
router.route("/toggle-tweet-like/:tweetId").post(verifyJWT, toggleTweetLike)
router.route("/liked-videos").get(verifyJWT, getLikedVideos)

export default router