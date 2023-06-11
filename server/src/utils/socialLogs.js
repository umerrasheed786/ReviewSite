const APIError = require("./APIError");
const User = require("../models/users.model");
// const APIError = require("../../../../utils/APIError");
/**
 * Creates or updates a user profile based on the provided information.
 *
 * @param {string|null} displayName - The display name of the user, or null if not available.
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} imageUrl - The URL of the user's profile picture.
 * @param {string} accessToken - The access token for the user's authentication provider.
 * @param {string} refreshToken - The refresh token for the user's authentication provider.
 * @param {string} provider - The name of the user's authentication provider.
 *
 * @returns {Promise<object>} A promise that resolves with the newly created or updated user object.
 *
 * @throws {APIError} If an error occurs during the operation.
 */
async function createOrUpdateProfile(
  firstName,
  lastName,
  email,
) {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const user = await User.create({
        email,
        isEmailVerified: true,
        firstName: firstName || "NA",
        lastName: lastName || "NA",
      });
      return user;
    }
    await user.save();
    return user;
  } catch (error) {
    throw new APIError(error);
  }
}

module.exports = createOrUpdateProfile;
