import express from "express";
import {
  addToBookmark,
  checkAdBookmarkStatus,
  deleteABookmark,
  getBookmarksByUser,
} from "../controllers/bookmarkController.js";

const bookmarkRouter = express.Router();

bookmarkRouter.put("/:userId", addToBookmark);
bookmarkRouter.get("/:userId/:adId", checkAdBookmarkStatus);
bookmarkRouter.get("/:userId", getBookmarksByUser);
bookmarkRouter.delete("/:userId", deleteABookmark);

export default bookmarkRouter;
