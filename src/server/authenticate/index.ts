import { callback, redirect } from "./google"
import { setResponseData } from "../utils"

const google = {
  callback,
  redirect,
}

const logout = (req, res) => {
  req.session.destroy(error => {
    if (error) console.warn(error)

    setResponseData(res, "")
  })
}

export { google, logout }
