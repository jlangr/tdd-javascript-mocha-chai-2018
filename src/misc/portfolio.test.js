import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { Portfolio } from './portfolio';
import sinon from 'sinon';
import ax from 'axios';
import MockAdapter from 'axios-mock-adapter';

chai.use(sinonChai);

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
  });
});