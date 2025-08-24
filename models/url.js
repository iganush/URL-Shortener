const mongoose = require('mongoose');

// Define the URL schema
const urlSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true,
  },
  redirectURL: {
    type: String,
    required: true,
  },
  visitHistory: [{ timeStamp: { type: Number } }],
}, { timestamps: true });

// Create the model from the schema
const URL = mongoose.model('URL', urlSchema);

module.exports = URL;