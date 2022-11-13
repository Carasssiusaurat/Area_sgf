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
const router = express.Router();

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
    callbackURL: "http://127.0.0.1:8080/service/github/auth/callback",
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    return done(null, {accessToken, refreshToken, profile});
  }
));

const github_auth = async (req, res, next) => {
  const GITHUB_SCOPES = [ 'user:email', 'public_repo', 'repo', 'read:user', 'user:follow' ];
  passport.authenticate('github', {scope: GITHUB_SCOPES, showDialog: true, state: "token=" + req.query.token + ",serviceid=" + req.query.service_id})(req, res, next); 
}

router.get('/auth', github_auth);

router.get('/auth/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  async function(req, res) {
    console.log(req.user);
    const user_id = req.query.state.split(",")[0].split("=")[1];
    const service_id = req.query.state.split(",")[1].split("=")[1];
    console.log(req.user.accessToken)
    response = await addservice_copy(user_id, service_id, req.user.accessToken, req.user.refreshToken, null);
    console.log(response);
    if (response.status != 200) {
      console.log("error");
      console.log(response.message)
    }
    console.log("Github service added");
    res.redirect('http://localhost:8081/home');
  });

    const fork_repo = async (args, token, user, service_action_id) =>
    {
      const body_json =
      {"name" : args[0]};
      //
      const rawResponse = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token[0],
        },
        body : JSON.stringify(body_json)
      });
      console.log("token =" + token[0]);
      const content = await rawResponse.json();
      console.log(content);
      return true
    }

    const follow_user = async(args, token, user, service_action_id) =>
    {
      const rawResponse = await fetch('https://api.github.com/user/following/' + args[0], {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token[0],
        }
      });
      console.log(rawResponse);
      return true;
    }

    const unfollow_user = async (args, token, user, service_action_id) =>
    {
      const rawResponse = await fetch('https://api.github.com/user/following/' + args[0], {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token[0],
        }
      });
      return true;
    }


    // check if i follow user
  const receive_following = async (args, token) => {
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
      if (content[i].login === args)
        return true;
    };
    return false;
  }

const IsFollower = async (args, token, user, service_action_id) => {
  const data = await receive_following(args[0], token[0]);

  console.log(data);
}

const check_follower = async (userName) =>{
  const rawResponse = await router.get('https://api.github.com/user/following/' + userName, {
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
  const data = await check_follower(req.body.args[0]);
  console.log(data);
}

router.get('/followers', IsFollower);

router.get('/imfollowing', ImFollowing);


// create a repo
  router.get('/user/repos',
  function(req, res){
    fork_repo(req.body.args[0], req.body.token).then(function(data) {console.log(data)});
    res.redirect("/");
    return res;
  });

// follow user
router.get('/user/follow',
function(req, res){
  follow_user(req.body.args[0], req.body.token).then(function(data) {console.log(data)});
  res.redirect("/");
  return res;
});

// unfollow user
router.get('/user/unfollow',
function(req, res){
  unfollow_user(req.body.args[0], req.body.token).then(function(data) {console.log(data)});
  res.redirect("/");
  return res;
});

//check if user is following
router.get('/following/check',
function(req, res){
  check_follower(req.body.args[0], req.body.token).then(function(data) {console.log(data)});
  res.redirect("/");
  return res;
});

module.exports = {router, check_follower, receive_following, fork_repo, follow_user, unfollow_user};