import chai, { expect } from 'chai'
import * as Portfolio from './portfolio'
import * as StockService from './stock-service'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

describe('a portfolio', () => {
  let portfolio

  beforeEach(() => {
    portfolio = Portfolio.create()
  })

  it('is empty by default', () => {
    expect(Portfolio.isEmpty(portfolio)).to.be.true
  })

  it('is not empty after purchase', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 1)

    expect(Portfolio.isEmpty(portfolio)).to.be.false
  })

  it('count of symbol is zero by default', () => {
    expect(Portfolio.symbolCount(portfolio)).to.equal(0)
  })

  it('count of symbol is one after purchase', () => {
    portfolio = Portfolio.purchase(portfolio,'BAYN', 1)

    expect(Portfolio.symbolCount(portfolio)).to.equal(1)
  })

  it('count of symbol increments after each purchase', () => {
    portfolio = Portfolio.purchase(portfolio,'BAYN', 10)
    portfolio = Portfolio.purchase(portfolio,'IBM', 20)

    expect(Portfolio.symbolCount(portfolio)).to.equal(2);
  })

  it('count of symbol does not increment after same-symbol purchase', () => {
    portfolio = Portfolio.purchase(portfolio,'BAYN', 10)
    portfolio = Portfolio.purchase(portfolio,'BAYN', 20)

    expect(Portfolio.symbolCount(portfolio)).to.equal(1);
  })

  it('returns number of shares purchased for symbol', () => {
    portfolio = Portfolio.purchase(portfolio,'BAYN', 10)

    expect(Portfolio.sharesOf(portfolio, 'BAYN')).to.equal(10)
  })

  it('returns 0 for shares of symbol not purchased', () => {
    expect(Portfolio.sharesOf(portfolio, 'BAYN')).to.equal(0)
  })

  it('sums shares purchased for same symbol', () => {
    portfolio = Portfolio.purchase(portfolio,'BAYN', 10)
    portfolio = Portfolio.purchase(portfolio,'BAYN', 20)

    expect(Portfolio.sharesOf(portfolio, 'BAYN')).to.equal(30)
  })

  it('reduces shares of symbol on sell', () => {
    portfolio = Portfolio.purchase(portfolio,'BAYN', 52)
    portfolio = Portfolio.sell(portfolio,'BAYN', 10)

    expect(Portfolio.sharesOf(portfolio, 'BAYN')).to.equal(42)
  })

  it('decrements counts when all shares sold for a symbol', () => {
    portfolio = Portfolio.purchase(portfolio,'BAYN', 10)
    portfolio = Portfolio.sell(portfolio,'BAYN', 10)

    expect(Portfolio.symbolCount(portfolio)).to.equal(0)
  })

  it('throws when selling too many', () => {
    expect(() =>
      Portfolio.sell(portfolio,'BAYN', 10)).to.throw(RangeError)
  })

  describe('portfolio value', () => {
    const BayerPrice = 65
    const ApplePrice = 185
    let stub
    beforeEach(() => {
      stub = sinon.stub()
      StockService.setSymbolLookupStubForTesting(stub)
    })

    it('is worthless by default', () => {
      expect(Portfolio.value(portfolio)).to.equal(0)
    })

    it('is worth share price for single share purchase', () => {
      portfolio = Portfolio.purchase(portfolio,'BAYN', 1)
      StockService.setSymbolLookupStubForTesting(_ => BayerPrice)

      expect(Portfolio.value(portfolio)).to.equal(BayerPrice)
    })

    it('multiplies price by number of shares', () => {
      portfolio = Portfolio.purchase(portfolio,'BAYN', 12)
      StockService.setSymbolLookupStubForTesting(_ => BayerPrice)

      expect(Portfolio.value(portfolio)).to.equal(BayerPrice * 12)
    })

    it('accumulates values for all symbols', () => {
      stub.withArgs('BAYN').returns(BayerPrice)
      stub.withArgs('AAPL').returns(ApplePrice)
      portfolio = Portfolio.purchase(portfolio,'BAYN', 12)
      portfolio = Portfolio.purchase(portfolio,'AAPL', 50)

      expect(Portfolio.value(portfolio)).to.equal(
        BayerPrice * 12 + ApplePrice * 50)
    })

    describe('auditing sales', () => {
      it('audits sales', () => {
        const spyAuditor = sinon.spy()
        portfolio =
          Portfolio.purchase(portfolio, 'BAYN', 10)
        portfolio =
          Portfolio.sell(portfolio, 'BAYN', 1, spyAuditor)

        expect(spyAuditor).to.have.been.calledWith(
          'sold 1 share of BAYN', sinon.match.date)
      })
    })
  })
})