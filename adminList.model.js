import mongoose from "mongoose";

const adminListSchema = new mongoose.Schema({
  email: String,
});
export const Admin = mongoose.model("Admin", adminListSchema);
