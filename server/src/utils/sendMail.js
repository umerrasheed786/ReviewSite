const nodemailer = require("nodemailer");
const {
  EMAIL_SERIVICE,
  EMAIL_PASSWORD,
  EMAIL_USERNAME,
} = require("../config/vars");
const transporter = nodemailer.createTransport({
  service: EMAIL_SERIVICE,
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD,
  },
});

// function to send verification email
const sendMail = async (email, template, subject) => {
  try {
    // send verification email
    transporter.sendMail(
      {
        to: email,
        subject: subject,
        html: template,
      },
      (error, info) => {
        if (error) {
          console.log(error);
          return false;
        }
        return true;
      }
    );
    return true;
  } catch (error) {
    return false;
  }
};
module.exports = sendMail;
