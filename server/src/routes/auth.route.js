var express = require("express");
var router = express.Router();
const controller = require("../controllers/auth.controller");
const requireAuth = require("../middlewares/requireAuth");
const loginAuth = require("../middlewares/loginAuth");
const getBrowserInfo = require("../middlewares/getBrowserInfo");

router.route("/signup").post(controller.create);
router.route("/verify-email/:token").get(controller.verifyEmail);
router.route("/change-password").patch(requireAuth,getBrowserInfo,controller.changePassword);
router.route("/resend-email").post(controller.resendEmail);
router.route("/login").post(loginAuth, controller.login);
router.route("/verify-token").post(controller.verifyToken);
router.route("/forgot-password").post(controller.forgotPassword);
router.route("/reset-password").post(controller.resetPassword);


module.exports = router;
