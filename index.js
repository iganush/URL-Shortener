import express from "express";
import dotenv from "dotenv";
import urlRouter from "./routes/url.js";
import ConnectionDB from "./connect.js";
import URL from "./models/url.js";
import staticRoute from './routes/staticRouter.js'
import path from 'path'
dotenv.config();
 
const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB = process.env.MONGODB_URL;

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended :false}))

ConnectionDB(MONGODB)
  .then(() => console.log("DB Server Started"))
  .catch((err) => console.log(err));

// ejs
  app.set("view engine","ejs")
  app.set("views", path.resolve("./views"))
// API routes
app.use("/url", urlRouter);
app.use('/', staticRoute)

// app.get('/test', async (req,res)=>{
//   const allUrls =await URL.find({})
//   res.render("home",{
//     urls:allUrls,
//   })
// })


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
