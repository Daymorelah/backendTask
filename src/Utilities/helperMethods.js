
class HelperMethods {
  /**
   * A method used to send server errors
   * @param {object} res - HTTP response object
   * @param {number} statusCode - HTTP status code for the error
   * @param {String} message - The error message you want to set.
   * @returns {object} res - The HTTP response object
   */
  static sendErrorMessage(res, statusCode, message) {
    return res.status(statusCode).json({
      success: false,
      message: message || 'Internal server error',
    });
  }
}

export default HelperMethods;
