import { Request, Response, NextFunction } from "express"
import isURL from "validator/lib/isURL"
import sanitizeHtml from "sanitize-html"
import axios from "axios"
import { setErrorType, setResponseData } from "./utils"
import {
  addRating,
  getPosts,
  getPost,
  getTags,
  postPost,
  getNotifications,
  getRating,
  getRatings,
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

export const init = app => {
  const getSiteImages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    setErrorType(res, "GET_SITE_IMAGES")

    if (!req.body.url || !isURL(req.body.url)) {
      setResponseData(res, {
        error: {
          shouldShow: true,
          type: "submit",
          message: "The url you provided isn't valid!",
        },
      })

      return next()
    }

    // TODO: make this work not just for urls that end with file extensions; this method is prone to errors
    if (req.body.url.match(/\.(jpeg|jpg|gif|png)$/) != null)
      setResponseData(res, { html: `<img src="${req.body.url}" />` })
    else {
      const response = await axios.get(req.body.url)
      const cleanHTML = sanitizeHtml(response.data, {
        allowedTags: ["img"],
      })

      setResponseData(res, { html: cleanHTML })
    }
  }

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
  app.postAsync("/get/media/:url", authenticate, getSiteImages)

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
  app.getAsync("/get/rating/:idPost", getRating)
  app.postAsync("/get/ratings", getRatings)
  app.postAsync("/post/addPost", authenticate, postPost)
  app.postAsync("/post/addRating", authenticate, addRating)

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
