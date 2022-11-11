const express = require("express");
const app = express();
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var passport = require('passport');
var session = require('express-session');
require('dotenv').config()
let LinkedIn;



app.use(passport.initialize());
app.use(passport.session());
app.use(session({ secret: 'SECRET' }));

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social'],
    sessions : false,
  }, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      LinkedIn = new Linkedin(accessToken, profile.id, JSON.parse(profile._raw).firstName.preferredLocale.country);
      return done(null, profile);
    });
  }));


class Linkedin{

  constructor(accessToken, id, country) {
    this.accessToken = accessToken;
    this.id = id;
    this.country = country;
  }

  async send_localisation(){
    return country;
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
    if (content.message != null){
      return true;
    }
    return false;
  }
}

app.get('/linkedin/country', 
function(req, res){
  let location = LinkedIn.send_localisation();
  res.send(location);
});

app.get('/linkedin/send',
  function(req, res){
    LinkedIn.send_message(req.params["message"]);
    res.send("true");
  });


app.listen(8080, () => {
    console.log('Serveur en écoute sur le port 8080');
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

