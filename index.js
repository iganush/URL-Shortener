import express from "express";
import dotenv from "dotenv";
import ConnectionDB from "./connect.js";
import URL from "./models/url.js";
import cookieParser from "cookie-parser";
import { restrictToLoggedInUserOnly,CheckAuth } from "./middleware/auth.js"

// routes

import urlRouter from "./routes/url.js";
import staticRoute from './routes/staticRouter.js'
import UserRoute from './routes/user.js'

import path from 'path'
dotenv.config();
 
const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB = process.env.MONGODB_URL;

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended :false}))
app.use(cookieParser())

ConnectionDB(MONGODB)
  .then(() => console.log("DB Server Started"))
  .catch((err) => console.log(err));

// ejs
  app.set("view engine","ejs")
  app.set("views", path.resolve("./views"))
// API routes



app.use("/url",restrictToLoggedInUserOnly, urlRouter);
app.use('/', CheckAuth, staticRoute)
app.use('/user',UserRoute)

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
