import { nanoid } from "nanoid";
import URL from "../models/url.js";

export async function handleGenerateShortUrl(req, res) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "url is required" });
  }

  const shortId = nanoid(8);

  const newUrl = await URL.create({
    shortId,
    redirectURL: url,
    visitHistory: [],
  });


  return res.render('home',{id:shortId})

  return res.status(201).json({
    shortId,
    redirectURL: newUrl.redirectURL,
  });
}

export async function handleGetAnalytics(req, res) {
  const { shortId } = req.params;

  const result = await URL.findOne({ shortId });

  if (!result) {
    return res.status(404).json({ message: "Short URL not found" });
  }

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}
