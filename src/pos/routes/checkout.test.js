import { expect } from 'chai';
import sinon from 'sinon';
import { 
  clearAllCheckouts,
  getCheckouts,
  postCheckout
} from './checkout';
import Generator from '../data/id-generator';

describe('checkout functionality', () => {
  let response;

  beforeEach(() => {
    response = emptyResponse();
    clearAllCheckouts();
  });

  const emptyResponse = () => ({ 
    send: sinon.spy(),
    status: undefined 
  });

  describe('postCheckout', () => {
    xit('creates a new checkout object', () => {
      Generator.reset(1001);

      postCheckout({}, response);

      expect(sinon.assert.calledWith(response.send, { id: 1001, items: []}));
      expect(response.status).to.equal(201);
    });
  });

  describe('getCheckouts', () => {
    it('returns stored checkouts', () => {
      Generator.reset(1001);
      postCheckout({}, emptyResponse());
      postCheckout({}, emptyResponse());

      getCheckouts({}, response);

      expect(sinon.assert.calledWith(response.send, 
        [
          { id: 1001, items: [] },
          { id: 1002, items: []}
        ]
      ));
    });

  });
})