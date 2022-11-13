var express = require('express');
var passport = require('passport');
var GitLabStrategy = require('passport-gitlab2').Strategy;
var session = require('express-session');
const fetch = require("node-fetch");
let gitlab;
const app = express();
const {addservice_copy} = require('../controllers/userController');

const router = express.Router();

app.use(session({
  secret: 'SECRET', resave: true,
  saveUninitialized: true
}));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(new GitLabStrategy({
  clientID: process.env.GITLAB_CLIENT_ID,
  clientSecret: process.env.GITLAB_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/service/gitlab/auth/callback",
  passReqToCallback: true
},
  function (req, accessToken, refreshToken, profile, done) {
    return done(null, {accessToken, refreshToken, profile});
  }
));

const gitlab_auth = async (req, res, next) => {
  const GITLAB_SCOPES = ['api'];
  passport.authenticate('gitlab', {scope: GITLAB_SCOPES, showDialog: true, state: "token=" + req.query.token + ",serviceid=" + req.query.service_id})(req, res, next);
}

router.get('/auth', gitlab_auth);

router.get('/auth/callback',
  passport.authenticate('gitlab', { failureRedirect: '/login'}),
  async function(req, res) {
    const user_id = req.query.state.split(",")[0].split("=")[1];
    const service_id = req.query.state.split(",")[1].split("=")[1];
    response = await addservice_copy(user_id, service_id, req.user.accessToken, req.user.refreshToken, null);
    if (response.status != 200) {
      console.log("error");
      console.log(response.message)
    }
    console.log("GitLab service added");
    res.redirect('http://localhost:8081/home');
  });

const list_projects_stars = async (args, token, user, service_action_id) => {
    const rawResponse = await fetch('https://gitlab.com/api/v4/projects/' + args[0] + '/starrers', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token[0],
      }
    });
    const content = await rawResponse.json();
    if (content.length > agrs[1])
      return {status: "success"};
    return {status: "fail"};
  }

const star_project = async (args, token, user, service_action_id) => {
    const rawResponse = await fetch('https://gitlab.com/api/v4/projects/' + args[0] + '/star', {
      method: 'GET',
      headers: {
        // 'Authorization': `Bearer ${token[0]}`,
        'Authorization': 'Bearer ' + token[0],
      }
    });
    if (rawResponse.status === 304)
      return {status: "success"};
    return {status: "fail"};
  }

// router.get('/gitlab/todos',
//   function (req, res) {
//     gitlab.star_project("").then(function (data) { console.log(data) });
//     res.redirect("/");
//     return res;
//   });

// router.get('/gitlab/projects',
//   function (req, res) {
//     gitlab.list_projects_starrers("", 5).then(function (data) { console.log(data) });
//     res.redirect("/");
//     return res;
//   });

module.exports = { router, star_project, list_projects_stars };