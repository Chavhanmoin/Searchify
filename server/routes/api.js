import express from "express";
import axios from "axios";
import Search from "../models/Search.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// POST /api/search
router.post("/search", authenticate, async (req, res) => {
  const { term } = req.body;
  if (!term) return res.status(400).json({ message: "Search term required" });

  try {
    // Save search
    await Search.create({ userId: req.user._id, term });

    // Fetch from Unsplash
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query: term, per_page: 20 },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    res.json({
      message: `You searched for "${term}" — ${response.data.results.length} results.`,
      results: response.data.results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching images" });
  }
});

// GET /api/history
router.get("/history", authenticate, async (req, res) => {
  const history = await Search.find({ userId: req.user._id }).sort({ timestamp: -1 });
  res.json(history);
});

// GET /api/top-searches
router.get("/top-searches", async (req, res) => {
  const top = await Search.aggregate([
    { $group: { _id: "$term", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);
  res.json(top);
});

export default router;
