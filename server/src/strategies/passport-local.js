const { jwt_secret } = require("../config/vars");
const User = require("../models/users.model");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email  });
        if (!user) {
          return done(null, false, {
            status: 404,
            success: false,
            message: "User not found",
          });
        }
        console.log("user",user)
        const loginUser = await user.verifyPassword(password);
        if (!loginUser)
          return done(null, false, { message: "Invalid Credentials" });

        // if (!user.isEmailVerified) {
        //   return done(null,false,{ status: 403, message: `A verification link has been sent to your email address. Please follow the link in email to activate your account.
        //   If you don’t see the confirmation email, check your junk mail or spam folder.` });
        // }
        // user.lastActive = new Date();
        await user.save();
        return done(null, user, {
          // status: 200,
          // success: true,
          message: "Login successfully",
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: jwt_secret,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findOne({ where: { id: jwtPayload.data } });
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);



  
