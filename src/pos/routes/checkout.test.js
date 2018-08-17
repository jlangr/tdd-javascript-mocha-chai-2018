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
  let itemDatabaseRetrieveStub;
  let memberDatabaseRetrieveStub;

  const checkoutId = 1001;

  beforeEach(() => {
    sendSpy = sinon.spy();
    sendSpy.resetHistory();
    response = emptyResponse();
    clearAllCheckouts();
  });

  beforeEach(() => itemDatabaseRetrieveStub = sinon.stub(ItemDatabase.prototype, 'retrieve'));
  beforeEach(() => memberDatabaseRetrieveStub = sinon.stub(MemberDatabase.prototype, 'retrieve'));

  afterEach(() => itemDatabaseRetrieveStub.restore());
  afterEach(() => memberDatabaseRetrieveStub.restore());

  const purchaseItem = (upc, price, description, exempt = false) => { 
    itemDatabaseRetrieveStub.callsFake(upc => ({ upc, price, description, exempt }));
    postItem({ params: { id: checkoutId }, body: { upc } }, response);
    sendSpy.resetHistory();
  }

  const purchaseExemptItem = (upc, price, description='') => { 
    purchaseItem(upc, price, description, true);
  };

  const purchase = (upc, price, description='') => { 
    purchaseItem(upc, price, description, false);
  };

  const scanMember = (id, discount, name = 'Jeff Languid') => {
    memberDatabaseRetrieveStub.callsFake(upc => ({ member: id, discount: discount, name: name }));
    postMember({ params: { id: checkoutId }, body: { id }}, response);
    sendSpy.resetHistory();
  }

  const emptyResponse = () => ({ 
    send: sendSpy,
    status: undefined 
  });

  xdescribe('checkouts', () => {
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
  xdescribe('items', () => {
    const checkoutId = 1001;

    beforeEach(()=> {
      addCheckout(checkoutId);
    });

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

  xdescribe('member', () => {
    const checkoutId = 1001;

    beforeEach(() => {
      addCheckout(checkoutId);
    });


    it('attaches member information to checkout', () => {
      memberDatabaseRetrieveStub.callsFake(upc => ({ member: '719-287-4335', discount: 0.01, name: 'Jeff Languid' }));
      postMember({ params: { id: checkoutId }, body: { id: '719-287-4335' }}, response);
      sendSpy.resetHistory();

      getCheckout({params: { id: checkoutId }}, response);

      expect(sinon.assert.calledWith(response.send, 
        { id: checkoutId, items: [],
          member: '719-287-4335', discount: 0.01, name: 'Jeff Languid'
        }));
    });

    it('returns error when checkout not found', () => {
      postMember({ params: { id: checkoutId }, body: { id: 'unknown' }}, response);

      expect(response.status).to.equal(400);
      expect(sinon.assert.calledWith(response.send, { error: 'unrecognized member' }));
    });

    it('returns error when member not found', () => {
      memberDatabaseRetrieveStub.callsFake(upc => undefined);

      postMember({ params: { id: checkoutId }, body: { id: 'anything' }}, response);

      expect(response.status).to.equal(400);
      expect(sinon.assert.calledWith(response.send, { error: 'unrecognized member' }));
    });
  });

  xdescribe('checkout total', () => {
    beforeEach(() => addCheckout(checkoutId));

    it('sums all items', () => {
      purchase('333', 3.50);
      purchase('444', 3.00);

      postCheckoutTotal({ params: { id: checkoutId }}, response);

      expect(response.status).to.equal(200);
      expect(sinon.assert.calledWith(response.send, { id: checkoutId, total: 6.50, totalOfDiscountedItems: 6.50 }));
    });

    it('returns error when checkout not found', () => {
      postCheckoutTotal({ params: { id: 'unknown' }}, response);

      expect(response.status).to.equal(400);
      expect(sinon.assert.calledWith(response.send, { error: 'nonexistent checkout' }));
    });

    it('applies any member discount', () => {
      scanMember('719-287-4335', 0.10);
      purchase('333', 4.50);
      purchase('444', 5.50);

      postCheckoutTotal({ params: { id: checkoutId }}, response);

      expect(sinon.assert.calledWith(response.send, 
        sinon.match({ total: 9.00 })));
    });

    it('does not discount exempt items', () => {
      scanMember('719-287-4335', 0.10);
      purchase('333', 4.00);
      purchaseExemptItem('444', 6.00);

      postCheckoutTotal({ params: { id: checkoutId }}, response);

      expect(sinon.assert.calledWith(response.send, 
        sinon.match({ total: 9.60 })));
    });

    it('provides total of discounted items', () => {
      scanMember('719-287-4335', 0.10);
      purchase('333', 4.00);
      purchaseExemptItem('444', 6.00);

      postCheckoutTotal({ params: { id: checkoutId }}, response);

      expect(sinon.assert.calledWith(response.send, 
         sinon.match({ totalOfDiscountedItems:  3.60 })));
    });
  });

  describe('message lines', () => {
    beforeEach(() => addCheckout(checkoutId));

    it('includes items and total', () => {
      purchase('123', 5.00, 'Milk');
      purchase('555', 12.00, 'Fancy eggs');

      postCheckoutTotal({ params: { id: checkoutId } }, response);

      expect(sinon.assert.calledWith(response.send,
        sinon.match({ messages: ['Milk                                     5.00',
                                 'Fancy eggs                              12.00',
                                 'TOTAL                                   17.00' ]})));
    });
  });
});