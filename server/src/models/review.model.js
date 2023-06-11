const mongoose = require("mongoose");


// Define the Review schema
const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    // required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    // required: true,
  },
  category: {
    type: String,
    // required: true,
  },
  //   images: [String],
  //   pros: [String],
  //   cons: [String],
  upVotes: {
    type: Number,
    default: 0,
  },
  downVotes: {
    type: Number,
    default: 0,
  },

//   likes: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "users",
//     },
//   ],
//   comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Review model
module.exports = mongoose.model("reviews", reviewSchema);
