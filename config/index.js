const database = require("./database");
const session = require("./session");
const layout = require("./layout");
require("dotenv").config();
module.exports = {
  database,
  session,
  layout,
  debug: true,
  port: process.env.APPLICATION_PORT,
  cookie_secretkey: "ksbc3cee5uh7gj70h0ldhb6dg5",
  siteurl: process.env.WEBSITE_URL,
};
