import mongoose from "mongoose"
import session from "express-session"

const MongoStore = require("connect-mongo")(session)
const url =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO
    : process.env.MONGO_DEV

export default app => {
  mongoose.connect(`${url}`, { useNewUrlParser: true, dbName: "myriad" }, e => {
    if (e) console.log("Error connecting mongo database:" + e)
    else console.log("Connected to mongo database")
  })

  app.use(
    session({
      resave: false,
      cookie: { maxAge: 7 * 24 * 60 * 60000 },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET ?? "",
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
}
