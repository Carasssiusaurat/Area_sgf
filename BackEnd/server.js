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
const app = express();

app.use(express.json());

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

app.listen(PORT, () => {
    console.log(`server is running on port : ${PORT}`)
})