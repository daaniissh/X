import express from "express";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import NotificationRoutes from "./routes/notification.routes.js";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import connectMongo from "./db/connect.js";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_API_KEY,
});
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notification", NotificationRoutes );
app.all("*", (req,res)=>{
  res.json("404 not found")
});

app.listen(process.env.PORT, () => {
  console.log("Server is running port http://localhost:8000");
  connectMongo();
});
