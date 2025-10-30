import express from "express";
import axios from "axios";
import Search from "../models/Search.js";

const router = express.Router();

/* ------------------------------------
   🔍 POST /api/search — search Unsplash
------------------------------------ */
router.post("/search", async (req, res) => {
  try {
    const { term } = req.body;
    if (!term) return res.status(400).json({ message: "Search term is required" });

    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized — please log in first" });
    }

    // Fetch images from Unsplash
    const UNSPLASH_URL = `https://api.unsplash.com/search/photos?query=${term}&per_page=12&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;
    const { data } = await axios.get(UNSPLASH_URL);

    // Save search term in DB
    await Search.create({
      userId: req.user._id,
      term,
    });

    // Return results
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

/* ------------------------------------
   🏆 GET /api/top-searches — top 5 terms
------------------------------------ */
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
// 🕓 GET /api/history — user’s paginated past searches
router.get("/history", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 7;
  const skip = (page - 1) * limit;

  const total = await Search.countDocuments({ userId: req.user._id });

  const history = await Search.find({ userId: req.user._id })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    history,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});
// 🏆 GET /api/top-searches — top 5 frequent terms
router.get("/top-searches", async (req, res) => {
  try {
    const top = await Search.aggregate([
      { $group: { _id: "$term", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json(
      top.map((item) => ({
        term: item._id,
        count: item.count,
      }))
    );
  } catch (err) {
    console.error("❌ Error fetching top searches:", err);
    res.status(500).json({ message: "Error getting top searches" });
  }
});



export default router;
