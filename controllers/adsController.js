import mongoose from "mongoose";
import Ads from "../models/adsModel.js";
import User from "../models/userModel.js";
import Categories from "../models/categoryModel.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { getPublicId } from "../utils/public_id.js";

// add ads
// post request
// note: create an ads
export const createAds = async (req, res) => {
  try {
    const data = req.body;
    const images = req.files;

    console.log({ images });

    const imgLinks = await Promise.all(
      images.map((img) => {
        const res = cloudinary.uploader.upload(
          img.path,
          {
            folder: "basaLagbe",
            transformation: [{ quality: "auto" }],
          },
          (err, result) => {
            if (err) {
              console.log("Cloudinary error: ", err);
              res.status(500).json({ error: err.message });
            } else {
              return result;
            }
          }
        );

        return res;
      })
    );

    // of: setting thumbnail
    data["thumbnail"] = {
      url: imgLinks[0].secure_url,
      public_id: imgLinks[0].public_id,
    };

    // of: setting images
    data["images"] = imgLinks.slice(1).map((img) => ({
      url: img.secure_url,
      public_id: img.public_id,
    }));

    const categoryToUpdate = await Categories.findByIdAndUpdate(
      data?.category,
      {
        $inc: { totalAds: 1, totalActiveAds: 1 },
      },
      { new: true } // Returns the updated document
    );

    const response = await Ads.create(data);
    res.status(201).send(response);
  } catch (error) {
    console.log(error);
    if (error instanceof multer.MulterError) {
      res.status(500).json({ multErerror: "Multer error!" });
    }
    res.status(500).json({ error: "Internal server error!" });
  }
};

// get post
// get request
// note: get all ads
export const getAds = async (req, res) => {
  const limit = 5;
  try {
    const { cat } = req.params;
    const { searchParams, page = 1 } = req.query;

    const skip = (parseInt(page) - 1) * limit;

    let query;
    let isCategory = true;

    // of: check if has search params from the client side
    const searchFilters =
      searchParams === "null" ? false : JSON.parse(searchParams);

    // of: check if has category from client side
    if (cat === "false" || cat === "null" || cat === "undefined" || !cat) {
      isCategory = false;
    }

    // of: fetch category by title and check if its valid or not
    let categoryId = null;

    // of: getting category id using category title
    if (isCategory) {
      const category = await Categories.findOne({
        title: cat,
      }).lean();
      if (category) {
        categoryId = category._id;
      } else {
        return res.status(404).json({ error: "Category not found!" });
      }
    }

    if (isCategory && categoryId) {
      query = { active: true, category: categoryId };
    } else if (searchFilters) {
      query = {
        active: true,
        location: {
          division: searchFilters.division,
          district: searchFilters.district,
          area: searchFilters.area,
        },
      };
    } else {
      query = { active: true };
    }

    const totalResult = await Ads.countDocuments(query);

    const result = await Ads.find(query)
      .populate({
        path: "authorId",
        model: User,
      })
      .populate({
        path: "category",
        model: Categories,
      })
      .skip(skip)
      .limit(5)
      .lean();

    // console.log({ result });

    res.status(200).send({ total: totalResult, data: result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

// note: get ads by autor
export const getAdsByAuthor = async (req, res) => {
  try {
    const { authorId } = req.params;
    const ads = await Ads.find({ authorId });
    res.status(200).send(ads);
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

// note: get ads by Id
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

// note: delete an ad
export const deleteAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const ad = await Ads.findById(adId);

    if (ad?.thumbnail) {
      const thumbnail_Public_id = ad?.thumbnail?.public_id;
      cloudinary.uploader.destroy(thumbnail_Public_id, (err, result) => {
        if (err) {
          console.log("Cloudinary error: ", err);
          res.status(500).json({ error: err.message });
        }
      });
    }

    // of: delete images from cloudinary
    const deleteRes = await Promise.all(
      ad?.images.map((img) => {
        const public_id = img?.public_id;
        const res = cloudinary.uploader.destroy(public_id, (err, result) => {
          if (err) {
            console.log("Cloudinary error: ", err);
            res.status(500).json({ error: err.message });
          }
        });

        return res;
      })
    );

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

// note: update an ad
export const updateAd = async (req, res) => {
  try {
    const adData = req.body;
    const {
      _id: adId,
      isUpdatingAvailableForm,
      isUpdatingImages,
      deletedImages,
      ...dataToUpdate
    } = adData;

    const newImages = req.files;

    if (JSON.parse(isUpdatingImages)) {
      // of: if any image is removed then remove it from the cloudinary library as well
      if (deletedImages) {
        if (Array.isArray(deletedImages) && deletedImages?.length > 0) {
          await Promise.all(
            deletedImages?.map((public_id) => {
              const res = cloudinary.uploader.destroy(
                public_id,
                (err, result) => {
                  if (err) {
                    console.log("Cloudinary error: ", err);
                    res.status(500).json({ error: err.message });
                  }
                }
              );
            })
          );
        } else {
          cloudinary.uploader.destroy(deletedImages, (err, result) => {
            if (err) {
              console.log("Cloudinary error: ", err);
              res.status(500).json({ error: err.message });
            }
          });
        }
      }

      // of: if any new images uploaded by the user
      if (newImages?.length > 0) {
        // of: upload new images to cloudinary
        const imgLinks = await Promise.all(
          newImages?.map((img) => {
            const res = cloudinary.uploader.upload(
              img.path,
              {
                public_id: img.originalname, // optional custom public ID
                folder: "basaLagbe",
                transformation: [{ quality: "auto" }],
              },
              (err, result) => {
                if (err) {
                  console.log("Cloudinary error: ", err);
                  res.status(500).json({ error: err.message });
                }
                return result;
              }
            );
            return res;
          })
        );

        // of: if there was not image before then add new images
        if (!dataToUpdate?.images) {
          dataToUpdate["images"] = imgLinks.map((img) => ({
            url: img?.url,
            public_id: img?.public_id,
          }));
        } else {
          const allNewImages = imgLinks.map((img) => ({
            url: img?.url,
            public_id: img?.public_id,
          }));
          dataToUpdate.images = [...dataToUpdate?.images, ...allNewImages];
        }
      }

      if (!dataToUpdate?.thumbnail) {
        dataToUpdate["thumbnail"] = dataToUpdate.images[0];
        if (
          Array.isArray(dataToUpdate.images) &&
          dataToUpdate.images.length > 0
        ) {
          dataToUpdate.images = [];
        } else {
          dataToUpdate.images = dataToUpdate.images.slice(1);
        }
      }
    }

    const response = await Ads.findByIdAndUpdate(adId, dataToUpdate, {
      timestamps: JSON.parse(isUpdatingAvailableForm),
    });

    // of: if category is changed during update the ad
    if (dataToUpdate?.category !== response?.category?.toString()) {
      // first get the new category detail
      const newCategoryById = await Categories.findById(dataToUpdate?.category);

      const newCategoryTotalAds = newCategoryById.totalAds;
      const newCategoryTotalActiveAds = newCategoryById.totalActiveAds;

      // then get previous category
      const prevCategory = await Categories.findById(response?.category);

      const prevCategoryTotalAds = prevCategory?.totalAds;
      const prevCategoryTotalActiveAds = prevCategory?.totalActiveAds;

      // update and save previous category
      prevCategory.totalActiveAds = prevCategoryTotalActiveAds - 1;
      prevCategory.totalAds = prevCategoryTotalAds - 1;

      prevCategory.save();

      // then add the new category to the ad
      newCategoryById.totalAds = newCategoryTotalAds + 1;
      if (response?.active) {
        newCategoryById.totalActiveAds = newCategoryTotalActiveAds + 1;
      }

      // finally save the new category
      newCategoryById.save();
    }

    return res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

// note: toggle between publish and unpublish an ad
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

// note: get recent ads
export const getRecentAds = async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const ads = await Ads.find({
      updatedAt: {
        $gte: sevenDaysAgo,
      },
    });

    res.status(200).json(ads);
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};
