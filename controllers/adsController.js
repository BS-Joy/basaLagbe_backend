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

    const categoryToUpdate = await Categories.findByIdAndUpdate(
      category,
      {
        $inc: { totalAds: 1, totalActiveAds: 1 },
      },
      { new: true } // Returns the updated document
    );

    const response = await Ads.create(data);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const getAds = async (req, res) => {
  try {
    const { cat } = req.params;
    const { searchParams } = req.query;
    let isCategoryId = true;
    const searchFilters =
      searchParams === "null" ? false : JSON.parse(searchParams);

    if (cat === "false" || cat === "null" || cat === "undefined" || !cat) {
      isCategoryId = false;
    }

    let result;

    // of: fetch category by title and check if its valid or not
    let categoryId = null;
    if (isCategoryId) {
      const category = await Categories.findOne({ title: cat });
      if (category) {
        categoryId = category._id;
      } else {
        return res.status(404).json({ error: "Category not found!" });
      }
    }

    if (isCategoryId && categoryId) {
      result = await Ads.find({ active: true, category: categoryId })
        .populate({
          path: "authorId",
          model: User,
        })
        .populate({
          path: "category",
          model: Categories,
        })
        .lean();
    } else if (searchFilters) {
      result = await Ads.find({
        active: true,
        location: {
          division: searchFilters.division,
          district: searchFilters.district,
          area: searchFilters.area,
        },
      })
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
    const ad = await Ads.findById(adId);

    const categoryId = ad?.category;

    const adCategory = await Categories.findById(categoryId);

    const totalAdsNumber = adCategory?.totalAds;
    const totalActiveAdsNumber = adCategory?.totalActiveAds;

    adCategory.totalAds = totalAdsNumber - 1;

    if (ad?.active) {
      adCategory.totalActiveAds = totalActiveAdsNumber - 1;
    }

    adCategory.save();

    const response = await Ads.findByIdAndDelete(adId);
    return res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const updateAd = async (req, res) => {
  try {
    const adData = req.body;
    const { _id: adId, ...dataToUpdate } = adData;

    const response = await Ads.findByIdAndUpdate(adId, dataToUpdate);

    const newCategoryById = await Categories.findById(dataToUpdate?.category);

    const newCategoryTotalAds = newCategoryById.totalAds;
    const newCategoryTotalActiveAds = newCategoryById.totalActiveAds;

    // of: if category is changed during update any ads
    if (dataToUpdate?.category !== response?.category) {
      // first get previous category
      const prevCategory = await Categories.findById(response?.category);

      const prevCategoryTotalAds = prevCategory?.totalAds;
      const prevCategoryTotalActiveAds = prevCategory?.totalActiveAds;

      // update and save previous category
      prevCategory.totalActiveAds = prevCategoryTotalActiveAds - 1;
      prevCategory.totalAds = prevCategoryTotalAds - 1;

      prevCategory.save();

      // then update the new category
      newCategoryById.totalAds = newCategoryTotalAds + 1;
      if (response?.active) {
        newCategoryById.totalActiveAds = newCategoryTotalActiveAds + 1;
      }
    }

    // finally save the new category
    newCategoryById.save();

    return res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const togglePublishUnpublish = async (req, res) => {
  try {
    const { adId, active } = req.body;

    const response = await Ads.findByIdAndUpdate(
      adId,
      { active: active },
      {
        new: true,
      }
    );

    const adCategory = await Categories.findOne({
      _id: response?.category,
    });

    const totalActiveAdsNumber = adCategory.totalActiveAds;

    // of: during publish unpublish of an ad
    if (active) {
      adCategory.totalActiveAds = totalActiveAdsNumber + 1;
    } else {
      adCategory.totalActiveAds = totalActiveAdsNumber - 1;
    }

    adCategory.save();

    return res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};
