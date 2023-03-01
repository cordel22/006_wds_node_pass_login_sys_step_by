const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    hello: "dotenv ejs a shit ma niggaz!"
  });
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
