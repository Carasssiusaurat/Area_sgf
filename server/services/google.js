const { google } = require("googleapis");
const fetch = require("node-fetch");
const cors = require("cors");
const Router = require("express").Router;
const router = Router();
const calendar = google.calendar("v3");
const youtube = google.youtube("v3");
const nodemailer = require("nodemailer");
const axios = require("axios");
require("dotenv").config();

var actions = ["calendar", "youtube"];
var accessToken = "";
var refreshToken = "";
var user = "";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:8080/google/handleGoogleRedirect"
);

router.post("/createAuthLink", cors(), (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/calendar",
      "https://mail.google.com/",
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    prompt: "consent",
  });
  res.send({ url });
});

router.get("/handleGoogleRedirect", async (req, res) => {
  const code = req.query.code;
  console.log("server 39 | code", code);

  oauth2Client.getToken(code, (err, tokens) => {
    if (err) {
      console.log("server 43 | error", err);
      throw new Error("Issue with Login", err.message);
    }
    accessToken = tokens.access_token;
    refreshToken = tokens.refresh_token;
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    Getmail();
  });
});

const Getmail = async () => {
  const { data } = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken
  );
  console.log(data.email);
  user = data.email;
};

router.post("/getValidToken", async (req, res) => {
  try {
    const request = await fetch("https://www.googleapis.com/oauth2/v4/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: req.body.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const data = await request.json();
    console.log("server 77 | data", data.access_token);

    res.json({
      accessToken: data.access_token,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

const Getcalendar = async () => {
  const res = await calendar.events.list({
    auth: oauth2Client,
    calendarId: "primary",
  });
  console.log(res.data);
  return res.data.items;
};

const GetYoutubeVideo = async (id) => {
  const res = await youtube.videos.list({
    auth: oauth2Client,
    id: id,
    part: "snippet,contentDetails,statistics",
  });
  console.log(res);
  return res.data.items;
};

async function sendMail(user, object, text) {
  try {
    accessToken = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: user,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: refreshToken,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "AREA " + "<" + user + ">",
      to: user,
      subject: object,
      text: text,
      html: "<h1>" + text + "</h1>",
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

const isWorkflow = async (action, trigger, reaction, id) => {
  if (action === actions[0]) {
    trigger = parseInt(trigger) * 60000;
    var item = await Getcalendar();
    item.forEach(function (items) {
      const dateTime = new Date(items.start.dateTime);
      const nowDate = new Date();
      const diffTime = Math.abs(nowDate - dateTime);
      if (diffTime <= trigger && nowDate < dateTime) {
        if (reaction === "gmail") {
          console.log("OK");
          sendMail(
            user,
            items.summary + " in less than " + trigger / 60000 + " minutes.",
            items.summary + " in less than " + trigger / 60000 + " minutes."
          )
            .then((result) => console.log("Email sent...", result))
            .catch((error) => console.log(error.message));
        }
      }
    });
  }
  if (action === actions[1]) {
    var item = await GetYoutubeVideo(id);
    item.forEach(function (items) {
      trigger = parseInt(trigger);
      const img = items.snippet.thumbnails.high;
      const views = parseInt(items.statistics.viewCount);
      if (views >= trigger) {
        if (reaction === "gmail") {
          console.log("OK");
          console.log(items.snippet.title);
          sendMail(
            user,
            items.snippet.title + " Reached " + trigger + " views !",
            items.snippet.title +
              " Reached " +
              trigger +
              " views !" +
              '<br/> <img style="width:250px;" src="' +
              items.snippet.thumbnails.high.url +
              '" />'
          )
            .then((result) => console.log("Email sent...", result))
            .catch((error) => console.log(error.message));
        }
      }
    });
  }
};

router.post("/set_workflow", async function (req, res) {
  console.log(req.body);
  isWorkflow(req.body.action, req.body.trigger, req.body.reaction, req.body.id);
});

module.exports = router;
