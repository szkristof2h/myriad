import { Request, Response } from "express"
import { OAuth2Client } from "google-auth-library"
import url from "url"
import User from "../db/models/User.js"
import config from "../../app/config.js"

const siteUrl = config.url
const idClient = process.env.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET
const redirectURI = `${siteUrl}${process.env.GOOGLE_REDIRECT_URI}`
const oAuth2Client = new OAuth2Client(idClient, clientSecret, redirectURI)

export const redirect = async (req: Request, res: Response) => {
  const loginLink = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/userinfo.profile",
  })

  res.redirect(loginLink)
}

export const callback = async (req, res) => {
  const qs = new url.URL(req.url, siteUrl).searchParams
  const code: any = qs.get("code")
  const resAuth = await oAuth2Client.getToken(code)

  oAuth2Client.setCredentials(resAuth.tokens)

  const profileUrl =
    "https://people.googleapis.com/v1/people/me?personFields=names"
  const resProfile: any = await oAuth2Client.request({ url: profileUrl })
  const profile = resProfile?.data
  const user = await User.findOne({
    idGoogle: profile.resourceName.replace("people/", ""),
  })
    .lean()
    .exec()

  if (!req.session) req.session = {}

  req.session.tokens = resAuth.tokens

  if (!user) {
    const newUser = new User({
      firstName: profile.names[0].givenName,
      lastName: profile.names[0].familyName,
      idGoogle: profile.id,
    })

    newUser.save()
    req.session.user = {
      id: newUser._id,
    }
  } else {
    req.session.user = {
      id: user._id,
      displayName: user.displayName,
    }
  }

  return res.redirect("/profile")
}
