import mongoose from "mongoose";

// 1- create a schema
// 2- model based off of that schema

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },

    // 👉 New field for Sentiment Analysis
    sentiment: {
      type: String,   // Example values: "Positive", "Neutral", "Negative"
      required: false // optional
    },
  },
  { timestamps: true } // mongoDB default createdAt, updatedAt
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
