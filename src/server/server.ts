import path from "path"
import express from "express"
import { addAsync } from "@awaitjs/express"
import bodyParser from "body-parser"
import connect from "./connect"
import { handleErrors } from "./utils"
import { init as initRoutes } from "./routes"

const app = addAsync(express())

console.log(`---------------------------------------`)
console.log(`Started in ${process.env.NODE_ENV} mode`)
console.log(`---------------------------------------`)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

connect(app) // connect to mongoDB and set up mongo session store

app.use((req, res, next) => {
  if (req.session?.tokens) {
    req.user = { ...req.session.user }
  }

  next()
})

initRoutes(app)

app.use(handleErrors)
app.use((req, res, next) => {
  const { dataToSendBack } = res

  if (dataToSendBack) {
    res.json(dataToSendBack)
  } else next()
})

// Webpack
if (process.env.NODE_ENV !== "production") {
  // Use webpack-dev-middleware if in development mode
  const webpack = require("webpack")
  const webpackConfig = require("../webpack/webpack.dev")

  const compiler = webpack(webpackConfig)

  app.use(
    require("webpack-dev-middleware")(compiler, {
      publicPath: "/",
    })
  )

  // Webpack-dev-middleware doesn't create file, but stores them in memory
  app.use("*", (req, res, next) => {
    const filename = path.join(compiler.outputPath, "index.html")
    compiler.outputFileSystem.readFile(filename, (err, result) => {
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

const DIST_DIR = path.join(__dirname, "..", "dist")
const HTML_FILE = path.join(DIST_DIR, "index.html")
const PORT = process.env.PORT || 3000

app.use(express.static(DIST_DIR))

app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`)
})

app.get("*", (req, res) => {
  res.sendFile(HTML_FILE)
})
