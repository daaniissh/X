import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import connectMongo from "./db/connect.js";

const app = express();
dotenv.config();
console.log(process.env.MONGO_URL);

app.use("/api/auth", authRoutes);
app.listen(process.env.PORT, () => {
  console.log("Server is running port 8000");
  connectMongo();
});
