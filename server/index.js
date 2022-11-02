const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const googlerouter = require("./services/google.js");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(process.env.PORT || 8080, () => {
  console.log("listening on port 8080");
});

app.use("/google", googlerouter);
