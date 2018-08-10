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
  let generatorStub;
  beforeEach(() => {
    response = emptyResponse();
    clearAllCheckouts();
    generatorStub = sinon.stub(Generator, 'id');
  });

  afterEach(() => {
    Generator.id.restore();
  });

  const emptyResponse = () => ({ 
    send: sinon.spy(),
    status: undefined 
  });

  describe('postCheckout', () => {
    xit('creates a new checkout object', () => {
      generatorStub.returns(2018);

      postCheckout({}, response);

      expect(sinon.assert.calledWith(response.send, { id: 2018, items: []}));
      expect(response.status).to.equal(201);
    });
  });

  describe('getCheckouts', () => {
    it('returns stored checkouts', () => {
      generatorStub.returns(2001);
      postCheckout({}, emptyResponse());
      generatorStub.returns(2002);
      postCheckout({}, emptyResponse());

      getCheckouts({}, response);

      expect(sinon.assert.calledWith(response.send, 
        [
          { id: 2001, items: [] },
          { id: 2002, items: []}
        ]
      ));
    });

  });
})