import mongoose from "mongoose";

const searchSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  term: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Search = mongoose.model("Search", searchSchema);
export default Search;
