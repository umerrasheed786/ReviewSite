const axios = require("axios");
require("dotenv").config();
exports.verifyRecaptchaHelper = async (responseToken) => {
  const secret = process.env.CAPTCHA_SECRET;

  const response = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    null,
    {
      params: {
        secret: secret,
        response: responseToken,
      },
    }
  );
  if (response.data.success) {
    return true;
  } else {
    return false;
  }
};
