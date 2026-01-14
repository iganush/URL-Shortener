import { v4 as uuidv4 } from "uuid"
import * as auth from "../service/auth.js"
import User from '../models/user.js'
async function handleUserSignUp(req,res) {
    const {name,email,password} = req.body
    await User.create({
        name,
        email,
        password,
    })
    return res.render("/")
    
}
 async function handleUserLogin(req,res) {
    const {email,password} = req.body
 const user = await User.findOne({ email,password })
  if (!user) {
    return res.render("login", {
      error: "Invalid Email or Password",
    })
  }


const sessionId = uuidv4()

auth.setUser(sessionId, {
  _id: user._id,
  email: user.email,
})

res.cookie("uid", sessionId, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
})

return res.redirect("/")

}

export default { 
    handleUserSignUp,
     handleUserLogin
 }
