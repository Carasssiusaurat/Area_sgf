const passport = require('passport');
const express = require('express');
const Router = require('express').Router;
const axios = require('axios');
const router = Router();
const fs = require('fs');
const { json } = require('body-parser');
require('dotenv').config();

const SCOPES = ["user-read-currently-playing", "user-read-playback-state", "user-modify-playback-state"]
const SpotifyStrategy = require('passport-spotify').Strategy;
let actual_device = '';
let devices = [];
var track_uri = '';

class Spotify {
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
      for (let i = 0; i < response.data.devices.length; i++) {
        if (response.data.devices[i].is_active == true) {
          actual_device = response.data.devices[i].id;
        }
      }
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

  changeSong = async (req) => {
    await this.searchArtist(req)
    await this.GetDevices();
    if (track_uri == 400) {
      console.log("error");
    }
    console.log("track_uri = " + track_uri);
    console.log("dsssssssssssssssssss");
    await axios.put('https://api.spotify.com/v1/me/player/play?device_id=' + actual_device, 
      {
        uris: [track_uri]
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
    ).then((response) => {
      console.log("success");
      return {"status": "success"};
    }).catch((error) => {
      console.log(error.response.data);
      return {"code_error": error.response.data.error.status};
    });
  }
  
  is_artist = (artist_name, artists_list) => {
    for (let i = 0; i < artists_list.length; i++) {
      if (artist_name.toLowerCase() == artists_list[i].name.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  searchArtist = async (uri) => {
  
    console.log("pute pute pute pute pute pute pute pute pute pute");
    await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${SpotifyToken}`
      },
      params: {
        q: uri.body.song_name,
        type: 'track',
        market: 'FR',
        limit: 5
      }
    }).then((response) => {
      for (let i = 0; i < response.data.tracks.items.length; i++) {
        if (response.data.tracks.items[i].name.toLowerCase() == uri.body.song_name.toLowerCase() && this.is_artist(uri.body.artist_name, response.data.tracks.items[i].artists)) {
          console.log("uri = " + response.data.tracks.items[i].uri);
          track_uri = response.data.tracks.items[i].uri
        }          
      }
    }).catch((error) => {
      console.log(error);
      track_uri = 400;
    });
  }
  
  isWorkflow = async (trigger, reaction) => {
    var data = await Getcurrentsong();
    console.log(data, trigger);
    if (data.songid === trigger.songid && data.artistid === trigger.artistid) {
      changeSong(reaction);
    }
  }
}

const my_spotify = new Spotify();

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

router.get('/auth', passport.authenticate('spotify', {scope: SCOPES, showDialog: true}));

router.get('/auth/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    SpotifyToken = req.user.accessToken;
    console.log('token: '+ req.user.accessToken);
    
    //res.redirect('http://localhost:3001/spotify');
  }
);

router.get('/getSpotifyToken', (req, res) => {
  res.send(SpotifyToken);
});

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
  my_spotify.changeSong(req).then((data) => {
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

module.exports = router;