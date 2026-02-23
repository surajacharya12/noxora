require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/user", require("./routes/user"));
app.use("/api/movies", require("./routes/movies"));
app.use("/api/series", require("./routes/series"));
app.use("/api/trending", require("./routes/trending"));
app.use("/api/search", require("./routes/search"));
app.use("/api/wishlist", require("./routes/wishlist"));
app.use("/api/progress", require("./routes/watchProgress"));

const mongoose = require("mongoose");

app.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.send(`Nexora Streaming Server Running... (DB Status: ${dbStatus})`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
