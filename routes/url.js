const express = require('express');
const { handleGenerateNewShortURL, handleGetAnalytics } = require('../controllers/url');
const URL = require('../models/url'); // Import the URL model

const router = express.Router();

// Define a POST route for creating a new short URL
router.post('/', handleGenerateNewShortURL);

// Define a GET route for getting analytics of a short URL
router.get('/analytics/:shortId', handleGetAnalytics);

// This is the core redirect route, which now lives here.
router.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: { timeStamp: Date.now() },
        },
      }
    );

    if (!entry) {
      return res.status(404).send("URL not found");
    }

    res.redirect(entry.redirectURL);
  } catch (err) {
    console.error("Error during redirection:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;