import mongoose from "mongoose"
import session from "express-session"

const MongoStore = require("connect-mongo")(session)

export default app => {
  mongoose.connect(
    `${process.env.MONGO}`,
    { useNewUrlParser: true, dbName: "myriad" },
    e => {
      if (e) console.log("Error connecting mongo database:" + e)
      else console.log("Connected to mongo database")
    }
  )

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
