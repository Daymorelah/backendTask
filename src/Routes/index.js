import Controller from '../Controller';
import { validateUserInputs, Authenticate } from '../Utilities';

const routes = (app) => {
  app.get('/api/v1/', (req, res) => {
    res.status(200).send({ message: 'Welcome to the Hackerbay backend task' });
  });
  app.post(
    '/api/v1/auth/login',
    validateUserInputs.validateLogin,
    Controller.userLogin,
  );
  app.patch(
    'api/v1/apply/json_patch',
    Authenticate.checkToken,
    Controller.applyJsonPatch,
  );
};

export default routes;
