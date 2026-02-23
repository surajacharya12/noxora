const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("⚠️  WARNING: MongoDB connection failed!");
    console.error(error.message);
    console.error(
      "\nServer will continue running but database operations will fail.\n",
    );
  }
};

module.exports = connectDB;
