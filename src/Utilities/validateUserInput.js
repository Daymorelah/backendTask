/**
 * Trims input values from user
 * @param {object} objectWithValuesToTrim - request body to trim
 * @returns {object} trimmedValues - trimmed values of the request object
 */
const trimValues = (objectWithValuesToTrim) => {
  const trimmedValues = objectWithValuesToTrim;
  Object.keys(trimmedValues).forEach((key) => {
    trimmedValues[key] = trimmedValues[key].trim();
  });
  return trimmedValues;
};

/**
 * Defines the failed message returned when required fields are missing.
 * @param {object} res - Response object
 * @param {string} message - specific error message
 * @returns {res} - Response object
 */
const allFieldsRequired = (res, message) => res.status(400).json({
  success: false,
  message: message || 'Invalid request. All fields are required',
});

/** class representing an handler's validation
 * @class Validate
 * @description Validation for user inputs in all requests
 */
class Validate {
  /**
   *
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request
   * to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateLogin(req, res, next) {
    req.body = trimValues(req.body);
    const { password, username } = req.body;
    if (password && username) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be more than 6 characters',
        });
      }
      if (username.length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Username must be more than 3 characters',
        });
      }
      return next();
    }
    return allFieldsRequired(res);
  }
}

export default Validate;
