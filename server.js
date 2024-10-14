const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001; // Changed from 5000 to 5001

const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply to all requests
app.use(apiLimiter);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
const authRoutes = require("./routes/auth");
const spotifyRoutes = require("./routes/spotify");
const youtubeRoutes = require("./routes/youtube");

app.use("/api/auth", authRoutes);
app.use("/api/spotify", spotifyRoutes);
app.use("/api/youtube", youtubeRoutes);

//TEST for backend and DB 
// app.get("/api/test", (req, res) => {
//   res.json({ message: "Backend is working!" });
// });
// app.get('/api/db-test', async (req, res) => {
//   try {
//     await mongoose.connection.db.admin().ping();
//     res.json({ message: 'Database connected successfully!' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Database connection failed' });
//   }
// });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
