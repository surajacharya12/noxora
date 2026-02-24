const express = require("express");
const Request = require("../models/Request");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Get all requests (could be for an admin panel later)
router.get("/", async (req, res) => {
  try {
    const data = await Request.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new request
router.post("/", async (req, res) => {
  try {
    const { title, type } = req.body;
    let userId = null;

    // Optional: Attach user ID if logged in
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // Ignore invalid token, post as guest
      }
    }

    const newRequest = new Request({
      title,
      type,
      userId,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
