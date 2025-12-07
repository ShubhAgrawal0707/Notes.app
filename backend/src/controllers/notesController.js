import axios from "axios";
import Note from "../models/Note.js";

// =======================
// GET all notes
// =======================
export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller:", error);
    res.status(500).json({ message: "Internal server error while fetching notes" });
  }
}

// =======================
// GET note by ID
// =======================
export async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: "Note not found" });

    res.status(200).json(note);
  } catch (error) {
    console.error("Error in getNoteById controller:", error);
    res.status(500).json({ message: "Internal server error while fetching note" });
  }
}

// =======================
// CREATE Note + Sentiment
// =======================
export async function createNote(req, res) {
  try {
    const { title, content } = req.body;

    // Validate
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    // 🔥 Call Python Sentiment API
    let sentiment = "unknown";
    try {
      const response = await axios.post("http://127.0.0.1:5002/sentiment", {
        text: content
      });
      sentiment = response.data.sentiment;
    } catch (err) {
      console.error("Error contacting Python API:", err.message);
      // We still create the note even if sentiment fails
    }

    // Save note in DB
    const note = new Note({
      title,
      content,
      sentiment,
    });

    const savedNote = await note.save();

    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in createNote controller:", error);
    res.status(500).json({ message: "Internal server error while creating note" });
  }
}

// =======================
// UPDATE Note
// =======================
export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;

    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Note not found" });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error in updateNote controller:", error);
    res.status(500).json({ message: "Internal server error while updating note" });
  }
}

// =======================
// DELETE Note
// =======================
export async function deleteNote(req, res) {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) return res.status(404).json({ message: "Note not found" });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNote controller:", error);
    res.status(500).json({ message: "Internal server error while deleting note" });
  }
}
