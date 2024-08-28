import mongoose from "mongoose";

// Cache the MongoDB connection
let cachedConnection = null;

const connectMongo = async () => {
  if (cachedConnection) {
    console.log("Using cached MongoDB connection.");
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    cachedConnection = conn;  // Store the connection in cache
    console.log("MongoDB connected:", conn.connection.host);

    return conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    throw new Error(error.message);  // Let the calling function handle the error
  }
};

export default connectMongo;
