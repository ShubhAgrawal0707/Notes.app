import express from 'express';
import NotesRouter from "./NotesRoute/NotesRoute.js";
import { connectionDB } from './config/db.js';
// Rate limiter disabled because Redis is not configured
// import rateLimiter from './middleware/rateLimiter.js';
import dotenv from 'dotenv';
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // parses json body

app.use(cors({
  origin: "http://localhost:5173",
}));

// ❌ Disabled the rateLimiter — it was causing 500 errors
// app.use(rateLimiter);

// Routes
app.use("/api/notes", NotesRouter);

// Connect to MongoDB
connectionDB().then(() => {
  app.listen(PORT, () => {
    console.log('Server is running on PORT:', PORT);
  });
});
