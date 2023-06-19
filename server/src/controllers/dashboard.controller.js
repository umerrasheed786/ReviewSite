const User = require("../models/users.model");
const Review = require("../models/reviews.model");
exports.allCounts = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    const commentsCount = await User.countComments();
    res.status(200).json({
      count: userCount,
    });
  } catch (err) {}
};
