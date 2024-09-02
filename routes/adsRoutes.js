import express from "express";
import {
  createAds,
  deleteAd,
  getAdById,
  getAds,
  getAdsByAuthor,
} from "../controllers/adsController.js";

const adsRouter = express.Router();

adsRouter.post("/", createAds);
adsRouter.get("/", getAds);
adsRouter.get("/author/:authorId", getAdsByAuthor);
adsRouter.get("/:adId", getAdById);
adsRouter.delete("/:adId", deleteAd);

export default adsRouter;
