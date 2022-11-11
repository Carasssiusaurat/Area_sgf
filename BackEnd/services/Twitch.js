const passport = require('passport');
const express = require('express');
const Router = require('express').Router;
const axios = require('axios');
const router = Router();
const fs = require('fs');
const { request } = require('http');
const { response } = require('express');
const e = require('express');
const TwitchStrategy = require("passport-twitch-new").Strategy;
const SCOPES = ["user:manage:whispers", "user:read:follows"]
require('dotenv').config();

passport.use(
  new TwitchStrategy(
    {
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/twitch/callback",
    scope: SCOPES
    },
    function(accessToken, refreshToken, profile, done) {
      return done(null, {accessToken});
    }
  )
);

UserIdFromName = async (token, username) => {
  try {
  const data = await axios.get('https://api.twitch.tv/helix/users?login=' + username, {
    headers: {
      Authorization: "Bearer " + token,
      'Client-ID': process.env.TWITCH_CLIENT_ID
    },
  },);
  return(data.data.data[0].id)
  } catch(err) {
    console.log(err)
    res.send(err)
  }
};

twitchWhisp = async (req, res) => {
  usertoken = req.headers.authorization
  self_id = req.body.user_id
  receiver = req.body.to
  receiver_id = await UserIdFromName(usertoken, receiver)
  let body = {"message": req.body.message }
  try {
  const data = await axios.post('https://api.twitch.tv/helix/whispers?from_user_id=' + self_id + "&to_user_id=" + receiver_id,  body, {
    headers: {
      'Authorization': "Bearer " + usertoken,
      'Client-ID': process.env.TWITCH_CLIENT_ID
    }}
  )
  res.status(200).send("message sent succesfully")
  } catch(err) {
    console.log(err)
    res.send(err)
  }
}

router.post('/twitch/whisp', async function(req, res) {
  twitchWhisp(req, res)
});

GetUserId = async (req, res) => {
  if (!req.user.accessToken) {
    res.status(400).send("error: missing field")
  }
  let token = req.user.accessToken;
  try {
  const data = await axios.get('https://api.twitch.tv/helix/users' , {
    headers: {
      'Authorization': "Bearer " + token,
      'Client-ID': process.env.TWITCH_CLIENT_ID
    },
  },);
  return(data.data.data[0].id)
  } catch(err) {
    console.log(err)
    return(err)
  }
};

GetUserIdFromName = async (req, res) => {
  let token = req.headers.authorization.split(' ')[1]
  try {
  const data = await axios.get('https://api.twitch.tv/helix/users?login='+ req.body.username, {
    headers: {
      Authorization: "Bearer " + token,
      'Client-ID': process.env.TWITCH_CLIENT_ID
    },
  },);
  return(data.data.data[0].id)
  } catch(err) {
    console.log(err)
    return(err)
  }
};

router.get('/get_user_id/name', function(req, res) {
  if (!req.headers.authorization) {
    res.status(401).send("error: couldn't find access Token")
  } else if (req.body.username) {
    GetUserIdFromName(req).then((data) => {
      res.json({user_id: data, bearer_token:req.headers.authorization});
    }).catch((error) => {
      res.status(500).send("error: failed to get requested ID");
    });
  } else {
  GetUserId(req).then((data) => {
    res.json({user_id: data, bearer_token:req.headers.authorization});
  }).catch((error) => {
    res.status(500).send("error: failed to get requested ID");
  });
}});


router.get('/get_user_id', function(req, res) {
  if (!req.user.accessToken) {
    res.status(401).send("error: couldn't find access Token")
  } else if (req.body.username) {
    GetUserIdFromName(req).then((data) => {
      res.json({user_id: data, bearer_token:req.user.acessToken});
    }).catch((error) => {
      res.status(500).send("error: failed to get requested ID");
    });
  } else {
  GetUserId(req).then((data) => {
    res.json({user_id: data, bearer_token:req.user.acessToken});
  }).catch((error) => {
    res.status(500).send("error: failed to get requested ID");
  });
}});

var twitchToken = ''

router.get('/auth/twitch/callback',
  passport.authenticate('twitch', {failureRedirect: '/login'}),
  async function(req, res) {
  twitchToken = req.user.accessToken;

  GetUserId(req).then((data) => {
    res.json({user_id: data, bearer_token:req.user.accessToken});
  }).catch((error) => { 
    res.status(500).send("error: couldn't get user Id")
  });
});

twitchGetFollows = async (req, res) => {
  if (!req.headers.authorization || !req.query.user_id) {
    res.send("error: missing fields")
  }
  let usertoken = req.headers.authorization
  let user_id = req.query.user_id
  try {
  const data = await axios.get("https://api.twitch.tv/helix/streams/followed?user_id="+ user_id, {
    headers: {
      Authorization: usertoken,
      'Client-ID': process.env.TWITCH_CLIENT_ID
  }});
  res.json(data.data.data)
  } catch(err) {
    console.log(err)
    res.send(err)
  }
}

router.get('/twitch/getFollows', async function (req, res) {
  twitchGetFollows(req, res)
});

anyIsStreaming = async (req, res) => {
  if (!req.headers.authorization || !req.query.user_id) {
    res.status(400).send("error: missing field")
  }
  let usertoken = req.headers.authorization
  let user_id = req.query.user_id
  try {
  const data = await axios.get("https://api.twitch.tv/helix/streams/followed?user_id="+ user_id, {
    headers: {
      Authorization: usertoken,
      'Client-ID': process.env.TWITCH_CLIENT_ID
  }});
    res.status(500).send("error processing request: empty return")
  let vals = data.data.data
  const streamers = vals.filter(e => e.type === "live")
  if(streamers.length > 0) {
    console.log("TRUE", streamers.length)//TEMP RETURN
  } else {
    console.log("FALSE")//TEMP RETURN
  }
  res.json(data.data.data)//TEMP RETURN
  } catch(err) {
    console.log(err)
    res.send(err)
  }
}

router.get('/twitch/streaming/any', async function (req, res) {
  await anyIsStreaming(req, res)
});

streamerIsStreaming = async (req, res) => {
  if (!req.headers.authorization || !req.query.user_id || !req.body.broadcaster) {
    res.json("error: one or several fields missing (headers.authorization: query.user_id: body.broadcaster)")
  }
  let usertoken = req.headers.authorization
  let user_id = req.query.user_id
  let username = req.body.broadcaster
  try {
  const data = await axios.get("https://api.twitch.tv/helix/streams/followed?user_id="+ user_id, {
    headers: {
      Authorization: usertoken,
      'Client-ID': process.env.TWITCH_CLIENT_ID
  }});
    res.status(500).send("error processing request: empty return")
  let vals = data.data.data
  const streamer = vals.find(e => e.user_name === username)
  if(streamer.type === "live") {
    console.log("TRUE")//TEMP RETURN
  } else {
    console.log("FALSE")//TEMP RETURN
  }
  res.json(data.data.data)//TEMP RETURN
  } catch(err) {
  console.log(err)
  res.send(err)
  }
}

router.get('/twitch/streaming/broadcaster', async function (req, res) {
  streamerIsStreaming(req, res)
});
  
passport.serializeUser(function (user, done) {
  done(null, user);
});
    
passport.deserializeUser(function (obj, done) {
  done(null, obj);
})
  
router.get('/auth/twitch', passport.authenticate('twitch'));
  
router.get("/login/fail", (req, res) => {
  res.status(401).json({
    success: false,
    message: "authentification twitter fail"
  })
})

module.exports = router;