import mongoose from "mongoose";

const categoriesSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    totalAds: {
      type: Number,
      default: 0,
      required: true,
    },
    totalActiveAds: {
      type: Number,
      default: 0,
      required: true,
    },
    thumbnail: {
      type: String,
      default:
        "https://plus.unsplash.com/premium_photo-1680281937008-f9b19ed9afb6?q=80&w=1913&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Categories =
  mongoose.models.categories || mongoose.model("category", categoriesSchema);

export default Categories;
