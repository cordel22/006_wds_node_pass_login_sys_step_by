const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

app.set('view-engine', 'ejs')

router.get("/", (req, res) => {
	/*
  res.json({
    hello: "no dvstart .env ma niggaz!"
  });	*/
  res.render('./views/index.ejs')
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
