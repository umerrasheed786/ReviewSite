var express = require("express");
var router = express.Router();
const authModule = require("../routes/auth.route");
const userModule = require("./user.route");
const emailTemplate = require("../routes/emailTemplate.route");
const reviewModule = require("../routes/review.route");

router.use("/auth", authModule);
router.use("/user", userModule);
router.use("/email-template", emailTemplate);
router.use("/review", reviewModule);

module.exports = router;
