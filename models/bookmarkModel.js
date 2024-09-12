import mongoose, { Schema, SchemaType } from "mongoose";

const bookmarkSchema = mongoose.Schema(
  {
    userId: {
      type: SchemaType.ObjectId,
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

const Bookmarks =
  mongoose.models.bookmarks || mongoose.model("bookmark", bookmarkSchema);

export default Bookmarks;
