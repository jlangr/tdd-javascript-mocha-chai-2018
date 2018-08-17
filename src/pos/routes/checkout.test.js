import { expect } from 'chai';
import sinon from 'sinon';
import { 
  clearAllCheckouts,
  getCheckout,
  getCheckouts,
  postCheckout,
  postCheckoutTotal,
  postItem,
  postMember
} from './checkout';
import MemberDatabase from '../data/member_database';
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

    it('returns created checkout on get', () => {
      const checkoutId = 1001;
      addCheckout(checkoutId);

      getCheckout({ params: { id: checkoutId }}, response);

      expect(sinon.assert.calledWith(response.send, { id: checkoutId, items: [] }));
    });

    it('returns created checkouts on get all', () => {
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

  const addCheckout = id => {
    Generator.reset(id);
    postCheckout({}, response);
    sendSpy.resetHistory();
  };

  // TODO: add item before checkout initiated--creates checkout
  describe('items', () => {
    const checkoutId = 1001;
    let itemDatabaseRetrieveStub;

    beforeEach(()=> {
      addCheckout(checkoutId);
      itemDatabaseRetrieveStub = sinon.stub(ItemDatabase.prototype, 'retrieve');
    });

    afterEach(() => itemDatabaseRetrieveStub.restore());

    it('returns created object on post', () => {
      itemDatabaseRetrieveStub.callsFake(upc => ({ upc: '333', description: 'Milk', price: 3.33 }));
      Generator.reset(1002);

      postItem({ params: { id: checkoutId }, body: { upc: '333' } }, response);

      expect(response.status).to.equal(201);
      expect(sinon.assert.calledWith(response.send, { id: 1002, upc: '333', description: 'Milk', price: 3.33 }));
    });

    it('returns error when item UPC not found', () => {
      itemDatabaseRetrieveStub.callsFake(upc => undefined);

      postItem({ params: { id: checkoutId }, body: { upc: '333' } }, response);

      expect(response.status).to.equal(400);
      expect(sinon.assert.calledWith(response.send, { error: 'unrecognized UPC code' }));
    });

    it('returns error when checkout not found', () => {
      itemDatabaseRetrieveStub.callsFake(upc => ({ upc: '333', description: '', price: 0.00 }));

      postItem({ params: { id: -1 }, body: { upc: '333' } }, response);

      expect(response.status).to.equal(400);
      expect(sinon.assert.calledWith(response.send, { error: 'nonexistent checkout' }));
    });
  });

  // TODO: identify member before checkout initiated creates checkout
  describe('member', () => {
    const checkoutId = 1001;
    let memberDatabaseRetrieveStub;

    beforeEach(() => {
      memberDatabaseRetrieveStub = sinon.stub(MemberDatabase.prototype, 'retrieve');
      addCheckout(checkoutId);
    });

    afterEach(() => memberDatabaseRetrieveStub.restore());

    it('attaches member information to checkout', () => {
      memberDatabaseRetrieveStub.callsFake(upc => ({ member: '719-287-4335', discount: '0.01', name: 'Jeff Languid' }));

      postMember({ params: { id: checkoutId }, body: { id: '719-287-4335' }}, response);
      sendSpy.resetHistory();

      getCheckout({params: { id: checkoutId }}, response);
      expect(sinon.assert.calledWith(response.send, 
        { id: checkoutId, items: [],
          member: '719-287-4335', discount: '0.01', name: 'Jeff Languid'
        }));
    });

    it('returns error when checkout not found', () => {
      postMember({ params: { id: checkoutId }, body: { id: 'unknown' }}, response);

      expect(response.status).to.equal(400);
      expect(sinon.assert.calledWith(response.send, { error: 'unrecognized member' }));
    });

    it('returns error when member not found', () => {

    });
  });

  describe('checkout total', () => {
    const checkoutId = 1001;
    let itemDatabaseRetrieveStub;

    beforeEach(()=> {
      addCheckout(checkoutId);
      itemDatabaseRetrieveStub = sinon.stub(ItemDatabase.prototype, 'retrieve');
    });

    afterEach(() => itemDatabaseRetrieveStub.restore());

    it('sums all items', () => {
      itemDatabaseRetrieveStub.callsFake(upc => ({ upc: '333', price: 3.50 }));
      postItem({ params: { id: checkoutId }, body: { upc: '333' } }, response);
      itemDatabaseRetrieveStub.callsFake(upc => ({ upc: '444', price: 3.00 }));
      postItem({ params: { id: checkoutId }, body: { upc: '444' } }, response);
      sendSpy.resetHistory();

      postCheckoutTotal({ params: { id: checkoutId }}, response);

      expect(response.status).to.equal(200);
      expect(sinon.assert.calledWith(response.send, { id: checkoutId, total: 6.50 }));
    });

    it('returns error when checkout not found', () => {
      postCheckoutTotal({ params: { id: 'unknown' }}, response);

      expect(response.status).to.equal(400);
      expect(sinon.assert.calledWith(response.send, { error: 'nonexistent checkout' }));
    });

    it('applies any member discount', () => {
// TODO
    });
  });
});