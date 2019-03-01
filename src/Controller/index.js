import dotenv from 'dotenv';
import jsonPatch from 'json-patch';
import jimp from 'jimp';
import path from 'path';
import { HelperMethods, Authenticate } from '../Utilities';

dotenv.config();

/**
 * Class representing the user controller
 * @class UserController
 * @description users controller
 */
class Controller {
  /**
   * User Login
   * Route: POST: auth/login
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {res} res - Response object
   * @memberof UserController
   */
  /* eslint-disable consistent-return */
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
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          userDetails,
        });
      }
    } catch (error) {
      return HelperMethods.sendErrorMessage(res, 500);
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
      const newJsonObject = await jsonPatch.apply(jsonObject, jsonPatchObject);
      return res.status(201).json({
        success: true,
        newJsonObject,
      });
    } catch (error) {
      return HelperMethods.sendErrorMessage(res, 400, error.message);
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
  static createThumbnail(req, res) {
    const { imageUrl } = req.body;
    jimp.read(imageUrl).then((image) => {
      image.resize(50, 50).write(path.resolve(__dirname, '../image', `newImage.${image.getExtension()}`),
        (error, resizedImage) => {
          if (error) {
            return HelperMethods
              .sendErrorMessage(res, 401, error.message);
          }
          return res.status(200).json({
            success: true,
            message: 'Image resized successfully',
            resizedImage,
          });
        });
    }).catch(error => HelperMethods.sendErrorMessage(res, 500, error.message));
  }
}

export default Controller;
