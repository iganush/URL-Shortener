const express = require('express');
const router = express.Router();
const URL = require('../models/url');

router.get('/', async (req, res) => {
  try {
    const allurls = await URL.find({});
    return res.render('home', {
      urls: allurls.reverse(), // Show latest URLs first
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('An error occurred');
  }
});

module.exports = router;