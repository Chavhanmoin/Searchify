// /services/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ✅ Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ providerId: profile.id });
        if (!user) {
          user = await User.create({
            providerId: profile.id,
            provider: "google",
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value || "no-email",
            profilePhoto: profile.photos?.[0]?.value || "",
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

//✅ Facebook OAuth
// 
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ providerId: profile.id });
        if (!user) {
          user = await User.create({
            providerId: profile.id,
            provider: "facebook",
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value || "no-email",
            profilePhoto: profile.photos?.[0]?.value || "",
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);


// ✅ GitHub OAuth
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ providerId: profile.id });
        if (!user) {
          user = await User.create({
            providerId: profile.id,
            provider: "github",
            displayName: profile.displayName || "No Name",
            email: profile.emails?.[0]?.value || "no-email",
            profilePhoto: profile.photos?.[0]?.value || "",
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
