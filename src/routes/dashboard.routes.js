import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";

const router = Router()

router.route("/channel/:channelId/stats").get(verifyJWT, getChannelStats);
router.route("/channel/:channelId/videos").get(verifyJWT, getChannelVideos);


export default router