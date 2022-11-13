const express = require("express");
const app = express();
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var passport = require('passport');
var session = require('express-session');
const {addservice_copy} = require("../controllers/userController");
require('dotenv').config()
let LinkedIn;

router = express.Router();

// app.use(passport.initialize());
// app.use(passport.session());
// app.use(session({ secret: 'SECRET' }));

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:8080/service/linkedin/auth/callback",
    scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social'],
    sessions : false,
  }, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      console.log(accessToken);
      LinkedIn = new Linkedin(accessToken, profile.id, JSON.parse(profile._raw).firstName.preferredLocale.country);
      return done(null, {accessToken, refreshToken, profile});
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

router.get('/linkedin/country', 
function(req, res){
  let location = LinkedIn.send_localisation();
  res.send(location);
});

router.get('/linkedin/send',
  function(req, res){
    LinkedIn.send_message(req.params["message"]);
    res.send("true");
  });

const LinkedinAuth = async (req, res, next) => {
  passport.authenticate('linkedin', {showDialog: true, state: "token=" + req.query.token + ",serviceid=" + req.query.service_id})(req, res, next);
};

router.get('/auth', LinkedinAuth);

router.get('/auth/callback',
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  async function(req, res) {
    const user_id = req.query.state.split(",")[0].split("=")[1];
    const service_id = req.query.state.split(",")[1].split("=")[1];
    console.log(req.user)
    response = await addservice_copy(user_id, service_id, req.user.accessToken, req.user.refreshToken, null);
    if (response.status != 200) {
      console.log("Error while adding service");
      console.log(response);
    }
    console.log("Service added");
    res.redirect('http://localhost:8081/home');
    return req.user.accessToken;
  })
// router.get('/auth/callback',
//     passport.authenticate('linkedin', {
//     successRedirect: '/',
//     failureRedirect: '/login'
//   }));

module.exports = router;
