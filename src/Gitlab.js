var express = require('express');
var passport = require('passport');
var GitLabStrategy = require('passport-gitlab2').Strategy;
var session = require('express-session');
const fetch = require("node-fetch");
let gitlab;
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

passport.use(new GitLabStrategy({
  clientID: GITLAB_CLIENT_ID,
  clientSecret: GITLAB_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/gitlab/auth/callback"
},
  function (accessToken, refreshToken, profile, done) {
    gitlab = new Gitlab(accessToken, "jaredhanson");
    console.log(profile);
    return done(null, profile);
  }
));

app.get('/auth/gitlab',
  passport.authenticate('gitlab', { scope: ['api'] }));

app.get('/gitlab/auth/callback',
  passport.authenticate('gitlab', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  });

class Gitlab {
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
    const content = await rawResponse.json();
    return true;
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