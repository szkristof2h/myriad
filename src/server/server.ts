import path from "path"
import express from "express"
import { addAsync } from "@awaitjs/express"
import sanitizeHtml from "sanitize-html"
import axios from "axios"
import bodyParser from "body-parser"
import connect from "./connect"
import passportInit from "./passport"
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
import { handleErrors } from "./utils"
import { NOT_LOGGED_IN } from "./db/types"
import User from "./db/models/User"
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

const app = addAsync(express())

console.log(`-------------------`)
console.log(`Started in ${process.env.NODE_ENV} mode`)
console.log(`-------------------`)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

connect(app) // connect to mongoDB and set up mongo session store
passportInit(app) // initialize passport

const getSiteImages = (req, res) => {
  return axios
    .get(req.body.url)
    .then((r) => {
      const clean = sanitizeHtml(r.data, {
        allowedTags: ["img"],
      })
      res.send(clean)
    })
    .catch((e) => {
      throw Error("Couldn't load images from the url")
      return res.json({})
    })
}

const getUserInfo = (req, res, next) => {
  if (req.user)
    User.findById(req.user, (e, user) => {
      if (user)
        res.locals.user = {
          displayName: user.displayName,
          firstName: user.firstName,
          lastName: user.lastName,
          id: user.id,
        }
      next()
    })
  else next()
}

const authenticate = (req, res, next) => {
  if (res.locals && res.locals.user)
    if (!res.locals.user.displayName) throw Error("NO_DISPLAYNAME")
    else next()
  else throw Error("NOT_LOGGED_IN")
}

app.use(getUserInfo)

// Routes
app.postAsync("/get/images", authenticate, getSiteImages)

app.getAsync("/get/tags", getTags)

app.getAsync("/get/notifications/:skip/:limit", authenticate, getNotifications)
app.getAsync("/get/posts/user/:userId", getPosts)
app.getAsync("/get/posts/:tags", getPosts)
app.getAsync("/get/posts", getPosts)
app.getAsync("/get/post/:id", getPost)
app.postAsync("/post/post", authenticate, postPost)
app.postAsync("/post/post/rating", authenticate, postRating)

app.getAsync("/get/profile", getUser)
app.getAsync("/get/user/:name", getUser)
app.getAsync("/get/user", getUser)
app.putAsync("/put/user/profile", updateProfile)
app.putAsync("/put/user/displayName", setDisplayName)
app.getAsync("/get/user/displayName/:displayName", checkDisplayName)
app.postAsync("/post/user/block", authenticate, block)
app.postAsync("/post/user/unblock", authenticate, unblock)
app.postAsync("/post/user/follow", authenticate, follow)
app.postAsync("/post/user/unfollow", authenticate, unfollow)

app.getAsync("/get/comments/:postedOn/:skip/:limit", getComments)
app.getAsync("/get/messages/:skip/:limit", authenticate, getConversations)
app.getAsync("/get/message/:from/:skip/:limit", authenticate, getMessages)
app.postAsync("/post/comment", authenticate, postComment)
app.postAsync("/post/message", authenticate, postMessage)

app.use(handleErrors)
app.use((req, res, next) => {
  const { dataToSendBack } = res

  if (dataToSendBack) {
    console.log("sending back data")
    res.json(dataToSendBack)
  } else next()
})

// Webpack
if (process.env.NODE_ENV !== "production") {
  // Use webpack-dev-middleware if in development mode
  const webpack = require("webpack")
  const webpackConfig = require("../../../webpack/webpack.dev")

  const compiler = webpack(webpackConfig)

  app.use(
    require("webpack-dev-middleware")(compiler, {
      noInfo: true,
      publicPath: "/",
    })
  )

  // Webpack-dev-middleware doesn't create file, but stores them in memory
  app.use("*", (req, res, next) => {
    var filename = path.join(compiler.outputPath, "index.html")
    compiler.outputFileSystem.readFile(filename, function (err, result) {
      if (err) {
        return next(err)
      }

      res.set("content-type", "text/html")
      res.send(result)
      res.end()
    })
  })

  console.log(`Using webpack! (${process.env.NODE_ENV})`)
}

const DIST_DIR = __dirname
const HTML_FILE = path.join(DIST_DIR, "index.html")
const PORT = process.env.PORT || 8080

app.use(express.static(DIST_DIR))

app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`)
})

app.get("*", (req, res) => {
  res.sendFile(HTML_FILE)
})
