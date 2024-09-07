import mongoose from "mongoose";
import Ads from "../models/adsModel.js";
import User from "../models/userModel.js";
import Categories from "../models/categoryModel.js";

// add ads
// post request
export const createAds = async (req, res) => {
  try {
    const {
      authorId,
      title,
      description,
      category,
      division,
      district,
      area,
      address,
      rent,
      floor,
      bedroom,
      bathroom,
      availableForm,
      phone,
      whatsapp,
    } = req.body;

    const data = {
      authorId,
      title,
      description,
      category,
      location: {
        division,
        district,
        area,
      },
      address,
      rent,
      floor,
      bedroom,
      bathroom,
      availableForm,
      contact: {
        phone,
        whatsapp,
      },
    };

    const response = await Ads.create(data);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const getAds = async (req, res) => {
  try {
    const { cat } = req.params;

    let result;

    if (cat !== "null") {
      result = await Ads.find({ active: true, category: cat })
        .populate({
          path: "authorId",
          model: User,
        })
        .populate({
          path: "category",
          model: Categories,
        })
        .lean();
    } else {
      result = await Ads.find({ active: true })
        .populate({
          path: "authorId",
          model: User,
        })
        .populate({
          path: "category",
          model: Categories,
        })
        .lean();
    }

    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const getAdsByAuthor = async (req, res) => {
  try {
    const { authorId } = req.params;
    const ads = await Ads.find({ authorId });
    res.status(200).send(ads);
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const getAdById = async (req, res) => {
  try {
    const { adId } = req.params;

    const isValid = mongoose.Types.ObjectId.isValid(adId);

    if (!isValid) {
      return res.status(400).json({ error: "Invalid ad ID" });
    }

    const ad = await Ads.findById(adId)
      .populate({
        path: "authorId",
        model: User,
      })
      .populate({
        path: "category",
        model: Categories,
      })
      .lean();
    res.status(200).send(ad);
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const deleteAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const response = await Ads.findByIdAndDelete(adId);
    return res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const updateAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const adData = req.body;
    const { _id, ...dataToUpdate } = adData;

    const response = await Ads.findByIdAndUpdate(adId, dataToUpdate, {
      new: true,
    });

    return res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};
