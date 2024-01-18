import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
  },
  bookName: {
    type: String,
    required: true,
  },
  bookAuthor: {
    type: String,
    required: true,
  },
  bookImage: {
    type: String,
    required: true,
  },
  bookPDF: {
    type: String,
    required: true,
  },
});

export const Book = mongoose.model("Book", bookSchema);
