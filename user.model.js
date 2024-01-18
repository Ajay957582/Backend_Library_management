import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profile_pic: String,
  enrollment_number: String,
  books: [
    {
      bookId: String,
      issueDate: Date,
    },
  ],
});
export const User = mongoose.model("User", userSchema);
