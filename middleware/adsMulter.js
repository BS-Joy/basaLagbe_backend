import multer from "multer";
import fs from "fs";
import { promisify } from "util";

export const unlinkAsync = promisify(fs.unlink);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/ads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension =
      file.originalname.split(".")[file.originalname.split(".").length - 1];
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExtension);
  },
});

const adsUpload = multer({
  storage: storage,
});

export default adsUpload;
