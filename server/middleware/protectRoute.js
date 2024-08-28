import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    // Get the JWT from cookies
    const token = req.cookies.jwt;

    if (!token) {
      // No token provided, return an Unauthorized error
      return res.status(401).json({ error: "Unauthorized: No Token Provided" });
    }

    let decoded;
    try {
      // Verify the JWT token
      decoded = jwt.verify(token, process.env.SECRET_JWT);
    } catch (err) {
      // Check if the error is specifically due to token expiration
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Unauthorized: Token Expired" });
      } else {
        return res.status(401).json({ error: "Unauthorized: Invalid Token" });
      }
    }

    // Find the user associated with the token
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      // User not found in the database
      return res.status(404).json({ error: "User not found" });
    }

    // Attach the user to the request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Error in protectRoute middleware:", err.message);
    // General server error
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
