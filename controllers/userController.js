import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import { unlinkAsync } from "../middleware/profilePictureMulter.js";
import multer from "multer";

// creating user
// post request
export const createUser = async (req, res) => {
  try {
    const { username, email, password, userRole, bookmarkedAds } = req.body;
    const userData = {
      username,
      email,
      password,
      userRole,
      bookmarkedAds,
    };

    const existUser = await userModel.findOne({ email: email });

    if (existUser) {
      res
        .status(403)
        .json({ error: `User with  email "${email}" already exist` });
    } else {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
      const result = await userModel.create(userData);
      console.log(result);
      res.status(200).send({ message: "User Created", data: result });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

// get user for log in
// post request
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: email });

    if (user) {
      const passMatched = await bcrypt.compare(password, user.password);
      if (passMatched) {
        res.json(user);
      } else {
        console.log("Incorrect password");
        res.status(401).json({ error: "Incorrect Password" });
      }
    } else {
      console.log("user not found");
      res.status(404).json({ error: `No user found with email "${email}"` });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

// get all the users
// get request
export const getAllUser = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.send(users);
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

// update user profile
// patch request
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const dataToUpdate = req.body;
    const profilePicture = req.file;

    console.log(profilePicture);

    // of: if user changing profile picture then first delete the previous profile picture
    if (profilePicture?.filename) {
      dataToUpdate["profilePicture"] = profilePicture.filename;
      const user = await userModel.findById(userId);
      const profilePictureFileName = user?.profilePicture;

      // note: checking if profile picture is "". because during signup process profile picture is "" a empty string.
      if (user?.profilePicture) {
        await unlinkAsync(
          `public/uploads/profilePictures/${profilePictureFileName}`
        );
      }
    }

    const result = await userModel.findByIdAndUpdate(userId, dataToUpdate, {
      new: true,
    });

    res.status(200).json(result);
  } catch (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).json({ error: "A multer error occured!" });
    } else {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
};
