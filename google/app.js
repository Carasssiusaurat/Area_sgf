const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const date = require("date-and-time");

const CLIENT_ID =
  "698781251534-fotlmmtedse2pe9ka44tkgrrufsmtbei.apps.googleusercontent.com";
const CLEINT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//043A3iOX_1y-2CgYIARAAGAQSNwF-L9IrAN_5iDc2NEuS4_Dkgnhr7YjE3IqlrEw6xHoG_EWYXklIswUc2McWgb3ZEyN0g9RSsgQ";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const calendar = google.calendar("v3");

async function main() {
  const res = await calendar.events.list({
    auth: oAuth2Client,
    calendarId: "primary",
  });
  console.log(res.data);
  const item = res.data.items;
  item.forEach(function (items) {
    const dateTime = new Date(items.start.dateTime);
    const nowDate = new Date();
    console.log(dateTime);
    console.log(nowDate);
    const diffTime = Math.abs(nowDate - dateTime);
    console.log(diffTime);
    if (diffTime <= 600000 && nowDate < dateTime) {
      console.log("OK");
      sendMail(items)
        .then((result) => console.log("Email sent...", result))
        .catch((error) => console.log(error.message));
    }
  });
}

async function sendMail(items) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "area.epiteech@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
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

main().catch((e) => {
  console.error(e);
  throw e;
});
