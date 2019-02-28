import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import HelperMethods from './helperMethods';

dotenv.config();
const secret = process.env.SECRET;

/**
 * Class representing authenticating a request form a user
 */
class Authenticate {
  /**
   *
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   */
  /* eslint-disable consistent-return */
  static async checkToken(req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) return res.status(401).json({ message: 'User not authorized' });
    try {
      const decodedToken = await jwt.verify(token, secret);
      req.decoded = decodedToken;
      next();
    } catch (error) {
      return HelperMethods.sendErrorMessage(res, 401, 'Authentication failed');
    }
  }

  /**
   *
   * @param {object} payload - Payload object for the JWT
   * @returns {string} - token being created
   */
  static async getToken(payload) {
    try {
      const tokenCreated = await jwt.sign(payload, secret, { expiresIn: '10h' });
      return tokenCreated;
    } catch (error) {
      throw error;
    }
  }
}

export default Authenticate;
