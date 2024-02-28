import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// creating user
// post request
export const createUser = async (req, res) => {
  try {
    const { name, email, password, userRole } = req.body;
    const userData = {
      name,
      email,
      password,
      userRole,
    };

    const existUser =await User.findOne({ email: email });

    if (existUser) {
      res.status(403).json({ error: "User already exist" });
    } else {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
      const result = await User.create(userData);
      console.log(result)
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
  // const email = 'joysm967@gmai.com'
  const user = await User.findOne({ email: email });

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
    res.status(404).json({ error: "User Not Found" });
  }
};

// get all the users
// get request
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
}