import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import routes from './Routes';

const app = express();
const port = process.env.PORT || 2000;

/* istanbul ignore next */
if (app.get('env') !== 'test') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routes(app);

// Catch all invalid routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Page not found',
  });
});

// Catch all errors not handled by routes
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: 'Something failed',
  });
  next();
});

/* eslint-disable no-console */
app.listen(port, (error) => {
  /* istanbul ignore next */
  if (error) {
    console.log(`An error occurred try to start the sever. Error is ${error}`);
  } else {
    console.log(`Server is up and running on port ${port} ...`);
  }
});

export default app;
