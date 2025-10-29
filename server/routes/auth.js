// /routes/auth.js
import express from "express";
import passport from "passport";

const router = express.Router();

// 🟢 Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => res.redirect("http://localhost:3000")
);

// 🔵 Facebook
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/auth/failure" }),
  (req, res) => res.redirect("http://localhost:3000")
);

// ⚫ GitHub
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/failure" }),
  (req, res) => res.redirect("http://localhost:3000")
);

// ✅ Success route
router.get("/success", (req, res) => {
  if (req.user) {
    res.json({ message: "🎉 Login successful!", user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// 🚪 Logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("http://localhost:3000");
    });
  });
});

router.get("/failure", (req, res) => res.send("❌ Login Failed"));

export default router;
