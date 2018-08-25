import { expect } from 'chai';
import PortfolioObj from './portfolio-obj';
import sinon from 'sinon';

describe('a portfolio', () => {
  let portfolio;
  const Monsanto = 'BAYN';

  beforeEach(() => {
    portfolio = new PortfolioObj();
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

    expect(() => { portfolio.sell(Monsanto, 50 + 1) }).to.throw(RangeError);
  });

  describe('portfolio value', () => {
    const MonsantoValue = 85;

    it('has value 0 when created', async () => {
      const result = await portfolio.value();
      expect(result).to.equal(0);
    });

    describe('when retrieve price must be called', () => {
      let realLookupPrice;

      beforeEach(() => {
        realLookupPrice = PortfolioObj.prototype.lookupPrice;
        PortfolioObj.prototype.lookupPrice = 
          function() { return Promise.resolve({ symbol: Monsanto, price: MonsantoValue }); };
      });

      afterEach(() => {
        PortfolioObj.prototype.lookupPrice = realLookupPrice;
      });

      it('is worth share price for single share purchase', async () => {
        portfolio.purchase(Monsanto, 1);

        const result = await portfolio.value();

        expect(result).to.equal(MonsantoValue);
      });
    });

  });
});