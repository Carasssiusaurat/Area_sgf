var express = require('express');
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var GITHUB_CLIENT_ID = "9068800ddbf3fc24a235";
var GITHUB_CLIENT_SECRET = "55ec6d8dea94231496e06d502a672b922a0358a4";
var session = require('express-session');
const fetch = require("node-fetch");
const { raw } = require('express');
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


async function functiontest(link) {
    var reponse = await fetch(link);

    if (reponse.status == 200)
        return await reponse.json();
    return null;
}

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
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

class Github{
    constructor(accessToken, pseudo){
        this.pseudo = pseudo;
        this.accessToken = accessToken
    }

    async receive_followers()
    {
      const rawResponse = await fetch('https://api.github.com/user/followers', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + this.accessToken,
        }
      });
      const content = await rawResponse.json();
      console.log(content);
      return true;
    }

    async create_repo(repoMaster, repoName, json_call)
    {
      const rawResponse = await fetch('https://api.github.com/repos/${repoMaster}/${repoName}/forks', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + this.accessToken,
        },
        body: json_call
      });
      const content = await rawResponse.json();
      return true
    }

    async follow_user(userName)
    {
      const rawResponse = await fetch('https://api.github.com/user/following/${userName}', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + this.accessToken,
        }
      });
      const content = await rawResponse.json();
      console.log(content);
      return true;
    }

    async unfollow_user(userName)
    {
      const rawResponse = await fetch('https://api.github.com/user/following/${userName}', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + this.accessToken,
        }
      });
      const content = await rawResponse.json();
      console.log(content);
      return true;
    }

    async create_issue(repoMaster, repoName)
    {
      const rawResponse = await fetch('https://api.github.com/repos/${repoMaster}/${repoName}/issues', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + this.accessToken,
        },
        title: 'Found a bug',
        body: 'this is not normal'
      });
      const content = await rawResponse.json();
      console.log(content);
      return true;
    }
}

app.get('/github/followers',
  function(req, res){
    github.receive_followers().then(function(data) {console.log(data)});
    res.redirect("/");
    return res;
  });


// new Github(accessToken, pseudo).getNames().then(function(data) {
//     for (let i = 0; i < data.length; i ++)
//         console.log(data[i]);
// })/