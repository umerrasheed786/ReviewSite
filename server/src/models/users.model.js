const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      validate: /^[a-zA-Z\s]*$/i, //only letters and spaces
    },
    lastName: {
      type: String,
      required: true,
      validate: /^[a-zA-Z\s]*$/i, //only letters and spaces
    },
    phone: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // email format validation
        },
        message: "Invalid email format",
      },
    },
    photo: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      validate: {
        validator: function (value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+|~=-])/.test(value); // password complexity
        },
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    socialAccessToken: {
      type: String,
      default: "",
    },
    socialRefreshToken: {
      type: String,
      default: "",
    },
    resetPasswordToken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Define a pre-save hook to hash the password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      console.log("pre-save hook error", error);
    }
  }
  next();
});

// Define a method to verify the password
userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
