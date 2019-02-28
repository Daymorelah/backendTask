import sinon from 'sinon';
import chai from 'chai';
import Controller from '../src/Controller';
import { Authenticate } from '../src/Utilities';

const { expect } = chai;

const req = {
  body: {
    username: 'my username',
    password: 'my password',
  },
};

const res = {
  status() {
    return this;
  },
  json(obj) {
    return obj;
  },
};

describe('Unit test for the controller', () => {
  describe('Test all methods of the class to be sure they are available', () => {
    it('userSignup should be a method', () => {
      expect(Controller.userLogin).to.be.a('function');
    });
    it('should be a method completeRegistration', () => {
      expect(Controller.applyJsonPatch).to.be.a('function');
    });
    it('should be a method userRole', () => {
      expect(Controller.createThumbnail).to.be.a('function');
    });
  });
  describe('Test userLogin method in the controller class', () => {
    it('should login a user ', async () => {
      const stubGetTokenMethod = sinon.stub(Authenticate, 'getToken').returns('my token');
      const response = await Controller.userLogin(req, res);
      expect(response.success).to.equal(true);
      expect(response.message).to.equal('Login successful');
      expect(response.userDetails).to.have.property('username');
      stubGetTokenMethod.restore();
    });
  });
});
