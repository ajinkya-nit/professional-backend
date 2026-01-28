import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getVideoById, updateVideo, deleteVideo, togglePublishStatus, getAllVideos, publishAVideo } from "../controllers/video.controller";

const router = Router()

router.route('/:videoId').get(verifyJWT, getVideoById);
router.route('/:videoId').put(verifyJWT, updateVideo);
router.route('/:videoId').delete(verifyJWT, deleteVideo);
router.route('/:videoId/toggle-publish').patch(verifyJWT, togglePublishStatus);
router.route('/get-videos').get(getAllVideos);
router.route('/publish').post(verifyJWT, publishAVideo);


export default router