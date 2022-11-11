var express = require('express');
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var session = require('express-session');
const fetch = require("node-fetch");
const { raw } = require('express');
const { use } = require('passport');
let github;
const app = express();

app.use(session({ secret: 'SECRET', resave: true,
saveUninitialized: true}));

app.listen(8080, () => {
  console.log('Serveur en écoute sur le port 8080');
});

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:8080/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    github = new Github(accessToken, "jaredhanson");
    console.log(profile);
    return done(null, profile);
  }
));

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email', 'public_repo', 'repo', 'read:user', 'user:follow' ] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
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