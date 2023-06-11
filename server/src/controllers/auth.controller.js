const {
  debugHttpRequestBody,
  debugHttpResponse,
  debugHttpError,
} = require("../utils/debug");
const APIError = require("../utils/APIError");
const User = require("../models/users.model");
const { jwt_secret, resetPasswordKey, frontendUrl } = require("../config/vars");
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { verifyRecaptchaHelper } = require("../utils/captchaVerify");
const emailTemplate = require("../models/emailTemplate.model");
/**
 * Create a fresh user into the database
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */

exports.create = async (req, res, next) => {
  debugHttpRequestBody(`req.body`, req.body);
  try {
    debugHttpResponse(`res`);
    const { firstName, lastName, password, email } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "firstName, lastName, and email are required",
      });
    }
    // check if user with this email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: 409,
        success: false,
        message: "User with this email already exists",
      });
    }
    //captcah verification check
    // create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });
    const payload = {
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 30, // expiration time in seconds
    };

    // Generate the JWT with the payload and secret key
    const token = jwt.sign(payload, jwt_secret);
    const html = await emailTemplate.findOne({
      where: { name: "verify-email-before-success" },
      attributes: ["markUp"],
    });
    if (html) {
      var template = html?.markUp;
      var fullname = user?.firstName + " " + user?.lastName;
      template = template
        .replace("NAME", fullname)
        .replace("FRONTEND_URL", `${frontendUrl}/dashboard`)
        .replace("TOKEN", token);
      var subject = "email verification";
      var emailSent = await sendMail(user.email, template, subject);
    }

    const data = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    if (emailSent) {
      res.status(201).json({
        status: 201,
        success: true,
        message: "User created successfully and email sent successfully",
        data,
      });
    } else {
      res.status(202).json({
        status: 202,
        success: true,
        message: "User created successfully and email has not been sent!",
        data,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * verifies email
  @param {} req
  @param {} res
  @param {} next
 * @returns {JSON}
 */

exports.verifyEmail = async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.params.token, jwt_secret);

    const user = await User.findOne({
      where: { email: decoded.email },
    });
    // Check if the token has expired
    if (decoded.exp < Date.now() / 1000) {
      return res
        .status(402)
        .json({ success: false, status: 402, message: "Token expired" });
    }

    //Check if user not found
    if (!user) {
      return res
        .status(404)
        .json({ success: false, status: 404, message: "User not found" });
    }

    // Check if the email has already been verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Email already verified",
      });
    }
    // Update the user's emailVerified flag to true
    await user.update({ isEmailVerified: true });

    var token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: user.id,
      },
      jwt_secret
    );
    res.status(200).json({
      success: true,
      status: 200,
      message: "Email address verified successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * reset password of a user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */

exports.changePassword = async (req, res, next) => {
  debugHttpRequestBody(`req.body`, req.body);
  const { currentPassword, newPassword, passwordConfirmation } = req.body;
  const { user } = req;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    if (!user)
      throw new APIError({
        status: 404,
        message: "user not found",
        success: false,
      });
    const isPasswordValid = await user.verifyPassword(currentPassword);
    if (!isPasswordValid)
      throw new APIError({
        status: 403,
        message: "password is incorrect",
        success: false,
      });
    if (newPassword !== passwordConfirmation) {
      throw new APIError({
        status: 403,
        message: "Password does not match with confirm password",
        success: false,
      });
    }
    if (currentPassword === newPassword) {
      throw new APIError({
        status: 403,
        message: "Your new password cannot be same with previous password",
        success: false,
      });
    }
    user.password = newPassword;
    await user.save();
    const html = await emailTemplate.findOne({
      where: { name: "change-password-template" },
      attributes: ["markUp"],
    });
    if (html) {
      var template = html?.markUp;
      template = template
        .replace("firstName", user.firstName)
        .replace("lastName", user.lastName)
        .replace("url", `${frontendUrl}/auth`);
      const subject = "change password request";
      var emailSent = await sendMail(user.email, template, subject);
    }
    res.status(emailSent ? 200 : 202).json({
      status: emailSent ? 200 : 202,
      success: true,
      message: emailSent
        ? "password updated and email was sent"
        : "password updated but couldnt send email",
    });
  } catch (error) {
    debugHttpError("error", error);
    next(error);
  }
};

/**
 * login user 
  @param {} req
  @param {} res
  @param {} next
 * @returns {JSON}
 */

exports.login = async (req, res, next) => {
  try {
    if (!req.user) throw new APIError({ message: "Login failed", status: 500 });
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};
/**
 * reset password of a user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
exports.verifyToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    console.log("token=======================",req.body);
    const decoded = jwt.verify(token, jwt_secret);
    const user = await User.findOne({
      _id: decoded.data,
    }).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, status: 404, message: "User not found" });
    }

    res.status(200).json({
      user,
      success: true,
      status: 200,
      message: "User successfully retrieved",
    });
  } catch (error) {
    debugHttpError("error", error);
    next(error);
  }
};

/**
 * Re-send Email to user for verification
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
exports.resendEmail = async (req, res, next) => {
  try {
    debugHttpRequestBody(`req.body`, req.body);
    debugHttpResponse(`res`);
    const { email } = req.body;

    // check if user with this email already exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User with this email does not exist",
      });
    }
    // Check if the email has already been verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Email already verified",
      });
    }
    const payload = {
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 30, // expiration time in seconds
    };
    const token = jwt.sign(payload, jwt_secret);
    const html = await emailTemplate.findOne({
      where: { name: "verify-email-before-success" },
      attributes: ["markUp"],
    });
    if (html) {
      var template = html?.markUp;
      var fullname = user?.firstName + " " + user?.lastName;
      template = template
        .replace("NAME", fullname)
        .replace("FRONTEND_URL", `${frontendUrl}/dashboard`)
        .replace("TOKEN", token);
      var subject = "email verification";
      var emailSent = await sendMail(user.email, template, subject);
    }

    // return success response with new user data
    res.status(emailSent ? 200 : 400).json({
      status: emailSent ? 200 : 400,
      message: emailSent
        ? `email sent successfully to ${user?.email}`
        : `email couldn't be sent  to ${user?.email}`,
      success: false,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * forgot password
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new APIError({
        message: "user not found",
        status: 404,
        success: false,
      });
    }
    // generate and save JWT token to database
    var token = jwt.sign({ id: user.id }, resetPasswordKey, {
      expiresIn: "15m",
    });
    user.resetPasswordToken = token;
    await user.save();
    // send password reset link email
    const html = await emailTemplate.findOne({
      where: { name: "password-reset-template" },
      attributes: ["markUp"],
    });
    if (html) {
      var template = html?.markUp;
      template = template
        .replace("firstName", user.firstName)
        .replace("lastName", user.lastName)
        .replace("url", `${frontendUrl}/auth/new-password/${token}`);
      const subject = "password reset request";
      var emailSent = await sendMail(user.email, template, subject);
    }
    res.status(200).json({
      success: true,
      status: 200,
      message: emailSent
        ? `email sent successfully to ${user?.email}`
        : `email couldn't be sent  to ${user?.email}`,
    });
  } catch (error) {
    debugHttpError("error", error);
    next(error);
  }
};
/**
 * reset password
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */

exports.resetPassword = async (req, res, next) => {
  try {
    const { newPassword, passwordConfirmation, verifyToken } = req.body;
    const decoded = jwt.verify(verifyToken, resetPasswordKey);
    const user = await User.findOne({
      where: { id: decoded.id },
    });
    if (!user) {
      throw new APIError({
        message: "Invalid or expired token",
        status: 404,
        success: false,
      });
    }
    if (!user.resetPasswordToken) {
      throw new APIError({
        message:
          "You can only reset password once with this token please re-generate request using new email",
        status: 404,
        success: false,
      });
    }
    if (newPassword !== passwordConfirmation) {
      throw new APIError({
        status: 403,
        message: "Password does not match with confirm password",
        success: false,
      });
    }
    user.password = newPassword;
    user.resetPasswordToken = null;
    await user.save();
    res.status(200).json({
      success: true,
      status: 200,
      message: "Password reset successfull",
    });
  } catch (error) {
    debugHttpError("error", error);
    next(error);
  }
};
