const { google } = require("googleapis");
const fetch = require("node-fetch");
const cors = require("cors");
const Router = require("express").Router;
const router = Router();
const calendar = google.calendar("v3");
const nodemailer = require("nodemailer");
require("dotenv").config();

var actions = ["calendar", "youtube"];
var accessToken = "";
var refreshToken = "";

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
    ],
    prompt: "consent",
  });
  res.send({ url });
});

router.get("/handleGoogleRedirect", async (req, res) => {
  const code = req.query.code;
  console.log("server 36 | code", code);
  oauth2Client.getToken(code, (err, tokens) => {
    if (err) {
      console.log("server 39 | error", err);
      throw new Error("Issue with Login", err.message);
    }
    accessToken = tokens.access_token;
    refreshToken = tokens.refresh_token;
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    res.redirect(
      `http://localhost:3000?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  });
});

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
    console.log("server 74 | data", data.access_token);

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

async function sendMail(items) {
  try {
    accessToken = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "area.epiteech@gmail.com",
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        refreshToken: refreshToken,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "AREA <area.epiteech@gmail.com>",
      to: "area.epiteech@gmail.com",
      subject: items.summary + " in less than 10 minutes.",
      text: items.summary + "in less than 10 minutes.",
      html: "<h1>" + items.summary + " in less than 10 minutes.</h1>",
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

const isWorkflow = async (action, trigger) => {
  if (action === actions[0]) {
    trigger = parseInt(trigger);
    var item = await Getcalendar();
    item.forEach(function (items) {
      const dateTime = new Date(items.start.dateTime);
      const nowDate = new Date();
      console.log(dateTime);
      console.log(nowDate);
      const diffTime = Math.abs(nowDate - dateTime);
      console.log(diffTime);

      if (diffTime <= trigger && nowDate < dateTime) {
        console.log("OK");
        sendMail(items)
          .then((result) => console.log("Email sent...", result))
          .catch((error) => console.log(error.message));
      }
    });
  }
};

router.post("/set_workflow", async function (req, res) {
  console.log(req.body);
  isWorkflow(req.body.action, req.body.trigger);
});

module.exports = router;
