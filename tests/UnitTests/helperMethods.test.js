import chai from 'chai';
import { HelperMethods } from '../../src/Utilities';

const { expect } = chai;
describe('Unit test for the helper methods ', () => {
  const res = {
    status() { return this; },
    json(obj) { return obj; },
  };
  it('should send the custom error message for a client-side error', () => {
    const response = HelperMethods.sendErrorMessage(res, 400, 'my custom message');
    expect(response.success).to.equal(false);
    expect(response.message).to.equal('my custom message');
  });
  it('should send the default error message when no custom error message is sent', () => {
    const response = HelperMethods.sendErrorMessage(res, 400);
    expect(response.success).to.equal(false);
    expect(response.message).to.equal('Internal server error');
  });
});
