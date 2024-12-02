import multer from "multer";
// import fs from "fs";
// import { promisify } from "util";

// export const unlinkAsync = promisify(fs.unlink);

// storage for upload in file storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/uploads/profilePictures");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const fileExtension =
//       file.originalname.split(".")[file.originalname.split(".").length - 1];
//     cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExtension);
//   },
// });

// code for upload external cloud
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const profilePictureUpload = multer({
  storage: storage,
});

export default profilePictureUpload;
