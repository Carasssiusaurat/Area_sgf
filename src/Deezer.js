var express = require('express');
var passport = require('passport');
var DeezerStrategy = require('passport-deezer').Strategy;
var session = require('express-session');
var DEEZER_CLIENT_ID = "566922"
var DEEZER_CLIENT_SECRET = "5e16e4dda75b642bb49b9531e4630391"
import {fetch} from 'node-fetch';
const { raw } = require('express');
const { use } = require('passport');
let deezer;
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

passport.use(new DeezerStrategy({
    clientID: DEEZER_CLIENT_ID,
    clientSecret: DEEZER_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:8080/deezer/auth/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    deezer = new Deezer(accessToken, "jaredhanson");
    console.log(profile);
    return done(null, profile);
  }
));

app.get('/auth/deezer',
  passport.authenticate('deezer', { scope: [ 'basic_access', 'email', 'offline_access', 'manage_library' ] }));

app.get('/auth/deezer/callback', 
  passport.authenticate('deezer', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

class Deezer{
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
    github.receive_following("Codrux2200").then(function(data) {console.log(data)});
    res.redirect("/");
    return res;
  });

  app.get('/github/repo/fork',
  function(req, res){
    github.fork_repo("Codrux2200", "DS").then(function(data) {console.log(data)});
    res.redirect("/");
    return res;
  });
  
  app.get('/github/repo/issues',
  function(req, res){
    github.create_issue("Codrux2200", "DS").then(function(data) {console.log(data)});
    res.redirect("/");
    return res;
  });

app.get('/github/user/follow',
function(req, res){
  github.follow_user("Codrux2200").then(function(data) {console.log(data)});
  res.redirect("/");
  return res;
});

app.get('/github/user/unfollow',
function(req, res){
  github.unfollow_user("Codrux2200").then(function(data) {console.log(data)});
  res.redirect("/");
  return res;
});

app.get('/github/following/check',
function(req, res){
  github.check_following("Codrux2200").then(function(data) {console.log(data)});
  res.redirect("/");
  return res;
});