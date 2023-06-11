// Import required modules and functions
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const createOrUpdateProfile = require("../utils/socialLogs");

// Import configuration variables
const {
  googleClientID,
  googleClientSecret,
  googleClientCalback,
} = require("../config/vars");

// Export the Passport.js middleware function
module.exports = (passport) => {
  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: googleClientCalback,
        accessType: "offline",
        prompt: "consent",
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          const user = await createOrUpdateProfile(
            profile.name.givenName,
            profile.name.familyName,
            profile.email
          );
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
