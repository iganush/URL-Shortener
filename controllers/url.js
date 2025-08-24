const { nanoid } = require('nanoid');
const URL = require('../models/url');
const validator = require('validator');

// Handle POST request to generate a new short URL
async function handleGenerateNewShortURL(req, res) {
  const body = req.body;

  // Check if URL is provided and if it's a valid format
  if (!body.url || !validator.isURL(body.url, { require_protocol: true })) {
    return res.status(400).render('home', {
      error: 'Please enter a valid URL, including http:// or https://',
      urls: (await URL.find({})).reverse(), // Pass URLs back to the view
    });
  }

  try {
    // Generate a unique 8-character short ID
    const shortID = nanoid(8);

    // Save the new URL entry to the database
    await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
    });

    // Send back the short ID and all URLs by rendering the home page
    return res.render('home', {
      id: shortID,
      urls: (await URL.find({})).reverse(), // Pass all URLs to the template
    });
  } catch (err) {
    console.error("Error creating short URL:", err);
    return res.status(500).render('home', {
      error: 'An internal server error occurred while creating the URL.',
      urls: (await URL.find({})).reverse(),
    });
  }
}

// Handle GET request to get analytics for a short URL
async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;

  const result = await URL.findOne({ shortId });
  
  if (!result) {
    return res.status(404).json({ error: 'URL not found' });
  }

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};