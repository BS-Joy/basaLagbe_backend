import mongoose from "mongoose";

const adsSchema = mongoose.Schema(
  {
    authorId: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: Object,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    rent: {
      type: String,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    bedroom: {
      type: Number,
      required: true,
    },
    bathroom: {
      type: Number,
      required: true,
    },
    availableForm: {
      type: String,
      required: true,
    },
    contact: {
      type: Object,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Ads = mongoose.models.ads || mongoose.model("ads", adsSchema);

export default Ads;
