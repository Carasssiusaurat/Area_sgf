const passport = require('passport');
const express = require('express');
const Router = require('express').Router;
const axios = require('axios');
const router = express.Router();
const fs = require('fs');
const { Interface } = require('readline');
require('dotenv').config();
const {addservice_copy} = require('../controllers/userController');
const SCOPES = ["user-read-currently-playing", "user-read-playback-state", "user-modify-playback-state"]
const SpotifyStrategy = require('passport-spotify').Strategy;
const actual_device = '';
let devices = [];

class my_Spotify {
  Getcurrentsong = async () => {
    await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${SpotifyToken}`,
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      let artists = [];
      //actual_artist = response.item.artists[0].name;
      for (let i = 0; i < response.data.item.artists.length; i++) {
        artists.push(response.data.item.artists[i].name);
      }
      console.log({"song_name": response.data.item.name, "artist_name": artists, "album_name": response.data.item.album.name});
      return {"song_name": response.data.item.name, "artist_name": artists, "album_name": response.data.item.album.name};
    }).catch((error) => {
      return {"code_error": error.response.data};
    });
  }
  
  GetDevices = async () => {
    console.log("Getting devices");
    await axios.get('https://api.spotify.com/v1/me/player/devices', {
      headers: {  
        Authorization: `Bearer ${SpotifyToken}`,
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      //fs.writeFileSync('response.json', JSON.stringify(response));
      //console.log(response.data.devices);
      devices = response.data;
      //console.log(devices);
      console.log(devices);
      return devices;
    }).catch((error) => {
      console.log("error");
      console.log("token =" + SpotifyToken);
      console.log(error);
      fs.writeFileSync('devices_error.json', JSON.stringify(error));
      return {"status": "error"};
    });
  }

  ChangeDevice = async (device) => {
    if (devices.length() > 1) {
      const {data} = await axios.put('https://api.spotify.com/v1/me/player', {
        headers: {
          Authorization: `Bearer ${SpotifyToken}`,
          'Content-Type': 'application/json'
        },
        device_ids: [devices[1].id]
      });
    }
  }

  changeSong = async (song) => {
    const {data} = await axios.put('https://api.spotify.com/v1/me/player/play?device_id=' + actual_device, 
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
  
  searchArtist = async (name, type, artist, effect, filename) => {
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
  
  isWorkflow = async (trigger, reaction) => {
    var data = await Getcurrentsong();
    console.log(data, trigger);
    if (data.songid === trigger.songid && data.artistid === trigger.artistid) {
      changeSong(reaction);
    }
  }
}

const my_spotify = new my_Spotify();

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
      callbackURL: 'http://localhost:8080/spotify/auth/callback',
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, expires_in, profile, done) {
      console.log(req.query.state)
      return done(null, {accessToken});
    }
  )
);

const oui = async (req, res, next) => {
  //console.log("user id = " + req.query.token + "server id = " + req.query.service_id);
  passport.authenticate('spotify', {scope: SCOPES, showDialog: true, state: "token=" + req.query.token + ",serviceid=" + req.query.service_id})(req, res, next);
}

router.get('/auth', oui);


router.get('/auth/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  async function (req, res) {
    const user_id = req.query.state.split(",")[0].split("=")[1];
    const service_id = req.query.state.split(",")[1].split("=")[1];
    console.log("user id = " + user_id + " server id = " + service_id);
    console.log("pute pute pute pute pute pute pute ")
    SpotifyToken = req.user.accessToken;
    console.log('token: '+ req.user.accessToken);
    response = await addservice_copy(user_id, service_id, req.user.accessToken);
    console.log(response);
    if (response.status != 200) {
      console.log("error");
      console.log(response.message)
    }
    console.log("service added");
    res.redirect('http://localhost:8081/home');
    return req.user.accessToken;
  }
);

router.get('/get_current_song', function(req, res) {
  my_spotify.Getcurrentsong().then((data) => {
    res.json(data);
    console.log(data);
  }).catch((error) => {
    res.json(error);
    console.log(error);
  });
});

router.get('/get_devices', async function(req, res) {
  const data = await my_spotify.GetDevices();
  res.json(data);
});

router.get('/change_song', function(req, res) {
  my_spotify.changeSong(reaction).then((data) => {
    res.json(data);
    console.log(data);
  }).catch((error) => {
    res.json(error);
    console.log(error);
  });
});

router.post('/set_workflow', async function(req, res) {
  console.log(req.body);
  await Spotify.searchArtist(req.body.triggerInput, req.body.triggerType, req.body.artistTrigger, trigger, 'trigger');
  await Spotify.searchArtist(req.body.reactionInput, req.body.reactionType, req.body.artistReaction, reaction, 'reaction');
  console.log(trigger);
  console.log(reaction);
  my_spotify.isWorkflow(trigger, reaction);
});

module.exports = {router, my_Spotify};
