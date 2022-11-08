require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 8080;
const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');
const actionRoutes = require('./routes/actions');
const reactionRoutes = require('./routes/reactions');
const areaRoutes = require('./routes/areas');
const about_jsonRoutes = require('./routes/about_json');
const cors = require("cors");
const app = express();
const session = require("express-session");
const spotifyrouter = require("./services/Spotify.js").router;
const googleRoutes = require("./services/google");

app.use(cors());

app.use(express.json());

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

// connect to MongoDB
connectDB();

mongoose.connection.once('open', () => {
    console.log('connected to MongoDB');
})

app.use('/', about_jsonRoutes);

app.use('/', userRoutes);

app.use('/', serviceRoutes);

app.use('/', actionRoutes);

app.use('/', reactionRoutes);

app.use('/', areaRoutes);

app.use("/spotify", spotifyrouter);

app.use("/service/Google", googleRoutes);

app.listen(PORT, () => {
    console.log(`server is running on port : ${PORT}`)
})