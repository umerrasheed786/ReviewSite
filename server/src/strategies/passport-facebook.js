// Require the passport-facebook Strategy
const FacebookStrategy = require("passport-facebook").Strategy;

// Import createOrUpdateProfile function from socialLogs.js
const createOrUpdateProfile = require("../utils/socialLogs");

// Import the necessary variables from vars.js file
const {
  facebookAppID,
  facebookAppSecret,
  facebookAppCallback,
} = require("../config/vars");

module.exports = (passport) => {
  // Serialize the user object to save user session data
  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  // Deserialize the user object to retrieve user session data
  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });

  // Define the 'facebook' Passport authentication strategy
  passport.use(
    "facebook",
    new FacebookStrategy(
      {
        // Use the Facebook App ID to authenticate
        clientID: facebookAppID,
        // Use the Facebook App Secret to authenticate
        clientSecret: facebookAppSecret,
        // Set the callback URL to the value specified in vars.js
        callbackURL: facebookAppCallback,
        // Specify the fields to retrieve from the Facebook profile
        profileFields: ["id", "displayName", "photos", "email"],
      },
      // Use the 'createOrUpdateProfile' function to create or update user profile
      async (accessToken, refreshToken, profile, done) => {
        try {
          var firstName;
          var lastName;
          if (
            !profile.name.familyName &&
            !profile.name.givenName &&
            !profile.name.middleName
          ) {
            const { displayName } = profile;
            var nameArray = displayName.split(" ");
            firstName = nameArray[0];
            lastName = nameArray[1];
          } else {
            firstName = profile.name.givenName;
            lastName = profile.name.familyName;
          }
          const user = await createOrUpdateProfile(
            firstName,
            lastName,
            profile.emails[0].value,
            accessToken,
            refreshToken
          );

          return done(null, user);
        } catch (error) {
          return done(err);
        }
      }
    )
  );
};
