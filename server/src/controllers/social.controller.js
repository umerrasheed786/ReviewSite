const passport = require("passport");
const { jwt_secret, baseUrl } = require("../config/vars");
var jwt = require("jsonwebtoken");
exports.googleStrategy = async (req, res) => {
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/calendar",
    ],
    accessType: "offline",
  })(req, res);
};

exports.googleCallback = async (req, res, next) => {
  passport.authenticate(
    "google",
    {
      failureRedirect: "/auth/social/failure",
      failureMessage: true,
    },
    async (err, user, info) => {
      if (err) {
        return next(err);
      }
      var token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: user.id,
        },
        jwt_secret
      );
      res.redirect(`${baseUrl}dashboard?social_token=${token}`);
    }
  )(req, res);
};

exports.facebookStrategy = async (req, res) => {
  passport.authenticate("facebook", { scope: ["email"] })(req, res);
};
exports.facebookCallback = async (req, res, next) => {
  passport.authenticate(
    "facebook",
    {
      failureRedirect: "/auth/social/failure",
      failureMessage: true,
    },
    (err, user, info) => {
      if (err) {
        return next(err);
      }
      var token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: user.id,
        },
        jwt_secret
      );
      res.redirect(`${baseUrl}dashboard?social_token=${token}`);
    }
  )(req, res, next);
};
