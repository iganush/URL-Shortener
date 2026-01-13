import express from "express";
import dotenv from "dotenv";
import urlRouter from "./routes/url.js";
import ConnectionDB from "./connect.js";
import URL from "./models/url.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB = process.env.MONGODB_URL;

ConnectionDB(MONGODB)
  .then(() => console.log("DB Server Started"))
  .catch((err) => console.log(err));

app.use(express.json());

// API routes
app.use("/url", urlRouter);

// Redirect route
app.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;

  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } },
    { new: true }
  );

  if (!entry) {
    return res.status(404).send("Short URL not found");
  }

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log(`🚀 Server started at PORT ${PORT}`);
});
