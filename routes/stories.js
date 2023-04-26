import express from "express";
import { getStories, addStory } from "../controllers/stories.js";
const router = express.Router();

router.get("/", getStories);
router.post("/", addStory);

export default router;
