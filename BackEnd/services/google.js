const { google } = require("googleapis");
const fetch = require("node-fetch");
const cors = require("cors");
const Router = require("express").Router;
const router = Router();
const calendar = google.calendar("v3");
const youtube = google.youtube("v3");
const gmail = google.gmail("v1");
const drive = google.drive("v3");
const base64url = require("base64url");
const nodemailer = require("nodemailer");
const { addservice_copy } = require("../controllers/userController");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

var services = ["calendar", "youtube", "gmail"];
const now = new Date();
var accessToken = "";
var refreshToken = "";
var user = "";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:8080/service/Google/handleGoogleRedirect"
);

router.get("/auth", cors(), (req, res) => {
  const data = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/calendar",
      "https://mail.google.com/",
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
    ],
    prompt: "consent",
    state: "token=" + req.query.token + ",serviceid=" + req.query.service_id,
  });
  res.redirect(data);
});

router.get("/handleGoogleRedirect", async (req, res) => {
  const code = req.query.code;
  const user_id = req.query.state.split(",")[0].split("=")[1];
  const service_id = req.query.state.split(",")[1].split("=")[1];
  console.log("server 39 | code", code);
  console.log("user id = " + user_id + " server id = " + service_id);

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
  response = await addservice_copy(user_id, service_id, accessToken);
  console.log(response);
  if (response.status != 200) {
    console.log("error");
    console.log(response.message);
  }
  console.log("service added");
  res.redirect("http://localhost:8081/home");
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

// const CreateDriveFile = async () => {
//   try {
//     const res = await drive.files.create({
//       requestBody: {
//         name: "lexya.svg",
//         mimeType: "image/svg+xml",
//       },
//       media: {
//         mimeType: "image/svg+xml",
//         body:
//       },
//     });
//   }
// };

const ListEmails = async () => {
  const res = await gmail.users.messages.list({
    auth: oauth2Client,
    userId: user,
    // q: "has:attachment",
    maxResults: 1,
  });
  // console.log(res.data.messages);
  return res.data.messages;
};

const GetMailInfo = async (id) => {
  const res = await gmail.users.messages.get({
    auth: oauth2Client,
    userId: user,
    id: id,
  });
  // console.log(res.data.messages);
  return res.data;
};

const GetFileData = async (message_id, attachment_id) => {
  const res = await gmail.users.messages.attachments.get({
    auth: oauth2Client,
    userId: user,
    messageId: message_id,
    id: attachment_id,
  });
  // console.log(res.data.data);
  // console.log("------------------------------------");
  // var test = base64url.decode(res.data.data);
  // console.log(base64url.fromBase64(res.data.data));
  // console.log(res.data.data);
  return base64url.decode(res.data.data);
};
const GetYoutubeVideo = async (id) => {
  const res = await youtube.videos.list({
    auth: oauth2Client,
    id: id,
    part: "snippet,contentDetails,statistics",
  });
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

const isWorkflow = async (service, action, trigger, reaction, id) => {
  var activated = 0;
  if (service === services[0]) {
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
  if (service === services[1]) {
    var item = await GetYoutubeVideo(id);
    item.forEach(function (items) {
      trigger = parseInt(trigger);
      console.log(items.statistics);
      const img = items.snippet.thumbnails.high;
      if (action === "likes") {
        const likes = items.statistics.likeCount;
        if (likes >= trigger) activated = 1;
      }
      if (action === "views") {
        const views = parseInt(items.statistics.viewCount);
        if (views >= trigger) activated = 1;
      }
      if (activated == 1) {
        if (reaction === "gmail") {
          console.log("OK");
          console.log(items.snippet.title);
          sendMail(
            user,
            items.snippet.title + " Reached " + trigger + " " + action,
            items.snippet.title +
              " Reached " +
              trigger +
              " " +
              action +
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
  if (service === services[2]) {
    var mail = await ListEmails();
    console.log(mail[0].id);
    var info = await GetMailInfo(mail[0].id);
    for (let i = 0; i < info.payload.headers.length; i++) {
      if (info.payload.headers[i].name == "Date")
        var mailDate = new Date(info.payload.headers[i].value);
    }
    if (mailDate > now) {
      console.log(info.payload.parts);
      for (let i = 0; i < info.payload.parts.length; i++) {
        console.log(info.payload.parts.length);
        if (info.payload.parts[i].body.attachmentId != undefined) {
          // console.log(info.payload.parts[i]);
          var data = await GetFileData(
            mail[0].id,
            info.payload.parts[i].body.attachmentId
          );
          var fileMetadata = {
            name: info.payload.parts[i].filename,
          };
          var media = {
            mimeType: info.payload.parts[i].mimeType,
            body: data,
          };

          try {
            const file = await drive.files.create({
              auth: oauth2Client,
              resource: fileMetadata,
              media: media,
              fields: "id",
            });
            console.log("File Id:", file.data.id);
            return file.data.id;
          } catch (err) {
            throw err;
          }
        }
      }
    }
    console.log(now);
    console.log(mailDate);
  }
};

router.post("/set_workflow", async function (req, res) {
  console.log(req.body);
  isWorkflow(
    req.body.service,
    req.body.action,
    req.body.trigger,
    req.body.reaction,
    req.body.id
  );
});

module.exports = router;
