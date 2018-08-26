import { expect } from 'chai';
import { Portfolio } from './portfolio';
import sinon from 'sinon';
import ax from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('a portfolio', () => {
  let portfolio;
  const Monsanto = 'BAYN';
  const Ibm = 'IBM';
  const MonsantoValue = 85;
  const IbmValue = 50;

  beforeEach(() => {
    portfolio = new Portfolio();
  });

  it('is empty when created', () => {
    expect(portfolio.isEmpty()).to.be.true;
  });

  it('is no longer empty after purchase', () => {
    portfolio.purchase(Monsanto, 1);

    expect(portfolio.isEmpty()).to.be.false;
  });

  it('increments size on purchase of unique symbol', () => {
    portfolio.purchase(Monsanto, 1);
    portfolio.purchase('IBM', 10);

    expect(portfolio.size()).to.equal(2);
  });

  it('does not increment size on purchase of same symbol', () => {
    portfolio.purchase(Monsanto, 1);
    portfolio.purchase(Monsanto, 10);

    expect(portfolio.size()).to.equal(1);
  });

  it('has size zero when created', () => {
    expect(portfolio.size()).to.equal(0);
  });

  it('returns shares for a purchased symbol', () => {
    portfolio.purchase(Monsanto, 20);

    expect(portfolio.sharesOf(Monsanto)).to.equal(20);
  });

  it('tracks shares for each symbol', () => {
    portfolio.purchase(Monsanto, 10);
    portfolio.purchase('IBM', 20);

    expect(portfolio.sharesOf(Monsanto)).to.equal(10);
  });

  it('answers zero shares for unpurchased symbol', () => {
    expect(portfolio.sharesOf(Monsanto)).to.equal(0);
  });

  it('returns total of shares purchased for a symbol', () => {
    portfolio.purchase(Monsanto, 10);
    portfolio.purchase(Monsanto, 20);

    expect(portfolio.sharesOf(Monsanto)).to.equal(30);
  });

  it('reduces share count on sell of symbol', () => {
    portfolio.purchase(Monsanto, 30);

    portfolio.sell(Monsanto, 20);

    expect(portfolio.sharesOf(Monsanto)).to.equal(10);
  });

  it('throws when selling too many shares', () => {
    portfolio.purchase(Monsanto, 50);

    expect(() => portfolio.sell(Monsanto, 50 + 1)).to.throw(RangeError);
  });

  it('has value 0 when created', async () => {
    const result = await portfolio.valueViaRetrievePrice();
    expect(result).to.equal(0);
  });

  const IBM = 'IBM';
  describe('purchase stuff with property injection', () => {
    it('is worth share price for single share purchase -- promise, done-done', done => {
      portfolio.retrievePrice = () => Promise.resolve({ symbol: IBM, price: 100 });
      portfolio.purchase(IBM, 1);

      portfolio.value()
        .then(result => { expect(result).to.equal(100); })
        .then(done, done);
    });

    xit('is worth share price for single share purchase -- promise, done', done => {
      portfolio.retrievePrice = () => Promise.resolve({ symbol: IBM, price: 100 });
      portfolio.purchase(IBM, 1);

      portfolio.value()
        .then(result => { 
          expect(result).to.equal(IBM); 
          done();
        });
    });

    it('is worth share price for single share purchase -- await', async () => {
      portfolio.retrievePrice = () => Promise.resolve({ symbol: Monsanto, price: MonsantoValue });
      portfolio.purchase(Monsanto, 1);

      const result = await portfolio.valueViaRetrievePrice();

      expect(result).to.equal(MonsantoValue);
    });

    it('multiplies share price by number of shares', async () => {
      portfolio.retrievePrice = () => Promise.resolve({ symbol: Monsanto, price: MonsantoValue });
      portfolio.purchase(Monsanto, 10);

      const result = await portfolio.valueViaRetrievePrice();

      expect(result).to.equal(10 * MonsantoValue);
    });

    it('iterates all symbols', async () => {
      portfolio.retrievePrice = symbol => 
        Promise.resolve({ symbol, price: (symbol === Monsanto ? MonsantoValue : IbmValue) });
      portfolio.purchase(Monsanto, 2);
      portfolio.purchase(Ibm, 4);

      const result = await portfolio.valueViaRetrievePrice();

      expect(result).to.equal(MonsantoValue * 2 
                            + IbmValue * 4);
    });
  });

  describe('purchase stuff with sinon stubbing', () => {
    it('is worth share price for single share purchase', async () => {
      sinon.stub(portfolio, 'lookupPrice')
        .returns(Promise.resolve({ symbol: Monsanto, price: MonsantoValue }));
      portfolio.purchase(Monsanto, 1);

      const result = await portfolio.valueViaLocalFunc();

      expect(result).to.equal(MonsantoValue);
    });

    it('multiplies share price by number of shares', async () => {
      sinon.stub(portfolio, 'lookupPrice')
        .returns(Promise.resolve({ symbol: Monsanto, price: MonsantoValue }));
      portfolio.purchase(Monsanto, 10);

      const result = await portfolio.valueViaLocalFunc();

      expect(result).to.equal(10 * MonsantoValue);
    });

    it('iterates all symbols', async () => {
      sinon.stub(portfolio, 'lookupPrice')
        .withArgs(Monsanto).returns(Promise.resolve({ symbol: Monsanto, price: MonsantoValue }))
        .withArgs(Ibm).returns(Promise.resolve({ symbol: Ibm, price: 50 }));
      portfolio.purchase(Monsanto, 2);
      portfolio.purchase(Ibm, 4);

      const result = await portfolio.valueViaLocalFunc();

      expect(result).to.equal(MonsantoValue * 2 
                            + IbmValue * 4);
    });
  });

  describe('purchase stuff with axios mock adapter', () => {
    let mock;

    beforeEach(() => {
      mock = new MockAdapter(ax);
    });

    it('is worth share price for single share purchase', async () => {
      mock.onGet(`http://localhost:3001/price?symbol=${Monsanto}`)
        .reply(200, { symbol: Monsanto, price: MonsantoValue });
      portfolio.purchase(Monsanto, 1);

      const result = await portfolio.valueViaLocalFunc();

      expect(result).to.equal(MonsantoValue);
    });

    it('multiplies share price by number of shares', async () => {
      mock.onGet(`http://localhost:3001/price?symbol=${Monsanto}`)
        .reply(200, { symbol: Monsanto, price: MonsantoValue });
      portfolio.purchase(Monsanto, 10);

      const result = await portfolio.valueViaLocalFunc();

      expect(result).to.equal(10 * MonsantoValue);
    });

    it('iterates all symbols', async () => {
      mock.onGet(`http://localhost:3001/price?symbol=${Monsanto}`)
        .reply(200, { symbol: Monsanto, price: MonsantoValue });
      mock.onGet(`http://localhost:3001/price?symbol=${Ibm}`)
        .reply(200, { symbol: Ibm, price: IbmValue });
      portfolio.purchase(Monsanto, 2);
      portfolio.purchase(Ibm, 4);

      const result = await portfolio.valueViaLocalFunc();

      expect(result).to.equal(MonsantoValue * 2 
                            + IbmValue * 4);
    });
  });
});