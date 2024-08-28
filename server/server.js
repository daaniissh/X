import express from "express";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import NotificationRoutes from "./routes/notification.routes.js";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import connectMongo from "./db/connect.js"; // The improved DB connection function
import cookieParser from "cookie-parser";

dotenv.config();  // Load environment variables

const app = express();  // Initialize the express application
app.use(cookieParser());
// Middleware Setup
app.use(express.json({ limit: "5mb" }));  // Limit the size of JSON payloads
app.use(cors({
  origin: 'https://x-client-home.vercel.app', // Replace with your frontend domain
  credentials: true, // Allow credentials (cookies) to be sent
}));


app.use(express.urlencoded({ extended: true }));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_API_KEY,
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", NotificationRoutes);

// Fallback for undefined routes
app.all("*", (req, res) => {
  res.status(404).json({ message: "404 not found, page not found" });
});

// Start server and connect to MongoDB
const PORT = process.env.PORT || 3000;
connectMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on https://x-nu-murex.vercel.app on port ${PORT}`);
  });
}).catch(error => {
  console.error("Failed to connect to MongoDB:", error.message);
});
