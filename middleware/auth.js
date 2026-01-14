import { getUser } from "../service/auth.js"

// Sirf logged-in users ke liye
export function restrictToLoggedInUserOnly(req, res, next) {
  const sessionId = req.cookies?.uid
  if (!sessionId) return res.redirect("/login")

  const user = getUser(sessionId)
  if (!user) return res.redirect("/login")

  req.user = user
  next()
}

// Optional auth check 
export function CheckAuth(req, res, next) {
  const sessionId = req.cookies?.uid
  if (!sessionId) return next()

  const user = getUser(sessionId)
  if (user) req.user = user

  next()
}
