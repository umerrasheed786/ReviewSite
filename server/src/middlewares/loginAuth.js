const passport = require("passport");
const { jwt_secret } = require("../config/vars");
var jwt = require("jsonwebtoken");
const APIError = require("../utils/APIError");

function loginAuth(req, res, next) {
  const { rememberme } = req.body;
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        throw new APIError({
          message: info?.message || "An error occured",
          status: info?.status || 403,
        });
      }
      var token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: user.id,
        },
        jwt_secret
      );
      if (rememberme == "true") {
        res.cookie("remember_token", token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }
      req.login(user, { session: false }, async (error) => {
        if (error) throw new APIError({ status: 500 });
        req.user = {
          data: user,
          status: 200,
          success: true,
          message: info.message,
          token,
        };
        next();
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
}
module.exports = loginAuth;
