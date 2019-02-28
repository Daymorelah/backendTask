import dotenv from 'dotenv';
import jsonPatch from 'json-patch';
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

  /**
   * Apply JSON patch
   * Route: PATCH: apply/json_patch
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {res} res - Response object
   * @memberof UserController
   */
  static async applyJsonPatch(req, res) {
    const { jsonObject, jsonPatchObject } = req.body;
    try {
      const newJsonObject = jsonPatch.apply(jsonObject, jsonPatchObject);
      res.status(201).json({ newJsonObject });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default UserController;
