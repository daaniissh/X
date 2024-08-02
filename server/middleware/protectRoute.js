import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(400).json({ error: "token not found" });
    }

    const decode = jwt.verify(token, process.env.SECRET_JWT);
    if (!decode) res.status(400).json({ error: "Invalid token" });
    const user = await User.findById(decode.userId).select("-password")
    if(!user){
      return res.status(404).json({error:"User not found"})
    }
    req.user = user
    next()
  } catch (error) {
    return res.json(error)
  }
};
