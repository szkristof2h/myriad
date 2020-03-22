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
    .then(r => {
      const clean = sanitizeHtml(r.data, {
        allowedTags: ["img"],
      })
      res.send(clean)
    })
    .catch(e => {
      handleErrors("Couldn't load images from the url", e)
      return res.json({})
    })
}

const getUserInfo = (req, res, next) => {
  if (req.user)
    User.findById(req.user, (e, u) => {
      if (u)
        res.locals.user = {
          displayName: u.displayName,
          firstName: u.firstName,
          lastName: u.lastName,
          id: u.id,
        }
      next()
    })
  else next()
}

const authenticate = (req, res, next) => {
  if (res.locals && res.locals.user)
    if (!res.locals.user.displayName)
      return res.json(
        handleErrors("No display name", {
          errors: {
            displayName: {
              message:
                "You have to first set your display name on your profile!",
            },
          },
        })
      )
    else next()
  else
    return res.json(
      handleErrors(NOT_LOGGED_IN, {
        errors: {
          user: { message: "You should be logged in for this feature!" },
        },
      })
    )
}

app.use(getUserInfo)

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

app.get("/test", async () => {
  console.log("testing it")
  await timeout(1000)
  console.log("waited!")
})

// Routes
app.post("/get/images", authenticate, getSiteImages)

app.get("/get/tags", getTags)

app.get("/get/notifications/:skip/:limit", authenticate, getNotifications)
app.get("/get/posts/user/:userId", getPosts)
app.get("/get/posts/:tags", getPosts)
app.get("/get/posts", getPosts)
app.get("/get/post/:_id", getPost)
app.post("/post/post", authenticate, postPost)
app.post("/post/post/rating", authenticate, postRating)

app.get("/get/profile", getUser)
app.get("/get/user/:name", getUser)
app.get("/get/user", getUser)
app.put("/put/user/profile", updateProfile)
app.put("/put/user/displayName", setDisplayName)
app.get("/get/user/displayName/:displayName", checkDisplayName)
app.post("/post/user/block", authenticate, block)
app.post("/post/user/unblock", authenticate, unblock)
app.post("/post/user/follow", authenticate, follow)
app.post("/post/user/unfollow", authenticate, unfollow)

app.get("/get/comments/:postedOn/:skip/:limit", getComments)
app.get("/get/messages/:skip/:limit", authenticate, getConversations)
app.get("/get/message/:from/:skip/:limit", authenticate, getMessages)
app.post("/post/comment", authenticate, postComment)
app.post("/post/message", authenticate, postMessage)

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
    compiler.outputFileSystem.readFile(filename, function(err, result) {
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
