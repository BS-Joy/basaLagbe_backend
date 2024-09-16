import mongoose from "mongoose";
import Bookmark from "../models/bookmarkModel.js";

export const addToBookmark = async (req, res) => {
  try {
    const { userId } = req.params;
    const { adId } = req.body;
    const mongoAdId = new mongoose.Types.ObjectId(adId);
    // console.log(mongoAdId);

    const result = await Bookmark.findOneAndUpdate(
      { userId },
      { $addToSet: { adIds: mongoAdId } },
      { new: true, upsert: true }
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const checkAdBookmarkStatus = async (req, res) => {
  try {
    const { userId, adId } = req.params;

    // const mongoAdId = new mongoose.Types.ObjectId(adId);

    const bookmark = await Bookmark.findOne({ userId: userId }).lean();

    const isBookmarked = bookmark.adIds.some((id) => id.toString() === adId);

    res.status(200).json(isBookmarked);
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};
