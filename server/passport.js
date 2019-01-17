import passport from 'passport';
import User from './db/models/User';
// import { clientId, clientSecret } from './secret';

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

export default app => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User
      .findById(id)
      .then(user => done(null, user.id));
  });

  passport.use(new GoogleStrategy({
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: process.env.SITE_URL ? `${process.env.SITE_URL}auth/google/callback`
      : "http://localhost:8080/auth/google/callback"
  },
    (token, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id })
        .exec()
        .then(user => {
          if (user) return user;
          const newUser = new User({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            googleId: profile.id
          });

          return newUser.save();
        })
        .then(user => done(null, user))
        .catch(e => console.log('login error: ' + e));
    })
  );

  // Auth routes
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
  }));

  app.get('/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/login/failed'
    }),
    (req, res) => {
      res.redirect('/profile');
    }
  );
  
  app.get('/logout', (req, res) => {
    req.session.destroy(e => {
      if (e) console.warn(e);
      res.redirect('/');
    });
  });
};