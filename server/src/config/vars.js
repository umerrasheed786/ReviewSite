var configOptions = {};
if (process.env.NODE_ENV) {
  configOptions = { path: `.env.${process.env.NODE_ENV}` };
}
require("dotenv").config(configOptions); //get env file based on script NODE_ENV==="cross-env" in package.json

module.exports = {
  googleClientID: process.env.googleClientID,
  googleClientSecret: process.env.googleClientSecret,
  googleClientCalback: process.env.googleClientCalback,
  facebookAppID: process.env.facebookAppID,
  facebookAppSecret: process.env.facebookAppSecret,
  facebookAppCallback: process.env.facebookAppCallback,
  EMAIL_SERIVICE: process.env.EMAIL_SERIVICE,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
  resetPasswordKey: process.env.RESET_PASSWORD_KEY,
  frontendUrl:process.env.FRONTEND_URL,
  baseUrl:process.env.BASE_URL,
  dbConfig: {
    MONGO_URI:process.env.MONGO_URI
  },
};
