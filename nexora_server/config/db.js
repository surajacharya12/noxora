const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false, // Disable buffering to fail fast if connection is lost
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
    });
    
    isConnected = !!conn.connections[0].readyState;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("⚠️  WARNING: MongoDB connection failed!");
    console.error(error.message);
    console.error(
      "\nEnsure your MONGO_URI is correct and Vercel IP is whitelisted (0.0.0.0/0) in Atlas.\n",
    );
  }
};

module.exports = connectDB;
