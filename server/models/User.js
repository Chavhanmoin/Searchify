import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String }, // optional (legacy support)
  providerId: { type: String, required: true },
  provider: { type: String, required: true },
  displayName: { type: String },
  email: { type: String },
  profilePhoto: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
export default User;
