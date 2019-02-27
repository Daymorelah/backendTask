import dotenv from 'dotenv';
import { HelperMethods, Authenticate } from '../Utilities';

dotenv.config();

/**
 * Class representing the user controller
 * @class UserController
 * @description users controller
 */
class UserController {
  /**
   * User Login
   * Route: POST: auth/login
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {res} res - Response object
   * @memberof UserController
   */
  static async userLogin(req, res) {
    const { username, password } = req.body;
    try {
      const tokenCreated = await Authenticate.getToken({
        username, password,
      });
      if (tokenCreated) {
        const userDetails = {
          username,
          token: tokenCreated,
        };
        res.status(200).json({
          success: true,
          message: 'Login successful',
          userDetails,
        });
      }
    } catch (error) {
      HelperMethods.serverError(res);
    }
  }
}

export default UserController;
