import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { healthcheck } from "../controllers/healthcheck.controller";

const router = Router()

router.route('/health-check').get(verifyJWT, healthcheck)

export default router