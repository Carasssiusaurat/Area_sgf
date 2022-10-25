const passport = require('passport');
const express = require('express');
const Router = require('express').Router;
const axios = require('axios');
const router = Router();
const fs = require('fs');
require('dotenv').config();

const SCOPES = ["user-read-currently-playing", "user-read-playback-state", "user-modify-playback-state"]
const SpotifyStrategy = require('passport-spotify').Strategy;

var SpotifyToken = ''

var trigger = {
  "songid": "",
  "artistid": ""
};

var reaction = {
  "songid": "",
  "artistid": ""
};

var current_song = {
  "songid": "",
  "artistid": ""
};

passport.serializeUser(function (user, done) {
  done(null, user);
});
  
passport.deserializeUser(function (obj, done) {
  done(null, obj);
})

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/spotify/auth/callback'
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      return done(null, {accessToken});
    }
  )
);

router.get('/auth', passport.authenticate('spotify', {scope: SCOPES, showDialog: true}));

router.get('/auth/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    SpotifyToken = req.user.accessToken;
    console.log('token: '+ req.user.accessToken);
    res.redirect('http://localhost:3001/spotify');
  }
);

const Getcurrentsong = async () => {
  const {data} = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${SpotifyToken}`,
      'Content-Type': 'application/json'
    }
  });
  actual_artist = data.item.artists[0].name;
  return {"name": data.item.name, "artist": data.item.artists[0].name, "songid": data.item.uri, "artistid": data.item.artists[0].uri};
}

const changeSong = async (song) => {
  const {data} = await axios.put('https://api.spotify.com/v1/me/player/play?device_id=' + "c760cfd483b12cf5477387d5f8db4acc737fe867", 
    {
      uris: [song.songid]
      //"context_uri": "spotify:album:6R8nBTTPwlP7iur0wV3oLq",
      //"offset": {
      //  "position": 4
      //},
      //"position_ms": 0,
    },
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${SpotifyToken}`,
        'Content-Type': 'application/json'
      },
    }
  );
  console.log(data); 
}

router.get('/get_current_song', function(req, res) {
  console.log('token: '+ SpotifyToken);
  Getcurrentsong().then((data) => {
    res.json(data);
    console.log(data);
  });
});

const searchArtist = async (name, type, artist, effect, filename) => {
  const {data} = await axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${SpotifyToken}`
    },
    params: {
      q: name,
      type: type,
      market: 'FR',
      limit: 5
    }
  });
  if (type == 'artist') {
    console.log(data.artists.items);
  } else {
    for (var i = 0; i < data.tracks.items.length; i++) {
      if (data.tracks.items[i].artists[0].name.toLowerCase() === artist && data.tracks.items[i].name.toLowerCase() === name) {
        effect.songid = data.tracks.items[i].uri;
        effect.artistid = data.tracks.items[i].artists[0].uri;
        fs.writeFileSync(filename + '.json', JSON.stringify(data.tracks.items[i]));
      }
    }
  }
}

const isWorkflow = async (trigger, reaction) => {
  var data = await Getcurrentsong();
  console.log(data, trigger);
  if (data.songid === trigger.songid && data.artistid === trigger.artistid) {
    changeSong(reaction);
  }
}

router.post('/set_workflow', async function(req, res) {
  console.log(req.body);
  await searchArtist(req.body.triggerInput, req.body.triggerType, req.body.artistTrigger, trigger, 'trigger');
  await searchArtist(req.body.reactionInput, req.body.reactionType, req.body.artistReaction, reaction, 'reaction');
  console.log(trigger);
  console.log(reaction);
  isWorkflow(trigger, reaction);
});

module.exports = router;