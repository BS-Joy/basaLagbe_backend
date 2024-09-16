import mongoose, { Schema } from "mongoose";

const bookmarkSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.ObjectId,
      require: true,
    },
    totalAds: {
      type: Number,
      default: 0,
      required: true,
    },
    adIds: [
      {
        type: Schema.ObjectId,
        ref: "Ad",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Bookmark =
  mongoose.models.bookmarks || mongoose.model("bookmark", bookmarkSchema);

export default Bookmark;
