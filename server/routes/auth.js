// routes/auth.js
import express from "express";
import passport from "passport";

const router = express.Router();

// Google login
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    res.redirect("http://localhost:3000"); // ✅ redirect to frontend after success
  }
);

// Success route
router.get("/success", (req, res) => {
  if (req.user) {
    res.json({ message: "🎉 Login successful!", user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// Logout route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("http://localhost:3000");
    });
  });
});

// Failure route
router.get("/failure", (req, res) => {
  res.send("❌ Google Login Failed");
});

export default router;
