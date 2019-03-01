import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';

chai.use(chaiHttp);
const { expect } = chai;
describe('Integration tests for the controller', () => {
  let myToken;
  describe('Integration test for the login feature', () => {
    it('should welcome the user to the api', (done) => {
      chai.request(app).get('/api/v1')
        .end((err, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.success).to.equal(true);
          expect(response.body.message).to.equal('Welcome to the Hackerbay backend task');
          done();
        });
    });
    it('should send a client error when an invalid URL is passed', (done) => {
      chai.request(app).get('/api/v2')
        .end((err, response) => {
          expect(response.status).to.equal(404);
          expect(response.body.success).to.equal(false);
          expect(response.body.message).to.equal('Page not found');
          done();
        });
    });
    it('should catch all other errors', (done) => {
      chai.request(app).get('/api/v1/a/%20%')
        .end((err, response) => {
          expect(response.status).to.equal(500);
          expect(response.body.success).to.equal(false);
          expect(response.body.message).to.equal('Something failed');
          done();
        });
    });
    it('should login a user ', (done) => {
      const userDetails = {
        username: 'my username',
        password: 'my password',
      };
      chai.request(app).post('/api/v1/auth/login')
        .send(userDetails)
        .end((err, response) => {
          myToken = response.body.userDetails.token;
          expect(response.status).to.equal(200);
          expect(response.body.success).to.equal(true);
          expect(response.body.message).to.equal('Login successful');
          expect(response.body.userDetails).to.be.an('object');
          expect(response.body.userDetails).to.have.property('username');
          expect(response.body.userDetails).to.have.property('token');
          expect(response.body.userDetails.username).to.equal('my username');
          expect(response.body.userDetails.token).to.be.a('string');
          done();
        });
    });
    it('should send a client error when required fields are missing', (done) => {
      const userDetails = {
        username: 'my username',
      };
      chai.request(app).post('/api/v1/auth/login')
        .send(userDetails)
        .end((err, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.success).to.equal(false);
          expect(response.body.message).to.equal('Invalid request. All fields are required');
          done();
        });
    });
    it('should send a client error when password is less than 6 characters', (done) => {
      const userDetails = {
        username: 'my username',
        password: 'may',
      };
      chai.request(app).post('/api/v1/auth/login')
        .send(userDetails)
        .end((err, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.success).to.equal(false);
          expect(response.body.message).to.equal('Password must be more than 6 characters');
          done();
        });
    });
    it('should send a client error when username is less than 2 characters', (done) => {
      const userDetails = {
        username: 'my',
        password: 'my password',
      };
      chai.request(app).post('/api/v1/auth/login')
        .send(userDetails)
        .end((err, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.success).to.equal(false);
          expect(response.body.message).to.equal('Username must be more than 3 characters');
          done();
        });
    });
  });
  describe('Integration test for the apply JSON patch feature', () => {
    const requestBody = {
      jsonObject: {
        firstName: 'demola',
        lastName: 'shuaib',
        age: 45,
      },
      jsonPatchObject: [
        {
          op: 'add',
          path: '/hairColour',
          value: 'black',
        },
      ],
    };
    it('should update an object using the patch method', (done) => {
      const expectedObject = {
        firstName: 'demola',
        lastName: 'shuaib',
        age: 45,
        hairColour: 'black',
      };
      chai.request(app).patch('/api/v1/apply/json_patch')
        .set({ 'x-access-token': myToken })
        .send(requestBody)
        .end((err, response) => {
          expect(response.status).to.equal(201);
          expect(response.body.success).to.equal(true);
          expect(response.body.newJsonObject).to.deep.equal(expectedObject);
          done();
        });
    });
    it('should send a client error when the request body does not contain an object', (done) => {
      const newRequestBody = { jsonObject: 'requestBody', jsonPatchObject: 'an object' };
      chai.request(app).patch('/api/v1/apply/json_patch')
        .set({ 'x-access-token': myToken })
        .send(newRequestBody)
        .end((err, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.success).to.equal(false);
          expect(response.body.message).to.equal('Invalid input fields. Only JSON objects are allowed.');
          done();
        });
    });
    it('should send a client error when the patch operation is not an add operation', (done) => {
      requestBody.jsonPatchObject[0].op = 'test';
      chai.request(app).patch('/api/v1/apply/json_patch')
        .set({ 'x-access-token': myToken })
        .send(requestBody)
        .end((err, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.success).to.equal(false);
          expect(response.body.message).to.equal('Only add operations are allowed');
          done();
        });
    });
    it('should send a client error when required fields are missing', (done) => {
      const myRequestBody = {
        jsonObject: {
          firstName: 'demola',
          lastName: 'shuaib',
          age: 45,
        },
      };
      chai.request(app).patch('/api/v1/apply/json_patch')
        .set({ 'x-access-token': myToken })
        .send(myRequestBody)
        .end((err, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.success).to.equal(false);
          expect(response.body.message).to.equal('Invalid request. All fields are required');
          done();
        });
    });
  });
  describe('Integration test for the create thumbnail feature', () => {
    it('should send a client error when an invalid image URL is sent', (done) => {
      chai.request(app).post('/api/v1/resize/image')
        .set({ 'x-access-token': myToken })
        .send({ imageUrl: 'some url' })
        .end((err, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.success).to.equal(false);
          expect(response.body.message).to.equal('Please enter a valid image URL');
          done();
        });
    });
    it('should send a client error when required fields are missing', (done) => {
      chai.request(app).post('/api/v1/resize/image')
        .set({ 'x-access-token': myToken })
        .send({ someKey: 'some value' })
        .end((err, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.success).to.equal(false);
          expect(response.body.message).to.equal('Invalid request. All fields are required');
          done();
        });
    });
  });
});
