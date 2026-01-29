import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist } from "../controllers/playlist.controller.js";

const router = Router()

router.route("/create-playlist").post(verifyJWT, createPlaylist)
router.route("/user-playlists/:userId").get(getUserPlaylists)
router.route("/:playlistId").get(getPlaylistById)
router.route("/:playlistId/add-video/:videoId").post(verifyJWT, addVideoToPlaylist)
router.route("/:playlistId/remove-video/:videoId").post(verifyJWT, removeVideoFromPlaylist)
router.route("delete-playlist/:playlistId").delete(verifyJWT, deletePlaylist)
router.route("update-playlist/:playlistId").put(verifyJWT, updatePlaylist)


export default router