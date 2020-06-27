import { Request, Response, NextFunction } from "express"
import sanitizeHtml from "sanitize-html"
import axios from "axios"
import { handleErrors, setErrorType } from "./utils"
import {
  getPosts,
  getPost,
  getTags,
  postRating,
  postPost,
  getNotifications,
} from "./db/controllers/post"
import {
  getComments,
  getConversations,
  getMessages,
  postComment,
  postMessage,
} from "./db/controllers/comment"
import {
  setDisplayName,
  getUser,
  block,
  unblock,
  follow,
  unfollow,
  updateProfile,
  checkDisplayName,
} from "./db/controllers/user"
import { google, logout } from "./authenticate"
import User from "./db/models/User"

export const init = app => {
  const getSiteImages = async (req: Request, res: Response) => {
    setErrorType(res, "GET_SITE_IMAGES")
    const response = await axios.get(req.body.url)
    const clean = sanitizeHtml(response.data, {
      allowedTags: ["img"],
    })

    res.send(clean)
  }

  // const getUserInfo = (req, res, next) => {
  //   if (!req.user || req.user.id) next()

  //   const user = User.findById(req.user.id).lean().exec()

  //   if (!user) next()

  //   req.user = {
  //     displayName: user.displayName,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     id: user.id,
  //   }

  //   next()
  // }
  // app.use(getUserInfo)

  const authenticate = (req: Request, res: Response, next: NextFunction) => {
    if (req.user)
      if (!req.user.displayName) throw Error("NO_DISPLAYNAME")
      else next()
    else throw Error("NOT_LOGGED_IN")
  }
  app.get("/check", (req: Request, res: Response) => {
    console.log(req.session)

    res.json(req.user)
  })

  app.get("/auth/google", google.redirect)
  app.get("/auth/google/callback", google.callback)
  app.postAsync("/post/logout", logout)

  // Routes
  app.postAsync("/get/images", authenticate, getSiteImages)

  app.getAsync("/get/tags", getTags)

  app.getAsync(
    "/get/notifications/:skip/:limit",
    authenticate,
    getNotifications
  )
  app.getAsync("/get/posts/user/:userId", getPosts)
  app.getAsync("/get/posts/:tags", getPosts)
  app.getAsync("/get/posts", getPosts)
  app.getAsync("/get/post/:id", getPost)
  app.postAsync("/post/post", authenticate, postPost)
  app.postAsync("/post/post/rating", authenticate, postRating)

  app.getAsync("/get/profile", getUser)
  app.getAsync("/get/user/:name", getUser)
  app.getAsync("/get/user", getUser)
  app.postAsync("/post/user/profile", authenticate, updateProfile)
  app.getAsync("/get/user/displayName/:displayName", checkDisplayName)
  app.postAsync("/post/user/block", authenticate, block)
  app.postAsync("/post/user/unblock", authenticate, unblock)
  app.postAsync("/post/user/follow", authenticate, follow)
  app.postAsync("/post/user/unfollow", authenticate, unfollow)

  app.getAsync("/get/comments/:idParent/:skip/:limit", getComments)
  app.getAsync("/get/messages/:skip/:limit", authenticate, getConversations)
  app.getAsync("/get/message/:id/:skip/:limit", authenticate, getMessages)
  app.postAsync("/post/comment", authenticate, postComment)
  app.postAsync("/post/message", authenticate, postMessage)
}
