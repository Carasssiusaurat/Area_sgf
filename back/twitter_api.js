const passport = require('passport');
const Router = require('express').Router;

const TwitterStrategy = require('passport-twitter').Strategy;

passport.use(
    new TwitterStrategy({
        consumerKey: 'consumerKey',
        consumerSecret: 'consumerSecret',
        callbackURL: 'http://localhost:3000/twitter/auth/callback'
    })
)