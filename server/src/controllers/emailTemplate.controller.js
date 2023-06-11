const EmailTemplate = require("../models/emailTemplate.model");
const APIError = require("../utils/APIError");

// CREATE
exports.createEmailTemplate = async (req, res, next) => {
  try {
    const { name, markUp } = req.body;
    const email = await EmailTemplate.findOne({ where: { name } });
    if (email) {
      return res.status(402).json({
        message: "Email template already exists.",
        success: false,
        status: 402,
      }); // if no record is found, return a 404 error
    }
    const newTemplate = await EmailTemplate.create({ name, markUp }); // create a new record with the given name and markup
    res.status(201).json({
      success: true,
      status: 201,
      message: "Email template created successfully",
      template: newTemplate,
    });
  } catch (error) {
    console.error(error);
    next(new Error("Failed to create email template."));
  }
};

// READ
exports.getEmailTemplate = async (req, res, next) => {
  const { id } = req.params;
  try {
    const template = await EmailTemplate.findByPk(id); // find the record with the given primary key
    if (!template)
      return res.status(404).json({
        message: "Email template not found.",
        success: false,
        status: 404,
      }); // if no record is found, return a 404 error
    res.status(200).json({
      success: true,
      status: 200,
      message: "Fetched Email Template Successfully",
      template: template,
    });
  } catch (error) {
    console.error(error);
    next(new Error("Failed to get email template."));
  }
};
// READ all templates
exports.getEmailTemplates = async (req, res, next) => {
  try {
    const template = await EmailTemplate.findAll({}); // find the record with the given primary key
    if (template.length == 0)
      return res.status(404).json({
        message: "Email templates not found.",
        success: false,
        status: 404,
      }); // if no record is found, return a 404 error
    res.status(200).json({
      success: true,
      status: 200,
      message: "Fetched Email Template Successfully",
      template: template,
    });
  } catch (error) {
    console.error(error);
    next(new Error("Failed to get email template."));
  }
};

// UPDATE
exports.updateEmailTemplate = async (req, res, next) => {
  const { id } = req.params;
  const { name, markUp } = req.body;
  try {
    const template = await EmailTemplate.findByPk(id); // find the record with the given primary key
    if (!template)
      return res.status(404).json({
        message: "Email template not found.",
        success: false,
        status: 404,
      }); // if no record is found, return a 404 error
    await template.update({ name, markUp }); // update the name and markup of the found record
    res.status(200).json({
      success: true,
      status: 200,
      message: "Updated Successfully",
      template: template,
    });
  } catch (error) {
    console.error(error);
    next(new Error("Failed to update email template."));
  }
};

// DELETE
exports.deleteEmailTemplate = async (req, res, next) => {
  const { id } = req.params;
  try {
    const template = await EmailTemplate.findByPk(id); // find the record with the given primary key
    if (!template)
      return res.status(404).json({
        message: "Email template not found.",
        success: false,
        status: 404,
      }); // if no record is found, return a 404 error
    await template.destroy(); // delete the found record
    res.status(200).json({
      success: true,
      status: 200,
      message: "Deleted Successfully",
      template: template,
    });
  } catch (error) {
    console.error(error);
    next(new Error("Failed to delete email template."));
  }
};
