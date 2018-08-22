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
  };

  const purchaseExemptItem = (upc, price, description='') => { 
    purchaseItem(upc, price, description, true);
  };

  const purchase = (upc, price, description='') => { 
    purchaseItem(upc, price, description, false);
  };

  const scanMember = (id, discount, name = 'Jeff Languid') => {
    memberDatabaseRetrieveStub.callsFake(_ => ({ member: id, discount, name }));
    postMember({ params: { id: checkoutId }, body: { id }}, response);
    sendSpy.resetHistory();
  };

  const emptyResponse = () => ({ 
    send: sendSpy,
    status: undefined 
  });

  const expectResponseMatches = expected =>
    expect(sinon.assert.calledWith(response.send, sinon.match(expected)));

  const expectResponseEquals = expected => 
    sinon.assert.calledWith(response.send, expected);

  describe('checkouts', () => {
    it('returns created object on post', () => {
      Generator.reset(1001);

      postCheckout({}, response);

      expectResponseEquals({ id: 1001, items: []});
      expect(response.status).to.equal(201);
    });

    it('returns created checkout on get', () => {
      const checkoutId = 1001;
      addCheckout(checkoutId);

      getCheckout({ params: { id: checkoutId }}, response);

      expectResponseEquals({ id: checkoutId, items: [] });
    });

    it('returns created checkouts on get all', () => {
      Generator.reset(1001);
      postCheckout({}, emptyResponse());
      postCheckout({}, emptyResponse());

      getCheckouts({}, response);

      expectResponseEquals([{ id: 1001, items: [] }, { id: 1002, items: [] }]);
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

    beforeEach(()=> {
      addCheckout(checkoutId);
    });

    it('returns created object on post', () => {
      itemDatabaseRetrieveStub.callsFake(_ => ({ upc: '333', description: 'Milk', price: 3.33 }));
      Generator.reset(1002);

      postItem({ params: { id: checkoutId }, body: { upc: '333' } }, response);

      expect(response.status).to.equal(201);
      expectResponseEquals({ id: 1002, upc: '333', description: 'Milk', price: 3.33 });
    });

    it('returns error when item UPC not found', () => {
      itemDatabaseRetrieveStub.callsFake(_ => undefined);

      postItem({ params: { id: checkoutId }, body: { upc: '333' } }, response);

      expect(response.status).to.equal(400);
      expectResponseEquals({ error: 'unrecognized UPC code' });
    });

    it('returns error when checkout not found', () => {
      itemDatabaseRetrieveStub.callsFake(_ => ({ upc: '333', description: '', price: 0.00 }));

      postItem({ params: { id: -1 }, body: { upc: '333' } }, response);

      expect(response.status).to.equal(400);
      expectResponseEquals({ error: 'nonexistent checkout' });
    });
  });

  // TODO: identify member before checkout initiated creates checkout

  describe('member', () => {
    const checkoutId = 1001;

    beforeEach(() => {
      addCheckout(checkoutId);
    });


    it('attaches member information to checkout', () => {
      memberDatabaseRetrieveStub.callsFake(_ => ({ member: '719-287-4335', discount: 0.01, name: 'Jeff Languid' }));
      postMember({ params: { id: checkoutId }, body: { id: '719-287-4335' }}, response);
      sendSpy.resetHistory();

      getCheckout({params: { id: checkoutId }}, response);

      expectResponseMatches({ member: '719-287-4335', discount: 0.01, name: 'Jeff Languid' });
    });

    it('returns error when checkout not found', () => {
      postMember({ params: { id: checkoutId }, body: { id: 'unknown' }}, response);

      expect(response.status).to.equal(400);
      expectResponseEquals({ error: 'unrecognized member' });
    });

    it('returns error when member not found', () => {
      memberDatabaseRetrieveStub.callsFake(_ => undefined);

      postMember({ params: { id: checkoutId }, body: { id: 'anything' }}, response);

      expect(response.status).to.equal(400);
      expectResponseEquals({ error: 'unrecognized member' });
    });
  });

  describe('checkout total', () => {
    it('does stuff', () => {
      Generator.reset(checkoutId);
      postCheckout({}, response);
      sendSpy.resetHistory();
      // set up for discountng
      itemDatabaseRetrieveStub.callsFake(_ => ({ upc: '333', price: 3.33, description: '', exempt: false }));
      postItem({ params: { id: checkoutId }, body: { upc: '333' } }, response);
      sendSpy.resetHistory();
      console.log('req id', checkoutId );
      itemDatabaseRetrieveStub.callsFake(_ => ({ upc: '444', price: 4.44, description: '', exempt: false }));
      postItem({ params: { id: checkoutId }, body: { upc: '444' } }, response);
      sendSpy.resetHistory();
      const request = { params: { id: checkoutId }};
      postCheckoutTotal(request, response);
      expect(response.status).to.equal(200);
      console.log('reseponse status', response.status);
      expect(sinon.assert.calledWith(response.send, sinon.match({ total: 7.77 })));

      //  not found
      postCheckoutTotal({ params: { id: 'unknown' }}, response);
      expect(response.status).to.equal(400);
      sinon.assert.calledWith(response.send, { error: 'nonexistent checkout' });
    });

    it('applies any member discount', () => {
      Generator.reset(checkoutId);
      postCheckout({}, response);
      sendSpy.resetHistory();
      scanMember('719-287-4335', 0.25);
      purchase('333', 3.33);
      purchase('444', 4.44);
      postCheckoutTotal({ params: { id: checkoutId }}, response);
      expect(sinon.assert.calledWith(response.send, sinon.match({ total: 5.83 })));
    });

    it('3rd disc test', () => {
      Generator.reset(1001);
      postCheckout({}, response);
      sendSpy.resetHistory();
      scanMember('719-287-4335', 0.085);
      purchase('333', 4.40);
      purchaseExemptItem('444', 5.50);
      postCheckoutTotal({ params: { id: checkoutId }}, response);
      expect(sinon.assert.calledWith(response.send, sinon.match({ total: 9.53 })));
    });

    it('discd tots', () => {
      Generator.reset(1001);
      postCheckout({}, response);
      sendSpy.resetHistory();
      purchaseExemptItem('444', 6.00);
      scanMember('719-287-4335', 0.10);
      purchase('333', 4.00);
      postCheckoutTotal({ params: { id: checkoutId }}, response);
      expect(sinon.assert.calledWith(response.send, sinon.match({ totalOfDiscountedItems:  3.60 })));
      sendSpy.resetHistory();

      // amount saved
      Generator.reset(1001);
      postCheckout({}, response);
      sendSpy.resetHistory();
      scanMember('719-287-4335', 0.10);
      purchase('333', 4.00);
      purchase('444', 6.00);
      postCheckoutTotal({ params: { id: checkoutId }}, response);
      expect(sinon.assert.calledWith(response.send, sinon.match({ /* totalOfDiscountedItems*/totalSaved:  1.00 })));
    });

    it('provides 0 total for discounted items when no member scanned', () => {
      Generator.reset(1001);
      postCheckout({}, response);
      sendSpy.resetHistory();
      purchase('333', 4.00);
      postCheckoutTotal({ params: { id: checkoutId }}, response);
      expect(sinon.assert.calledWith(response.send, sinon.match({ totalOfDiscountedItems :   0.00 })));
    });

    it('provides 0 total for discounted items when member discount is 0', () => {
      Generator.reset(1001);
      postCheckout({}, response);
      sendSpy.resetHistory();
      scanMember('719-287-4335', 0.00);
      // addCheckout(checkoutId);

      purchase('333', 4.00);

      postCheckoutTotal({ params: { id: checkoutId }}, response);
      expect(sinon.assert.calledWith(response.send, sinon.match({ totalOfDiscountedItems :   0.00 })));
    });
  });

  describe('message lines', () => {
    beforeEach(() => addCheckout(checkoutId));

    it('includes items and total', () => {
      purchase('123', 5.00, 'Milk');
      purchase('555', 12.00, 'Fancy eggs');

      postCheckoutTotal({ params: { id: checkoutId } }, response);

      expectResponseMatches(
        { messages: ['Milk                                     5.00',
          'Fancy eggs                              12.00',
          'TOTAL                                   17.00' ]});
    });

    it('includes discounts and total saved', () => {
      scanMember('719-287-4335', 0.10);
      purchase('123', 5.00, 'Milk');
      purchase('555', 2.79, 'Eggs');

      postCheckoutTotal({ params: { id: checkoutId } }, response);

      expectResponseMatches(
        { messages: ['Milk                                     5.00',
          '   10% mbr disc                         -0.50',
          'Eggs                                     2.79',
          '   10% mbr disc                         -0.28',
          'TOTAL                                    7.01',
          '*** You saved:                           0.78' ] });
    });
  });
});