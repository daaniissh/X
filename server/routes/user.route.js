import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { followOrUnfollow, getProfile, getSuggestedUsers, updateProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:id", protectRoute, followOrUnfollow);
router.post("/update", protectRoute, updateProfile);

export default router;
