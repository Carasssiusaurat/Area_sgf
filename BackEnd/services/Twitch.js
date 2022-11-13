const passport = require('passport');
const express = require('express');
const Router = require('express').Router;
const axios = require('axios');
const { response } = require('express');
const router = Router();
//const fs = require('fs');
//const { request } = require('http');
//const { response } = require('express');
const TwitchStrategy = require("passport-twitch-new").Strategy;
const SCOPES = ["user:manage:whispers", "user:read:follows", "moderator:manage:announcements", "channel:manage:raids", "channel:read:subscriptions", "channel:read:goals"]
require('dotenv').config();

passport.use(
  new TwitchStrategy(
    {
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/twitch/auth/callback",
    scope: SCOPES
    },
    function(accessToken, refreshToken, profile, done) {
      return done(null, {accessToken, refreshToken});
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
    return {"status": "error"};
  }
};

/*
router.get('/twitch/subCount', async function (req, res) {
  twitchSubCount(req, res)
});

router.get('/twitch/makeAnnonce', async function (req, res) {
  twitchAnnouncement(req, res)
});

router.get('/twitch/startRaid', async function (req, res) {
  twitchStartRaid(req, res)
});

router.get('/twitch/soundtrack', async function (req, res) {
  twitchSoundtrackIs(req, res)
});

router.get('/twitch/goalCheck', async function (req, res) {
  twitchGoalReached(req, res)
});

router.get('/twitch/lastPlayed', async function (req, res) {
  twitchLastPlayedIs(req, res)
});
*/

twitchSubCount = async (usertoken, self_id, subs) => {
  //const usertoken = req.headers.authorization
  //const self_id = req.body.self_id
  //const subs = req.body.subs
  try {
  const data = await axios.get('https://api.twitch.tv/helix/subscriptions?broadcaster_id=' + self_id,{
    headers: {
      'Authorization': "Bearer " + usertoken,
      'Client-ID': process.env.TWITCH_CLIENT_ID
    }}
  )
  if (data.data.total >= subs) {
    console.log("True")//TEMP RETURN
    return {"status": "success"};
  } else {
    console.log("False")//TEMP RETURN
    return {"status": "fail"};
  }
  } catch(err) {
    console.log(err)
    return {"status": "error"};
  }
}

twitchAnnouncement = async (usertoken, self_id, streamer_id, color, msg) => {
  /*
  let usertoken = req.headers.authorization
  let self_id = req.body.user_id
  let streamer_id = req.body.streamer_id
  let color = "primary"
  let msg = req.body.message
  if (req.body.color) {
    color = req.body.color
  }
  */
  color = color || "primary"
  let body = {"message": msg, "color": color}
  try {
  const data = await axios.post('https://api.twitch.tv/helix/chat/announcements?broadcaster_id=' + streamer_id + "&moderator_id=" + self_id,  body, {
    headers: {
      'Authorization': "Bearer " + usertoken,
      'Client-ID': process.env.TWITCH_CLIENT_ID
    }}
  )
  return {"status": "success"};
  } catch(err) {
    console.log(err)
    return {"status": "error"};
  }
}

twitchSoundtrackIs = async (usertoken, streamer_id, soundtrack) => {
  /*
  let usertoken = req.headers.authorization
  let streamer_id = req.body.streamer_id
  let soundtrack = req.body.soudtrack
  */
  try {
  const data = await axios.get('https://api.twitch.tv/helix/soundtrack/current_track?broadcaster_id=' + streamer_id, {
    headers: {
      'Authorization': "Bearer " + usertoken,
      'Client-ID': process.env.TWITCH_CLIENT_ID
    }}
  )
  if (data.data.data[0].track.title === soundtrack) {
    return {"status": "success"};
  } else {
    return {"status": "fail"};
  }
  } catch(err) {
    console.log(err)
    return {"status": "error"};
  }
}

twitchGoalReached = async (usertoken, streamer_id, percent, goalType) => {
  /*
  let usertoken = req.headers.authorization
  let streamer_id = req.body.streamer_id
  let percent = req.body.percentage
  let goalType = req.body.type
  */
  try {
    const data = await axios.get('https://api.twitch.tv/helix/goals?broadcaster_id=' + streamer_id, {
      headers: {
        'Authorization': "Bearer " + usertoken,
        'Client-ID': process.env.TWITCH_CLIENT_ID
      }
    })
    infos = data.data.data.filter(element => element.type === goalType)
    if (infos) {
      let goalpercent = infos[0].current_amount / infos[0].target_amount
      if (percent <= goalpercent) {
        return {"status": "success"};
      } else {
        return {"status": "fail"};
      }
    }
  } catch(err) {
    console.log(err)
    return {"status": "error"};
  }
}


twitchLastPlayedIs = async (usertoken, streamer_id, gamename) => {
  /*
  let usertoken = req.headers.authorization
  let streamer_id = req.body.streamer_id
  let gamename = req.body.gameName
  */
  try {
  const data = await axios.get('https://api.twitch.tv/helix/channels?broadcaster_id=' + streamer_id, {
    headers: {
      'Authorization': "Bearer " + usertoken,
      'Client-ID': process.env.TWITCH_CLIENT_ID
    }}
  )
  if (data.data.data[0].game_name === gamename) {
    return {"status": "success"};
  } else {
    return {"status": "fail"};
  }
  } catch(err) {
    console.log(err)
    return {"status": "error"};
  }
}

twitchWhisp = async (usertoken, self_id, receiver) => {
  /*
  usertoken = req.headers.authorization
  self_id = req.body.user_id
  receiver = req.body.to
  */
  let receiver_id = await UserIdFromName(usertoken, receiver)
  let body = {"message": req.body.message }
  try {
  const data = await axios.post('https://api.twitch.tv/helix/whispers?from_user_id=' + self_id + "&to_user_id=" + receiver_id,  body, {
    headers: {
      'Authorization': "Bearer " + usertoken,
      'Client-ID': process.env.TWITCH_CLIENT_ID
    }}
  )
  return {"status": "success"};
  } catch(err) {
    console.log(err)
    return {"status": "error"};
  }
}

/*
router.post('/twitch/whisp', async function(req, res) {
  twitchWhisp(req, res)
});
*/

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

var twitchToken = ''

router.get('/twitch/auth/callback',
  passport.authenticate('twitch', {failureRedirect: '/login'}),
  async function(req, res) {
  twitchToken = req.user.accessToken;
  twitchRefresh = req.user.refreshToken

  GetUserId(req).then((data) => {
    console.log("refresh", twitchRefresh)
    res.json({user_id: data, bearer_token:req.user.accessToken, refresh_token:twitchRefresh});
    
  }).catch((error) => { 
    res.status(500).send("error: couldn't get user Id")
  });
});

anyIsStreaming = async (usertoken, user_id) => {
  /*
  if (!req.headers.authorization || !req.query.user_id) {
    res.status(400).send("error: missing field")
  }
  let usertoken = req.headers.authorization
  let user_id = req.query.user_id
  */
  try {
  const data = await axios.get("https://api.twitch.tv/helix/streams/followed?user_id="+ user_id, {
    headers: {
      Authorization: usertoken,
      'Client-ID': process.env.TWITCH_CLIENT_ID
  }});
  if (!data.data.data) {
    return {"status": "error"};
  }
  let vals = data.data.data
  const streamers = vals.filter(e => e.type === "live")
  if(streamers.length > 0) {
    return {"status": "success"};
  } else {
    return {"status": "fail"};
  }
  } catch(err) {
    console.log(err)
    return {"status": "error"};
  }
}

streamerIsStreaming = async (usertoken, user_id, username) => {
  /*
  if (!req.headers.authorization || !req.query.user_id || !req.body.broadcaster) {
    res.json("error: one or several fields missing (headers.authorization: query.user_id: body.broadcaster)")
  }
  let usertoken = req.headers.authorization
  let user_id = req.query.user_id
  let username = req.body.broadcaster
  */
  try {
  const data = await axios.get("https://api.twitch.tv/helix/streams/followed?user_id="+ user_id, {
    headers: {
      Authorization: usertoken,
      'Client-ID': process.env.TWITCH_CLIENT_ID
  }});
  if (!data.data.data) {
    return {"status": "error"};
  }
  let vals = data.data.data
  const streamer = vals.find(e => e.user_name === username)
  if(streamer && streamer.type === "live") {
    return {"status": "success"};
  } else {
    return {"status": "fail"};
  }
  } catch(err) {
  console.log(err)
  return {"status": "error"};
  }
}


passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
})

module.exports = router;