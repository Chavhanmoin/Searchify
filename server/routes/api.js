import express from "express";
import axios from "axios";
import Search from "../models/Search.js";

const router = express.Router();

// 🔍 POST /api/search — search images via Unsplash
router.post("/search", async (req, res) => {
  try {
    const { term } = req.body;
    if (!term) return res.status(400).json({ message: "Search term is required" });

    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized — please log in first" });
    }

    const UNSPLASH_URL = `https://api.unsplash.com/search/photos?query=${term}&per_page=12&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;
    const { data } = await axios.get(UNSPLASH_URL);

    // Save search record in MongoDB
    await Search.create({
      userId: req.user._id,
      term,
    });

    // Return search results
    res.json({
      term,
      total: data.total,
      results: data.results.map((img) => ({
        id: img.id,
        description: img.alt_description,
        thumb: img.urls.thumb,
        full: img.urls.full,
      })),
    });
  } catch (err) {
    console.error("❌ Unsplash Error:", err.message);
    res.status(500).json({ message: "Error fetching from Unsplash" });
  }
});

// 🏆 GET /api/top-searches — top 5 frequent terms
router.get("/top-searches", async (req, res) => {
  try {
    const top = await Search.aggregate([
      { $group: { _id: "$term", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json(top.map((item) => ({ term: item._id, count: item.count })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting top searches" });
  }
});

// 🕓 GET /api/history — user’s past searches
router.get("/history", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized — please log in first" });
    }

    const history = await Search.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(10);

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting history" });
  }
});

export default router;
