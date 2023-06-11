const User = require("../models/users.model");
const fs = require("fs");
const path = require("path");
// const folderPath = path.join(`${__dirname}../../`);
// fs.unlinkSync(folderPath + file);

/**
 * View profile
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */

exports.view = async (req, res, next) => {
  try {
    // const { email } = req.body;
    const { id } = req.params;
    const user = await User.findOne({
      where: { id: id },
      attributes: {
        exclude: [
          "password",
          "agreedToTerms",
          "isEmailVerified",
          "socialAccessToken",
          "socialRefreshToken",
        ], // specify the column to exclude from the query result
      },
    });

    // If user is not found, send 404 error
    if (!user) {
      return res
        .status(404)
        .json({ status: 404, success: false, message: "User not found" });
    }

    // Otherwise, send back the user object

    return res.status(200).json({
      user,
      status: 200,
      success: true,
      message: "User fetch successfully",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 500, success: false, message: "Internal server error" });
  }
};

/**
 * update profile
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */

exports.update = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      title,
      phone,
      email,
      timeZone,
      isEmailVerified,
      dateFormat,
      timeFormat,
      emailOTP,
      phoneOTP,
    } = req.body;

    // Check for the presence of required fields
    if (!firstName || !lastName || !email) {
      // fs.unlinkSync(
      //   req.file.filename,
      //   path.join(__dirname, "")
      // );
      return res.status(400).json({
        status: 400,
        success: false,
        message: "firstName, lastName, and email are required",
      });
    }

    const updatedUser = await User.update(
      {
        firstName,
        lastName,
        title,
        phone,
        email,
        timeZone,
        dateFormat,
        isEmailVerified,
        timeFormat,
        photo: req?.file?.filename ?? req.body.image,
        emailOTP,
        phoneOTP,
      },
      { where: { email } }
    );

    if (updatedUser[0] === 0) {
      // If no rows were updated, the user was not found
      return res
        .status(404)
        .json({ status: 404, success: false, message: "User not found" });
    }

    // If one or more rows were updated, return a success response
    return res.status(200).json({
      status: 200,
      success: true,
      message: "User updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 500, success: false, message: "Internal server error" });
  }
};
