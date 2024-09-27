import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // const fileExtension =
    //   file.originalname.split(".")[file.originalname.split(".").length - 1];
    cb(null, file.originalname);
  },
});

const adsUpload = multer({
  storage: storage,
});

export default adsUpload;
