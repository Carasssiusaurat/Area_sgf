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
var accessToken = "";
var refreshToken = "";
var tentative_refresh = 2;

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

const send_accessToken = async (user_id, service_id) => {
  response = await addservice_copy(
    user_id,
    service_id,
    accessToken,
    refreshToken
  );
  if (response.status === 200) console.log("service added");
  return response;
};

router.get("/handleGoogleRedirect", async (req, res) => {
  const code = req.query.code;
  const user_id = req.query.state.split(",")[0].split("=")[1];
  const service_id = req.query.state.split(",")[1].split("=")[1];

  oauth2Client.getToken(code, async (err, tokens) => {
    if (err) {
      console.log("server 43 | error", err);
      throw new Error("Issue with Login", err.message);
    }
    accessToken = tokens.access_token;
    refreshToken = tokens.refresh_token;

    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const response = await send_accessToken(user_id, service_id);
    if (response.status != 200) console.log("error");
    res.redirect("http://localhost:8081/home");
  });
});

const Getmail = async (token) => {
  const { data } = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + token
  );
  console.log(data.email);
  return data.email;
};

const getValidToken = async (refresToken) => {
  try {
    const request = await fetch("https://www.googleapis.com/oauth2/v4/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refresToken,
        grant_type: "refresh_token",
      }),
    });

    const data = await request.json();
    console.log(data.access_token);
    return ({ "status": "success", content: data.access_token})
  } catch (error) {
    console.log(error)
    return ({ "status": "error", content: error});
  }
};

const Getcalendar = async (args, token, user, service_id) => {
  oauth2Client.setCredentials({ access_token: token[0] });
  const res = await calendar.events
    .list({
      auth: oauth2Client,
      calendarId: "primary",
    })
    .catch((error) => {
      if (error.response.status == 401 && tentative_refresh > 0) {
        tentative_refresh--;
        const response = await getValidToken(token[1]);
          if (response.status === "error") {
            console.log(response.content);
            return { "status": "error" }
          } else {
            console.log("new token = " + response.content);
            for (var i = 0; i < user.services.length; i++) {
              if (user.services[i]._id == service_id.toString()) {
                user.services[i].access_token = response.content;
                user.save();
              }
            }
          }
          Getcalendar(args, token, user, service_id);
        };
        if (error.response.status == 401) {
          console.log("token expired please reconnect");
          return { "status": "error" }
        }
        tentative_refresh = 2;
        return {"status": "error"};
      });
  trigger = parseInt(args[0]) * 60000;
  const now = new Date();
  const expected_time = new Date(now.getTime() + trigger);
  console.log(expected_time);
  for (var i = 0; i < res.data.items.length; i++) {
    const time_of_event = new Date(res.data.items[i].start.dateTime);
    if (
      expected_time > time_of_event &&
      new Date(now.getTime()) < time_of_event
    ) {
      return { status: "success" };
    }
  }
  return { status: "fail" };
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

const GetMailInfo = async (args, token, user) => {
  oauth2Client.setCredentials({ access_token: token[0] });
  const res = await gmail.users.messages.list({
    auth: oauth2Client,
    userId: user,
    q: "from:" + args[0],
    maxResults: 1,
  });
  if (!res.data.messages) return false;
  return res.data.messages[0].id;
};

const ListEmails = async (args, token) => {
  const user = await Getmail(token[0]);
  var mail = await GetMailInfo(args, token, user);
  if (mail === false) return { status: "fail" };

  oauth2Client.setCredentials({ access_token: token[0] });
  const res = await gmail.users.messages.get({
    auth: oauth2Client,
    userId: user,
    id: mail,
  });
  const now = new Date();
  var nowDate = new Date(now.getTime() - 30000);
  for (let i = 0; i < res.data.payload.headers.length; i++) {
    if (res.data.payload.headers[i].name == "Date")
      var mailDate = new Date(res.data.payload.headers[i].value);
  }
  console.log(mailDate);
  console.log(nowDate);
  console.log(now);
  if (mailDate > nowDate) return { status: "success" };
  return { status: "fail" };
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

const GetYoutubeVideo = async (args, token) => {
  oauth2Client.setCredentials({ access_token: token[0] });
  const res = await youtube.videos.list({
    auth: oauth2Client,
    id: args[0],
    part: "snippet,contentDetails,statistics",
  });
  trigger = parseInt(args[2]);
  const views = parseInt(res.data.items[0].statistics.viewCount);
  console.log(views);
  console.log(trigger);
  if (args[1] === "likes") {
    const likes = parseInt(res.data.items[0].statistics.likeCount);
    if (likes >= trigger) return { status: "success" };
  }
  if (args[1] === "views") {
    const views = parseInt(res.data.items[0].statistics.viewCount);
    if (views >= trigger) return { status: "success" };
  }
  // }
  return { status: "fail" };
};

async function sendMail(args, token) {
  oauth2Client.setCredentials({
    access_token: token[0],
    refresh_token: token[1],
  });
  const user = await Getmail(token[0]);
  try {
    accessToken = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: user,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: token[1],
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "AREA " + "<" + user + ">",
      to: args[0],
      subject: args[1],
      text: args[2],
      html: "<h1>" + args[2] + "</h1>",
    };

    const result = await transport.sendMail(mailOptions);
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
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
        console.log("ca marche");
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

module.exports = { router, Getcalendar, GetYoutubeVideo, ListEmails, sendMail };
