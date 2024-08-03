import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import { deleteNotification, getNotificattion } from "../controllers/notification.controller.js"

const router = express.Router()
router.get("/",protectRoute,getNotificattion)
router.delete("/",protectRoute,deleteNotification)

export default router