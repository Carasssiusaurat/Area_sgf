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

const GetcurrentSong = async (token) => {
  const data = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    let artists = [];
    //console.log(response);
    if (response.data === '') {
      console.log("No song playing");
      return {"status": "fail"};
    }
    //actual_artist = response.item.artists[0].name;
    for (let i = 0; i < response.data.item.artists.length; i++) {
      artists.push(response.data.item.artists[i].name);
    }
    return {"status": "success", "song_name": response.data.item.name, "artist_name": artists, "album_name": response.data.item.album.name};
  }).catch((error) => {
    return {"status": "error"};
  });
  return data;
}

const ImListeningASong = async (args, Token) => {
  const Song = await GetcurrentSong(Token);
  if (Song.status === "error") {
    return {"status": "error"};
  } else if (Song.status === "fail") {
    return {"status": "fail"};
  }
  if (Song.song_name.toLowerCase() == args[0].toLowerCase()) {
    for (let i = 0; i < Song.artist_name.length; i++) {
      if (Song.artist_name[i].toLowerCase() == args[1].toLowerCase()) {
        console.log("Is this song")
        return {"status": "success"};
      }
    }
  }
  return {"status": "fail"};
}

const is_artist = (artist_name, artists_list) => {
  for (let i = 0; i < artists_list.length; i++) {
    if (artist_name.toLowerCase() == artists_list[i].name.toLowerCase()) {
      return true;
    }
  }
  return false;
}

const searchArtist = async (args, token) => {
  const data = await axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      q: args[0],
      type: 'track',
      market: 'FR',
      limit: 5
    }
  }).then((response) => {
    for (let i = 0; i < response.data.tracks.items.length; i++) {
      if (response.data.tracks.items[i].name.toLowerCase() == args[0].toLowerCase() && is_artist(args[1], response.data.tracks.items[i].artists)) {
        return {"track_uri": response.data.tracks.items[i].uri, "status": "success"};
      }
    }
    console.log("No song found");
    return {"status": "fail"};
  }).catch((error) => {
    return {"status": "error"};
  });
  return data;
}

const GetDevices = async (token) => {
  const data = await axios.get('https://api.spotify.com/v1/me/player/devices', {
    headers: {  
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    if (response.data.devices.length == 0) {
      return {"status": "fail"};
    }
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

const ChangeSong = async (args, token) => {
  var uri = await searchArtist(args, token);
  var device = await GetDevices(token);
  if (device.status == "error" || uri.status == "error") {
    return {"status": "error"};
  }
  if (device.status == "fail") {
    return {"status": "fail"};
  }
  console.log("track_uri = " + uri.track_uri, "device = " + device.actual_device);
  const data = await axios.put('https://api.spotify.com/v1/me/player/play?device_id=' + device.actual_device, 
    {
      uris: [uri.track_uri]
    },
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
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

const AddSongToPlaylist = async (args, token) => {
  const playlist = await SearchPlaylist(args, token);
  const track = await searchArtist(args, token);
  if (playlist.status == "error" || track.status == "error") {
    return {"status": "error"};
  }
  const data = await axios.post('https://api.spotify.com/v1/playlists/' + playlist.playlist_id + '/tracks', {
    uris: [track.track_uri]
  }, 
  {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    return {"status": "success"};
  }).catch((error) => {
    return {"code_error": error.response.data.error.status};
  });
}

const GetUser = async (token) => {
  const response = await axios.get('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    return {"status": "success", "data": response.data};
  }).catch((error) => {
    return {"status": "error"};
  });
  return response;
}

const CreatePlaylist = async (args, token) => {
  var user = await GetUser(token);
  if (user.status == "error") {
    return {"status": "error", "code_error": user.code_error};
  }
  const data = await axios.post('https://api.spotify.com/v1/users/' + user.id + '/playlists', {
    name: args[2],
    description: args[2],
    public: false
  },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((response) => {
    return {"playlist_id": response.data.id, "status": "success"};
  }).catch((error) => {
    return {"status": "error"};
  });
  return data;
}

const SearchPlaylist = async (args, token) => {
  const data = await axios.get('https://api.spotify.com/v1/me/playlists', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    query: {
      limit: 50
    }
  }).then((response) => {
    for (let i = 0; i < response.data.items.length; i++) {
      if (response.data.items[i].name == args[2]) {
        return {"playlist_id": response.data.items[i].id, "status": "success"};
      }
    }
    return CreatePlaylist(args, token);
  }).catch((error) => {
    return {"status": "error"};
  });
  return data;
}

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
      //console.log("refresh_token = " + refreshToken);
      return done(null, {accessToken});
    }
  )
);

const SpotifyAuth = async (req, res, next) => {
  //console.log("user id = " + req.query.token + "server id = " + req.query.service_id);
  passport.authenticate('spotify', {scope: SCOPES, showDialog: true, state: "token=" + req.query.token + ",serviceid=" + req.query.service_id})(req, res, next);
}

router.get('/auth', SpotifyAuth);


router.get('/auth/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  async function (req, res) {
    const user_id = req.query.state.split(",")[0].split("=")[1];
    const service_id = req.query.state.split(",")[1].split("=")[1];
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

//router.get('/get_current_song', function(req, res) {
//  Getcurrentsong().then((data) => {
//    res.json(data);
//    console.log(data);
//  }).catch((error) => {
//    res.json(error);
//    console.log(error);
//  });
//});

router.get('/test_spotify_actions', async function(req, res) {
  console.log("test spotify actions");
  console.log(req.body.token);
  for (let i = 0; i < actions.length; i++) {
    if (actions[i][req.body.action_id]) {
      const data = await actions[i][req.body.action_id](req.body.args, req.body.token);
      res.json(data);
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

module.exports = {router, AddSongToPlaylist, ImListeningASong, ChangeSong};