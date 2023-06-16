const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("app/models/user");

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  "local.login",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) return done(err);

        if (!user || !user.comparePassword(password)) {
          return done(
            null,
            false,
            req.flash("errors", "اطلاعات وارد شده مطابقت ندارد")
          );
        }

        done(null, user);
      });
    }
  )
);
