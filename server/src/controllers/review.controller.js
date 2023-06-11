// Import required modules and models
const Review = require("../models/review.model");

// GET all reviews
exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    res
      .status(200)
      .json({
        success: true,
        data: reviews,
        message: "Reviews fetched successfully",
      });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// GET a single review by ID
exports.getReviewById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const review = await Review.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        data: review,
        message: "Review fetched successfully",
      });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// POST a new review
exports.createReview = async (req, res, next) => {
  const { title, rating, content, user, category } = req.body;
  try {
    const newReview = await Review.create({
      title,
      rating,
      content,
      user,
      category,
    });
    res
      .status(201)
      .json({
        success: true,
        data: newReview,
        message: "Review created successfully",
      });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// PUT update a review by ID
exports.updateReview = async (req, res, next) => {
  const { id } = req.params;
  const { title, rating, content, category,downVotes ,upVotes} = req.body;
  try {
    if (downVotes) {
      await downVoteReview(id);
    }
    if (upVotes) {
      await upVoteReview(id);
    }
    let update = {};
    update.title = title;
    update.rating = rating;
    update.content = content;
    update.category = category;
    const updatedReview = await Review.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!updatedReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        data: updatedReview,
        message: "Review updated successfully",
      });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// DELETE a review by ID
exports.deleteReview = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        data: deletedReview,
        message: "Review deleted successfully",
      });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const upVoteReview = async (reviewId) => {
  try {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { upVotes: 1 } }, // Increment upvotes by 1
      { new: true }
    );
    return review;
  } catch (error) {
    throw new Error("Failed to upvote review");
  }
};

const downVoteReview = async (reviewId) => {
  try {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { downVotes: 1 } }, // Increment downvotes by 1
      { new: true }
    );
    return review;
  } catch (error) {
    throw new Error("Failed to downvote review");
  }
};
