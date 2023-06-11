const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  googleStrategy,
  googleCallback,
  facebookStrategy,
  facebookCallback,
} = require("../controllers/social.controller");

router.route("/google").get(googleStrategy);
router.route("/google/callback").get(googleCallback);
router.route("/facebook").get(facebookStrategy);
router.route("/facebook/callback").get(facebookCallback);

module.exports = router;
