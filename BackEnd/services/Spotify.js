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

class Spotify {
  Service_id = "ec13a340-8eb5-59da-a8b3-8c1cbe2b67e1";
  user_infos = "";

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
}

const GetcurrentSong = async (token) => {
  const data = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    let artists = [];
    //actual_artist = response.item.artists[0].name;
    for (let i = 0; i < response.data.item.artists.length; i++) {
      artists.push(response.data.item.artists[i].name);
    }
    return {"song_name": response.data.item.name, "artist_name": artists, "album_name": response.data.item.album.name};
  }).catch((error) => {
    return {"code_error": error.response.data};
  });
  return data;
}

const ImListeningASong = async (args, Token) => {
  console.log("ImListeningASong");
  //const Song = await GetcurrentSong();
  //console.log(Song);
}

const is_artist = (artist_name, artists_list) => {
  for (let i = 0; i < artists_list.length; i++) {
    if (artist_name.toLowerCase() == artists_list[i].name.toLowerCase()) {
      return true;
    }
  }
  return false;
}

const searchArtist = async (uri) => {
  const data = await axios.get('https://api.spotify.com/v1/search', {
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
      if (response.data.tracks.items[i].name.toLowerCase() == uri.body.song_name.toLowerCase() && is_artist(uri.body.artist_name, response.data.tracks.items[i].artists)) {
        return {"track_uri": response.data.tracks.items[i].uri, "status": "success"};
      }
    }
  }).catch((error) => {
    return {"status": "error"};
  });
  return data;
}

const GetDevices = async () => {
  const data = await axios.get('https://api.spotify.com/v1/me/player/devices', {
    headers: {  
      Authorization: `Bearer ${SpotifyToken}`,
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    for (let i = 0; i < response.data.devices.length; i++) {
      if (response.data.devices[i].is_active == true) {
        return {"actual_device": response.data.devices[i].id, "status": "success"};
      }
    }
    return;
  }).catch((error) => {
    return {"status": "error"};
  });
  return data;
}

const ChangeSong = async (req) => {
  var uri = await searchArtist(req)
  var device = await GetDevices();
  if (device.status == "error" || uri.status == "error") {
    return {"status": "error"};
  }
  console.log("track_uri = " + uri.track_uri, "device = " + device.actual_device);
  const data = await axios.put('https://api.spotify.com/v1/me/player/play?device_id=' + device.actual_device, 
    {
      uris: [uri.track_uri]
    },
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${SpotifyToken}`,
        'Content-Type': 'application/json'
      },
    }
  ).then((response) => {
    return {"status": "success"};
  }).catch((error) => {
    return {"code_error": error.response.data.error.status};
  });
  return data;
}

const AddSongToPlaylist = async (req) => {
  const playlist = await SearchPlaylist(req);
  const track = await searchArtist(req);
  if (playlist.status == "error" || track.status == "error") {
    return {"status": "error"};
  }
  const data = await axios.post('https://api.spotify.com/v1/playlists/' + playlist.playlist_id + '/tracks', {
    uris: [track.track_uri]
  }, 
  {
    headers: {
      Authorization: `Bearer ${SpotifyToken}`,
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    return {"status": "success"};
  }).catch((error) => {
    return {"code_error": error.response.data.error.status};
  });
}

const GetUser = async () => {
  const response = await axios.get('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${SpotifyToken}`,
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    return {"status": "success", "data": response.data};
  }).catch((error) => {
    return {"status": "error"};
  });
  return response;
}

const CreatePlaylist = async (req) => {
  var user = await GetUser();
  if (user.status == "error") {
    return {"status": "error", "code_error": user.code_error};
  }
  const data = await axios.post('https://api.spotify.com/v1/users/' + user.id + '/playlists', {
    name: req.body.playlist_name,
    description: req.body.playlist_name,
    public: false
  },
  {
    headers: {
      Authorization: `Bearer ${SpotifyToken}`
    }
  }).then((response) => {
    return {"playlist_id": response.data.id, "status": "success"};
  }).catch((error) => {
    return {"status": "error"};
  });
  return data;
}

const SearchPlaylist = async (req) => {
  const data = await axios.get('https://api.spotify.com/v1/me/playlists', {
    headers: {
      Authorization: `Bearer ${SpotifyToken}`
    },
    query: {
      limit: 50
    }
  }).then((response) => {
    for (let i = 0; i < response.data.items.length; i++) {
      if (response.data.items[i].name == req.body.playlist_name) {
        return {"playlist_id": response.data.items[i].id, "status": "success"};
      }
    }
    return CreatePlaylist(req);
  }).catch((error) => {
    return {"status": "error"};
  });
  return data;
}

const test_yazebi = async (req, res) => {
  console.log("test yazebi");
}

const actions = [
  {"636ba1c921531a915d2085d0": ImListeningASong},
  {'636b7b97882dbfabe1822d0c': test_yazebi},
];

const reactions = [
  {"636ba32f21531a915d2085d4": ChangeSong},
  {"636ba45eec84f1ac23b7b424": AddSongToPlaylist}
];

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
  Getcurrentsong().then((data) => {
    res.json(data);
    console.log(data);
  }).catch((error) => {
    res.json(error);
    console.log(error);
  });
});

router.get('/test_spotify_actions', async function(req, res) {
  console.log("test spotify actions");
  for (let i = 0; i < actions.length; i++) {
    if (actions[i][req.body.action_id]) {
      const data = await actions[i][req.body.action_id](req.body.args, req.body.token);
      //res.json(data);
      //console.log(data);
    }
  }
})

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

module.exports = {router};
