import { expect } from 'chai';
import sinon from 'sinon';
import { 
  clearAllCheckouts,
  getCheckouts,
  postCheckout,
  postItem
} from './checkout';
import ItemDatabase from '../data/item_database';
import Generator from '../data/id-generator';

describe('checkout functionality', () => {
  let response;
  let sendSpy;

  beforeEach(() => {
    sendSpy = sinon.spy();
    sendSpy.resetHistory();
    response = emptyResponse();
    clearAllCheckouts();
  });

  const emptyResponse = () => ({ 
    send: sendSpy,
    status: undefined 
  });

  describe('checkouts', () => {
    it('returns created object on post', () => {
      Generator.reset(1001);

      postCheckout({}, response);

      expect(sinon.assert.calledWith(response.send, { id: 1001, items: []}));
      expect(response.status).to.equal(201);
    });

    it('returns created checkouts on get', () => {
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

 describe('items', () => {
    const checkoutId = 1001;
    let itemDatabaseRetrieveStub;

    beforeEach(()=> {
      Generator.reset(checkoutId);
      postCheckout({}, response);
      sendSpy.resetHistory();
      itemDatabaseRetrieveStub = sinon.stub(ItemDatabase.prototype, 'retrieve');
    });

    afterEach(() => {
      itemDatabaseRetrieveStub.restore();
    });

    it('returns created object on post', () => {
      const request = {
        params: { id: checkoutId },
        body: { upc: '333' }
      };
      itemDatabaseRetrieveStub.callsFake(upc => ({ upc: '333', description: 'Milk', price: 3.33 }));
      Generator.reset(1002);

      postItem(request, response);

      expect(response.status).to.equal(201);
      expect(sinon.assert.calledWith(response.send,
        { id: 1002, upc: '333', description: 'Milk', price: 3.33 }));
    });
  });
})