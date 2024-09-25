import express from "express";
import {
  createAds,
  deleteAd,
  getAdById,
  getAds,
  getAdsByAuthor,
  getRecentAds,
  togglePublishUnpublish,
  updateAd,
} from "../controllers/adsController.js";
import adsUpload from "../middleware/adsMulter.js";

const adsRouter = express.Router();

adsRouter.post("/", adsUpload.array("images", 5), createAds);
adsRouter.get("/getAds/:cat", getAds);
adsRouter.get("/recentAds", getRecentAds);
adsRouter.get("/author/:authorId", getAdsByAuthor);

adsRouter.get("/:adId", getAdById);
adsRouter.delete("/:adId", deleteAd);

adsRouter.patch("/", updateAd);
adsRouter.patch("/:adId", togglePublishUnpublish);

export default adsRouter;
