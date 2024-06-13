import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import connectMongo from "./db/connect.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json())
app.use(cookieParser())
dotenv.config();
console.log(process.env.MONGO_URL);

app.use("/api/auth", authRoutes);
app.listen(process.env.PORT, () => {
  console.log("Server is running port 8000");
  connectMongo();
});

