import { expect } from 'chai';
import PortfolioObj from './portfolio-obj';

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
  });

  describe('portfolio value', () => {
    xit('has value 0 when created', async () => {
      const result = await portfolio.value();
      expect(result).to.equal(0);
    });

    describe('when retrieve price must be called', () => {
    });
  });
});

