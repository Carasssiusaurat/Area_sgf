var express = require('express');
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var session = require('express-session');
const fetch = require("node-fetch");
const { raw } = require('express');
const { use } = require('passport');
const app = express();
const {addservice_copy} = require('../controllers/userController');
const fs = require('fs');
const axios = require('axios');

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

    const receive_following = async (userName, token) =>
    {
      const rawResponse = await fetch('https://api.github.com/user/following', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      });
      const content = await rawResponse.json();
      console.log(content);
      for (var i = 0; i != content.done; i++) {
        if (content.user === userName)
          return true;
      };
      console.log(content);
      return false;
    }

    const fork_repo = async (repoName, token) =>
    {
      const body_json =
      {"name" : repoName};
      //
      const rawResponse = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
        body : JSON.stringify(body_json)
      });
      const content = await rawResponse.json();
      console.log(content);
      return true
    }

    const follow_user = async(userName, token) =>
    {
      const rawResponse = await fetch('https://api.github.com/user/following/' + userName, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      });
      return true;
    }

    const unfollow_user = async (userName, token) =>
    {
      const rawResponse = await fetch('https://api.github.com/user/following/' + userName, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      });
      return true;
    }


  const receive_followers = async (userName, token) => {
    const rawResponse = await fetch('https://api.github.com/user/followers', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    });
    const content = await rawResponse.json();
    fs.writeFileSync('followers.json', JSON.stringify(content));
    for (var i = 0; i != content.length; i++) {
      console.log(content[i].login);
      if (content[i].login === userName)
        return true;
    };
    return false;
  }

const IsFollower = async (req, res) => {
  const data = await receive_followers(req.body.args[0], req.body.token);

  console.log(data);
}

const check_following = async (userName) =>{
  const rawResponse = await axios.get('https://api.github.com/user/following/' + userName, {
    headers: {
      Authorization: 'Bearer ' + this.accessToken,
    }
  }).then((response) => {
//    console.log(response);
  }).catch((error) => {});
  //console.log(rawResponse);
  //if (rawResponse.status === 204)
  //  return true;
  //else if (rawResponse.status === 404)
  //  return false;
}

const ImFollowing = async (req, res) => {
  const data = await check_following(req.body.args[0]);
  console.log(data);
}

app.get('/getfollowers', IsFollower);

app.get('/imfollowing', ImFollowing);

  app.get('/github/following',
  function(req, res){
    console.log(req.query.token);
    receive_following(req.body.args[0], req.body.token).then(function(data) {console.log(data)});
    res.redirect("/");
    return res;
  });

  app.get('/github/user/repos',
  function(req, res){
    fork_repo(req.body.args[0], req.body.token).then(function(data) {console.log(data)});
    res.redirect("/");
    return res;
  });
  
  app.get('/github/repo/issues',
  function(req, res){
    create_issue(req.body.args[0], req.body.token).then(function(data) {console.log(data)});
    res.redirect("/");
    return res;
  });

app.get('/github/user/follow',
function(req, res){
  follow_user(req.body.args[0], req.query.token).then(function(data) {console.log(data)});
  res.redirect("/");
  return res;
});

app.get('/github/user/unfollow',
function(req, res){
  unfollow_user(req.body.args[0], req.body.token).then(function(data) {console.log(data)});
  res.redirect("/");
  return res;
});

app.get('/github/following/check',
function(req, res){
  check_following(req.body.args[0], req.body.token).then(function(data) {console.log(data)});
  res.redirect("/");
  return res;
});

module.exports = app;