import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {toogleSubscription, getUserChannelSubscribers, getSubscribedChannels} from "../controllers/subscription.controller";


const router = Router()

router.route("/subscribe/:channelId").post(verifyJWT, toogleSubscription)
router.route("/subscribers/:channelId").get(getUserChannelSubscribers)
router.route("/subscribed-channels").get(verifyJWT, getSubscribedChannels)


export default router