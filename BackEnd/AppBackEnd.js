const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors');
const port = 3000;
const passport = require('passport');
const spotifyrouter = require('./services/Spotify.js');

app.use(cors());
app.use(express.json());

var users = [
  {
    username: "user1",
    email: "user1@mail.com",
    password: "user1",
    token: "token1",
    services: [
      {
        name: "",
        token: ""
      }
    ]
  }
];

passport.serializeUser(function (user, done) {
  done(null, user);
});
  
passport.deserializeUser(function (obj, done) {
  done(null, obj);
})

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))

app.post('/', function(req, res) {
  users.push(req.body);
  res.json({ "message": "User Succesfully added" });
  res.end()
})

app.get('/', function(req, res) {
  usr_info = req.body;

    for (var i = 0; i < users.length; i++) {
        if (usr_info.username == users[i].username) {
            res.json({ "message": "Username already exists" });
            res.end();
        } else if (usr_info.email == users[i].email) {
            res.json({ "message": "Email already took" });
            res.end();
        }
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


app.get("/login/discord", (req, res) => {
    console.log("discord login");
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=1024615731343663175&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Flogindiscord&response_type=code&scope=identify&state=` + 'token_1');
})

app.get("/logindiscord", (req, res) => {
    console.log("bite")
    var state = req.query.state;
    var code = req.query.code;
    console.log(code);
    //getToken(code, state);
})

app.use('/spotify', spotifyrouter);