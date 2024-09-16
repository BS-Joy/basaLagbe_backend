import express from "express";
import {
  addToBookmark,
  checkAdBookmarkStatus,
} from "../controllers/bookmarkController.js";

const bookmarkRouter = express.Router();

bookmarkRouter.put("/:userId", addToBookmark);
bookmarkRouter.get("/:userId/:adId", checkAdBookmarkStatus);

export default bookmarkRouter;
