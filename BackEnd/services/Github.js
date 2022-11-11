var express = require('express');
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var session = require('express-session');
const fetch = require("node-fetch");
const { raw } = require('express');
const { use } = require('passport');
let github;
const app = express();
const {addservice_copy} = require('../controllers/userController');


app.use(session({ secret: 'SECRET', resave: true,
saveUninitialized: true}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:8080/github/auth/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    github = new Github(accessToken, "jaredhanson");
    console.log("github token : " + accessToken);
    return done(null, accessToken);
  }
));

const github_auth = async (req, res, next) => {
  const GITHUB_SCOPES = [ 'user:email', 'public_repo', 'repo', 'read:user', 'user:follow' ];
  passport.authenticate('github', {scope: GITHUB_SCOPES, showDialog: true, state: "token=" + req.query.token + ",serviceid=" + req.query.service_id})(req, res, next); 
}

app.get('/auth', github_auth);

app.get('/auth/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  async function(req, res) {
    console.log(req.user);
    const user_id = req.query.state.split(",")[0].split("=")[1];
    const service_id = req.query.state.split(",")[1].split("=")[1];
    console.log("user id = " + user_id + " service id = " + service_id);
    response = await addservice_copy(user_id, service_id, req.user);
    console.log(response);
    if (response.status != 200) {
      console.log("error");
      console.log(response.message)
    }
    console.log("Github service added");
    res.redirect('http://localhost:8081/home');
  });

class Github{
    constructor(accessToken, pseudo){
        this.pseudo = pseudo;
        this.accessToken = accessToken
    }

    async receive_followers(userName)
    {
      const rawResponse = await fetch('https://api.github.com/user/followers', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + this.accessToken,
        }
      });
      const content = await rawResponse.json();
      for (var i = 0; i != content.done; i++) {
        if (content.user === userName)
          return true;
      };
      console.log(content);
      return false;
    }

    async check_following(userName)
    {
      const rawResponse = await fetch('https://api.github.com/user/following/' + userName, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + this.accessToken,
        }
      });
      if (rawResponse.status === 204)
        return true;
      else if (rawResponse.status === 404)
        return false;
    }

    async receive_following(userName)
    {
      const rawResponse = await fetch('https://api.github.com/user/following', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + this.accessToken,
        }
      });
      const content = await rawResponse.json();
      for (var i = 0; i != content.done; i++) {
        if (content.user === userName)
          return true;
      };
      console.log(content);
      return false;
    }

    async fork_repo(repoMaster, repoName)
    {
      console.log(this.accessToken)
      const rawResponse = await fetch('https://api.github.com/repos/' + repoMaster +'/' + repoName + '/forks', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + this.accessToken,
        },
      });
      const content = await rawResponse.json();z
      return true
    }

    async follow_user(userName)
    {
      const rawResponse = await fetch('https://api.github.com/user/following/' + userName, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + this.accessToken,
        }
      });
      return true;
    }

    async unfollow_user(userName)
    {
      const rawResponse = await fetch('https://api.github.com/user/following/' + userName, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + this.accessToken,
        }
      });
      return true;
    }

    async create_issue(repoMaster, repoName)
    {
      const rawResponse = await fetch('https://api.github.com/repos/' + repoMaster +'/' + repoName + '/issues', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + this.accessToken,
        },
        title: 'Found a bug',
        body: 'this is not normal'
      });
      const content = await rawResponse.json();
      return true;
    }
}

app.get('/github/followers',
  function(req, res){
    github.receive_followers().then(function(data) {console.log(data)});
    res.redirect("/");
    return res;
  });

  app.get('/github/following',
  function(req, res){
    github.receive_following(req.params['name']).then(function(data) {console.log(data)});
    res.redirect("/");
    return res;
  });

  app.get('/github/repo/fork',
  function(req, res){
    github.fork_repo(req.params['name'], req.params['repo']).then(function(data) {console.log(data)});
    res.redirect("/");
    return res;
  });
  
  app.get('/github/repo/issues',
  function(req, res){
    github.create_issue(req.params['name'], req.params['repo']).then(function(data) {console.log(data)});
    res.redirect("/");
    return res;
  });

app.get('/github/user/follow',
function(req, res){
  github.follow_user(req.params['name']).then(function(data) {console.log(data)});
  res.redirect("/");
  return res;
});

app.get('/github/user/unfollow',
function(req, res){
  github.unfollow_user(req.params['name']).then(function(data) {console.log(data)});
  res.redirect("/");
  return res;
});

app.get('/github/following/check',
function(req, res){
  github.check_following(req.params['name']).then(function(data) {console.log(data)});
  res.redirect("/");
  return res;
});

module.exports = app;