require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const userRoutes = require("./routes/users");
const serviceRoutes = require("./routes/services");
const actionRoutes = require("./routes/actions");
const reactionRoutes = require("./routes/reactions");
const areaRoutes = require("./routes/areas");
const cors = require("cors");
const app = express();
const session = require('express-session');
const spotifyrouter = require('./services/Spotify.js').router;

app.use(cors());

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());

// app.use(express.json());

// app.use(require('./controllers/userController'));

//error handling
// app.use(function (err, _req, res) {
//     console.error(err.stack);
//     res.statuts(500).send('Server Error !');
// })

app.use(express.json());

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))

// connect to MongoDB
connectDB();

mongoose.connection.once("open", () => {
  console.log("connected to MongoDB");
});

app.use("/", userRoutes);

app.use("/", serviceRoutes);

app.use("/", actionRoutes);

app.use("/", reactionRoutes);

app.use("/", areaRoutes);

app.use("/spotify", spotifyrouter);

app.listen(PORT, () => {
  console.log(`server is running on port : ${PORT}`);
});
