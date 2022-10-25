const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors');
const port = 3000;
const passport = require('passport');
const InstagramStrategy = require('passport-instagram').Strategy;

require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
done(null, obj);
})

passport.use(new InstagramStrategy(
  {
    clientID: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET, 
    callbackURL: 'http://localhost:3000/auth/instagram/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ instagramId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

app.get('/auth/instagram', passport.authenticate('instagram'));

app.get('/auth/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("successfuly connected to instagram");
    // Successful authentication, redirect home.
//    res.redirect('/');
  }
);

app.get('/instagram/deleteinfos', (req, res) => {
    console.log("delete infos");
})

app.get('/instagram/deletedonnees', (req, res) => {
  console.log("delete donnees");
})