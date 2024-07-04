import { generateTokenAndSetCookies } from "../lib/utils/Token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
  const { fullName, username, email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: "Username is already taken" });
  }
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({ error: "Email is already taken" });
  }
  if (password?.length < 6) {
    res
      .status(401)
      .json({ error: "Password must be at least 6 characters long" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    fullName,
    username,
    email,
    password: hashedPassword,
  });

  if (newUser) {
    generateTokenAndSetCookies(newUser._id, res);
    await newUser.save();
    res.status(200).json({
      _id:newUser._id,
      username:newUser.username,
      fullName:newUser.fullName,
      email:newUser.email,
      profileImg:newUser.profileImg,
      coverImg:newUser.coverImg,
      bio:newUser.bio,
      link:newUser.link,
      followers:newUser.followers,
      following:newUser.following,
    });
  } else {
    console.log("Internal server error at signup : line 54");
    res
      .status(400)
      .json({ error: "Internal server error at signup : line 54" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    generateTokenAndSetCookies(user._id, res);
    const {
      _id,
      fullName,
      email,
      profileIMg,
      coverImg,
      bio,
      link,
      followers,
      following,
    } = user;
    res.status(200).json({
      _id,
      username: user.username,
      fullName,
      email,
      profileIMg,
      coverImg,
      bio,
      link,
      followers,
      following,
    });
  } catch (error) {
    console.log("Internal server error at Login : line 68");
    res.status(400).json({ error: "Internal server error at Login : line 68" });
  }
};
export const logout = async (req, res) => {
  try {
    res
      .clearCookie("jwt", "", { maxAge: 0 })
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Internal server error at Logout : line 111");
    res
      .status(400)
      .json({ error: "Internal server error at Logout : line 111" });
  }
};
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.json(error)
  }
};
