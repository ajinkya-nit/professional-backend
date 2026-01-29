import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { healthcheck } from "../controllers/healthcheck.controller.js";

const router = Router()

router.route('/health-check').get(verifyJWT, healthcheck)

export default router