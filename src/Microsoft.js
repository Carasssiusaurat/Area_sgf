var express = require('express');
var passport = require('passport');
var MicrosoftStrategy = require('passport-microsoft').Strategy;
var MICROSOFT_CLIENT_ID = "9945850a-6995-40ef-b4f7-c513a395d442"
var MICROSOFT_CLIENT_SECRET = "6-E8Q~eL8QBzby5.sqmIO4JyYfqlegy3VG1kQaL7"
var session = require('express-session');
const fetch = require("node-fetch");
let microsoft;
const app = express();

app.use(session({
  secret: 'SECRET', resave: true,
  saveUninitialized: true
}));

app.listen(8080, () => {
  console.log('Serveur en écoute sur le port 8080');
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(new MicrosoftStrategy({
  clientID: MICROSOFT_CLIENT_ID,
  clientSecret: MICROSOFT_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/service/microsoft/auth/callback",
},
  function (accessToken, refreshToken, profile, done) {
    microsoft = new Microsoft(accessToken, "jaredhanson");
    console.log(profile);
    return done(null, profile);
  }
));

app.get('/auth/microsoft',
  passport.authenticate('microsoft', { scope: ['user.read'] }));

app.get('/microsoft/auth/callback',
  passport.authenticate('microsoft', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  });

class Microsoft {
  constructor(accessToken, pseudo) {
    this.pseudo = pseudo;
    this.accessToken = accessToken
  }

  async list_projects_starrers(project_id, nb_starrers) {
    const rawResponse = await fetch('https://gitlab.com/api/v4/projects/' + project_id + '/starrers', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.accessToken,
      }
    });
    const content = await rawResponse.json();
    if (content.length > nb_starrers)
      return {status: "success"};
    return {status: "fail"};
  }

  async star_project(project_id) {
    const rawResponse = await fetch('https://gitlab.com/api/v4/projects/' + project_id + '/star', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.accessToken,
      }
    });
    if (rawResponse.status === 304)
      return true;
    return false;
  }
}

app.get('/gitlab/todos',
  function (req, res) {
    gitlab.star_project("").then(function (data) { console.log(data) });
    res.redirect("/");
    return res;
  });

app.get('/gitlab/projects',
  function (req, res) {
    gitlab.list_projects_starrers("", 5).then(function (data) { console.log(data) });
    res.redirect("/");
    return res;
  });