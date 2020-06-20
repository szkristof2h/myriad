import { callback, redirect } from "./google"

const google = {
  callback,
  redirect,
}

const logout = (req, res) => {
  req.session.destroy(error => {
    if (error) console.warn(error)
    res.redirect("/")
  })
}

export { google, logout }
