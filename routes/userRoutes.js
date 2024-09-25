import express from "express";
import {
  createUser,
  getAllUser,
  login,
  updateUserProfile,
} from "../controllers/userController.js";
import profilePictureUpload from "../middleware/profilePictureMulter.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", login);
userRouter.get("/", getAllUser);
userRouter.patch(
  "/updateUser/:userId",
  profilePictureUpload.single("profilePicture"),
  updateUserProfile
);

export default userRouter;
