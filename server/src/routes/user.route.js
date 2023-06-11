var express = require("express");
var router = express.Router();
const profileController = require("../controllers/profile.controller");
const { uploadSingle } = require("../utils/multer");

router.route("/profile").put(uploadSingle, profileController.update);
router.route("/profile/:id").get(profileController.view);

module.exports = router;
