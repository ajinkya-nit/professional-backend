import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { getVideoById, updateVideo, deleteVideo, togglePublishStatus, getAllVideos, publishAVideo } from "../controllers/video.controller.js";

const router = Router()

router.route('/get-videos').get(getAllVideos);
router.route('/publish').post(verifyJWT,upload.fields([
    {
        name: 'videoFile', maxCount: 1
    },
    {
        name: 'thumbnail',
        maxCount: 1
    }
]), publishAVideo);
router.route('/:videoId').get(verifyJWT, getVideoById);
router.route('/:videoId').put(verifyJWT, upload.single('thumbnail'), updateVideo);
router.route('/:videoId').delete(verifyJWT, deleteVideo);
router.route('/:videoId/toggle-publish').patch(verifyJWT, togglePublishStatus);


export default router