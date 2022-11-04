const express = require("express");
const app = express();
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var passport = require('passport');
var session = require('express-session');
const { application } = require("express");
let LinkedIn;

app.use(session({ secret: 'SECRET' }));

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

passport.use(new LinkedInStrategy({
    clientID: "78z992805lhqaa",
    clientSecret: "Kl5xLH7sKuWP7ONR",
    callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social'],
    sessions : false,
  }, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {  
      LinkedIn = new Linkedin(accessToken, profile.id);
      return done(null, profile);
    });
  }));


class Linkedin{
  constructor(accessToken, id) {
    this.accessToken = accessToken;
    this.id = id;
  }
  async send_message(text){
    let  json_call = `{
      "author": "` + "urn:li:person:" + this.id + `",
      "lifecycleState": "PUBLISHED",
      "specificContent": {
          "com.linkedin.ugc.ShareContent": {
              "shareCommentary": {
                  "text": "` + text + `"
              },
              "shareMediaCategory": "NONE"
          }
      },
      "visibility": {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    }`;
    this.send_data(json_call);
  }
  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
 async send_data(json_call)
 {
  const rawResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.accessToken,
      },
      body: json_call
    });
    const content = await rawResponse.json();
    console.log(content);
    return true;
  }
}


app.get('/linkedin/send',
  function(req, res){
    LinkedIn.send_message("Test message pour Arthur");
    res.redirect("/");
    return res;
  });

app.listen(3000, () => {
    console.log('Serveur en écoute sur le port 3000');
});

app.get('/auth/linkedin',
  passport.authenticate('linkedin', { state: 'SOME STATE'  }),
  function(req, res){
    return res;
  });


  app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

