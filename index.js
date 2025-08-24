const express = require('express');
const { connectToMongoDB } = require('./connect.js');
require('dotenv').config();
const urlRoute = require('./routes/url.js');
const staticRoute = require('./routes/url.js');
const path = require('path');
const app = express();
const PORT = 8000;
const dbUrl = process.env.MONGODB_URI;
// Connect to MongoDB
connectToMongoDB(dbUrl)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting the view engine to EJS
app.set("view engine", "ejs");
app.set('views', path.resolve('./views'));

// Routes
// This sends all API-related calls for URLs to the urlRoute.
app.use('/url', urlRoute);
// This sends all static pages (like the homepage) to the staticRoute.
app.use('/', staticRoute);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});