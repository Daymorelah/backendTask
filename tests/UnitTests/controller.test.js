import sinon from 'sinon';
import chai from 'chai';
import jimp from 'jimp';
import jsonPatch from 'json-patch';
import Controller from '../../src/Controller';
import { Authenticate } from '../../src/Utilities';

const { expect } = chai;

const req = {
  body: {
    username: 'my username',
    password: 'my password',
    imageUrl: 'my image URL',
    jsonObject: '',
    jsonPatchObject: 'my Json object',
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
const param = { resizedImage: 'My resized image' };
const imageObj = {
  write() { return sinon.stub().returns(null, param); },
  resize() { return this; },
};
const newJsonObject = {
  name: 'my name',
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
  describe('Test individual class methods in the controller class', () => {
    it('should login a user ', async () => {
      const stubGetTokenMethod = sinon.stub(Authenticate, 'getToken').returns('my token');
      const response = await Controller.userLogin(req, res);
      expect(response.success).to.equal(true);
      expect(response.message).to.equal('Login successful');
      expect(response.userDetails).to.have.property('username');
      stubGetTokenMethod.restore();
    });
    it('should create a thumbnail image', async () => {
      const stubReadMethod = sinon.stub(jimp, 'read').resolves(imageObj);
      await Controller.createThumbnail(req, res);
      expect(stubReadMethod.calledOnce).to.equal(true);
      stubReadMethod.restore();
    });
    it('should throw an error when an error occurs', async () => {
      const stubReadMethod = sinon.stub(jimp, 'read').rejects(imageObj);
      await Controller.createThumbnail(req, res);
      expect(stubReadMethod.calledOnce).to.equal(true);
      stubReadMethod.restore();
    });
    it('should apply json patch to a json object', async () => {
      const stubApplyMethod = sinon.stub(jsonPatch, 'apply').returns(newJsonObject);
      const response = await Controller.applyJsonPatch(req, res);
      expect(response.newJsonObject).to.have.property('name');
      expect(response.newJsonObject.name).to.equal('my name');
      stubApplyMethod.restore();
    });
  });
});
