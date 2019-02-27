const routes = (app) => {
  app.get('/api/v1/', (req, res) => {
    res.status(200).send({ message: 'Welcome to the Hackerbay backend task' });
  });
};

export default routes;
