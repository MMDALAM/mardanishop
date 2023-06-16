const MongoStore = require("connect-mongo");

module.exports = {
  name: "session",
  secret: process.env.SESSION_SECRETKEY,
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
};
