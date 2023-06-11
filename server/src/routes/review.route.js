const express = require("express");
const router = express.Router();

const controller = require("../controllers/review.controller");

router.get('/', controller.getAllReviews);
router.get('/:id', controller.getReviewById);
router.post('/', controller.createReview);
router.put('/:id', controller.updateReview);
router.delete('/:id',controller.deleteReview);

module.exports = router;
