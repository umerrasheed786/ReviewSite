const express = require("express");
const router = express.Router();

const emailTemplatesController = require("../controllers/emailTemplate.controller");

router.post("/", emailTemplatesController.createEmailTemplate);
router.get("/:id", emailTemplatesController.getEmailTemplate);
router.get("/", emailTemplatesController.getEmailTemplates);
router.put("/:id", emailTemplatesController.updateEmailTemplate);
router.delete("/:id", emailTemplatesController.deleteEmailTemplate);

module.exports = router;
