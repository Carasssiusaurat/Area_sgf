require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const app = express();


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

// connect to MongoDB
connectDB();

mongoose.connection.once('open', () => {
    console.log('connected to MongoDB');
})

app.use('/', userRoutes);

app.listen(PORT, () => {
    console.log(`server is running on port : ${PORT}`)
})