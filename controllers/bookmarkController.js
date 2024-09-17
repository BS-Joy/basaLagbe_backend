import mongoose from "mongoose";
import Bookmark from "../models/bookmarkModel.js";
import Ads from "../models/adsModel.js";
import Categories from "../models/categoryModel.js";

export const addToBookmark = async (req, res) => {
  try {
    const { userId } = req.params;
    const { adId } = req.body;
    const mongoAdId = new mongoose.Types.ObjectId(adId);

    const result = await Bookmark.findOneAndUpdate(
      { userId },
      {
        $addToSet: { adIds: mongoAdId },
        $inc: { totalAds: 1 }, // Increment totalAds by 1
      },
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

    const bookmark = await Bookmark.findOne({ userId: userId }).lean();

    const isBookmarked = bookmark.adIds.some((id) => id.toString() === adId);

    res.status(200).json(isBookmarked);
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const getBookmarksByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookmarks = await Bookmark.findOne({ userId: userId })
      .populate({
        path: "adIds",
        model: Ads,
        populate: {
          path: "category",
          model: Categories,
        },
      })
      .lean();

    res.status(200).json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const deleteABookmark = async (req, res) => {
  try {
    const { userId } = req.params;
    const { adId } = req.body;

    const mongoAdId = new mongoose.Types.ObjectId(adId);

    const result = await Bookmark.findOneAndUpdate(
      { userId },
      {
        $pull: { adIds: mongoAdId },
        $inc: { totalAds: -1 }, // Decrement totalAds by 1
      },
      { new: true }
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};
