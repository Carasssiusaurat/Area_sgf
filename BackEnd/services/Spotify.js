const passport = require('passport');
const express = require('express');
const Router = require('express').Router;
const axios = require('axios');
const router = Router();
const fs = require('fs');
const { json } = require('body-parser');
require('dotenv').config();

const SCOPES = ["user-read-currently-playing", "user-read-playback-state", "user-modify-playback-state", "user-read-private", "user-read-email", "playlist-modify-public", "playlist-modify-private", "playlist-read-private", "playlist-read-collaborative"]
const SpotifyStrategy = require('passport-spotify').Strategy;

class Spotify {
  Service_id = "ec13a340-8eb5-59da-a8b3-8c1cbe2b67e1";
  user_infos = "";

  GetUser = async () => {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${SpotifyToken}`,
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      this.user_infos = response.data;
      return {"status": "success"};
    }).catch((error) => {
      return {"status": "error"};
    });
    return response;
  }

  Getcurrentsong = async () => {
    const data = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
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
      return {"song_name": response.data.item.name, "artist_name": artists, "album_name": response.data.item.album.name};
    }).catch((error) => {
      return {"code_error": error.response.data};
    });
    return data;
  }
  
  GetDevices = async () => {
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
    var uri = await this.searchArtist(req)
    var device = await this.GetDevices();
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
  
  is_artist = (artist_name, artists_list) => {
    for (let i = 0; i < artists_list.length; i++) {
      if (artist_name.toLowerCase() == artists_list[i].name.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  searchArtist = async (uri) => {
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
        if (response.data.tracks.items[i].name.toLowerCase() == uri.body.song_name.toLowerCase() && this.is_artist(uri.body.artist_name, response.data.tracks.items[i].artists)) {
          return {"track_uri": response.data.tracks.items[i].uri, "status": "success"};
        }
      }
    }).catch((error) => {
      return {"status": "error"};
    });
    return data;
  }
  
  AddItemToPlaylist = async (req) => {
    const playlist = await this.SearchPlaylist(req);
    const track = await this.searchArtist(req);
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

  CreatePlaylist = async (req) => {
    const data = await axios.post('https://api.spotify.com/v1/users/' + this.user_infos.id + '/playlists', {
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

  SearchPlaylist = async (req) => {
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
      return this.CreatePlaylist(req);
    }).catch((error) => {
      return {"status": "error"};
    });
    return data;
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

var SpotifyToken = '';

router.get('/auth', passport.authenticate('spotify', {scope: SCOPES, showDialog: true}));

router.get('/auth/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }), async function(req, res) {
    SpotifyToken = req.user.accessToken;
    await my_spotify.GetUser();
    console.log('token: '+ req.user.accessToken);
    //res.redirect('http://localhost:3001/spotify');
  }
);

router.get('/getSpotifyToken', (req, res) => {
  res.send(SpotifyToken);
});

router.get('/get_current_song', function(req, res) {
  action_id = "get_ee458a99-c8d4-57b4-901b-dfa389824a38";
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
  reaction_id = "a8572e2e-9008-5ed2-ade1-0528a4caff8a";
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

router.post('/Add_item_to_playlist', async function(req, res) {
  reaction_id = "99af9313-0b2c-57a6-850a-e3e886ec31fb";
  const data = await my_spotify.AddItemToPlaylist(req);
  res.json(data);
});

module.exports = router;