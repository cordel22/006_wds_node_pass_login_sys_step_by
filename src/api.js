const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();
//		this doesnt work:(
app.set("views", __dirname + "/views");
app.set('view engine', 'ejs')

router.get("/", (req, res) => {

  res.json({
    hello: "figgure out views next ma niggaz!"
  });	/*	this doesnt work:(
  res.render('./views/index.ejs')	*/
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
