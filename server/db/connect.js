import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("mongo db connected", conn.connection.host);
  } catch (error) {
    console.log("error in db :", error.message);
    process.exit(1);
  }
};

export default connectMongo;
