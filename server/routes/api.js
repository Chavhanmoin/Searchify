import express from "express";
import axios from "axios";
import Search from "../models/Search.js";
// --- IMPORT THE MIDDLEWARE ---
import { ensureAuthenticated } from "../middleware/authenticate.js";

const router = express.Router();

/* ------------------------------------
    🔍 POST /api/search — search Unsplash
------------------------------------ */
// --- ADDED ensureAuthenticated MIDDLEWARE ---
router.post("/search", ensureAuthenticated, async (req, res) => {
  try {
    const { term, page = 1 } = req.body;

    if (!term) {
      return res.status(400).json({ message: "Search term is required" });
    }

    // --- No longer need 'if (!req.user)' check ---

    // Fetch from Unsplash with pagination
    const UNSPLASH_URL = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      term
    )}&page=${page}&per_page=12&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;

    const { data } = await axios.get(UNSPLASH_URL);

    // ✅ Save search term to DB
    await Search.create({
      userId: req.user._id,
      term,
      timestamp: new Date(),
    });

    // ✅ Return formatted results
    res.json({
      term,
      page,
      total: data.total,
      totalPages: data.total_pages,
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
    🕓 GET /api/history — user's past searches (paginated)
------------------------------------ */
// --- ADDED ensureAuthenticated MIDDLEWARE ---
router.get("/history", ensureAuthenticated, async (req, res) => {
  try {
    // --- No longer need 'if (!req.user)' check ---
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
  } catch (err) {
    console.error("❌ Error fetching history:", err);
    res.status(500).json({ message: "Error fetching history" });
  }
});

/* ------------------------------------
    🏆 GET /api/top-searches — top 5 frequent search terms
------------------------------------ */
router.get("/top-searches", async (req, res) => {
  // ... (existing code is fine)
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

/* ------------------------------------
    🗑️ DELETE /api/history — delete selected history items
------------------------------------ */
// --- NEW ROUTE ---
router.delete("/history", ensureAuthenticated, async (req, res) => {
  const { ids } = req.body;
  const userId = req.user._id;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No history item IDs provided." });
  }

  try {
    // We only delete items where the ID is in the user's list AND
    // the userId matches the logged-in user. This is a security check.
    const result = await Search.deleteMany({
      _id: { $in: ids },
      userId: userId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No matching history found to delete." });
    }

    res.json({ message: `Successfully deleted ${result.deletedCount} items.` });
  } catch (err) {
    console.error("Error deleting history:", err);
    res.status(500).json({ message: "Server error while deleting history." });
  }
});
// --- END NEW ROUTE ---

export default router;
