import Categories from "../models/categoryModel.js";

export const getCoategories = async (req, res) => {
  try {
    const categories = await Categories.find({}).lean();

    res.status(200).send(categories);
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};
