import { expect } from 'chai'
import sinon from 'sinon'
import * as Portfolio from './portfolio'
import * as StockLookupService from './stock-lookup-service'

const Bayer = 'BAYN'
const BayerPrice = 42
const IBM = 'IBM'
const IBMPrice = 110

describe('a portfolio', () => {
  let portfolio

  beforeEach(() => {
    portfolio = Portfolio.createPortfolio()
  })

  it('is empty when created', () => {
    expect(Portfolio.empty(portfolio)).to.be.true
  })

  it('is not empty after purchase', () => {
    portfolio = Portfolio.purchase(portfolio, Bayer, 10)

    expect(Portfolio.empty(portfolio)).to.be.false
  })

  it('has size 0 when created', () => {
    expect(Portfolio.size(portfolio)).to.equal(0)
  })

  it('increases size after purchase', () => {
    portfolio = Portfolio.purchase(portfolio, Bayer, 10)

    expect(Portfolio.size(portfolio)).to.equal(1)
  })

  it('increments size with new symbol purchase', () => {
    portfolio = Portfolio.purchase(portfolio, Bayer, 1)
    portfolio = Portfolio.purchase(portfolio, 'IBM', 2)

    expect(Portfolio.size(portfolio)).to.equal(2)
  })

  it('does not increment the size with duplicate symbol purchase', () => {
    portfolio = Portfolio.purchase(portfolio, Bayer, 1)
    portfolio = Portfolio.purchase(portfolio, Bayer, 1)

    expect(Portfolio.size(portfolio)).to.equal(1)
  })

  it('answers 0 sharesOf for symbol not purchased', () => {
    expect(Portfolio.sharesOf(portfolio, Bayer)).to.equal(0)
  })

  it('answers the number of sharesOf for a purchase', () => {
    portfolio = Portfolio.purchase(portfolio, Bayer, 42)

    expect(Portfolio.sharesOf(portfolio, Bayer)).to.equal(42)
  })

  it('does not alter passed state on purchase', () => {
    Portfolio.purchase(portfolio, Bayer, 23)

    expect(Portfolio.sharesOf(portfolio, Bayer)).to.equal(0)
  })

  it('accumulates shares for multiple purchases', () => {
    portfolio = Portfolio.purchase(portfolio, Bayer, 23)
    portfolio = Portfolio.purchase(portfolio, Bayer, 19)

    expect(Portfolio.sharesOf(portfolio, Bayer)).to.equal(42)
  })

  describe('portfolio value with stub', () => {
    it('is symbol price for single-share purhcase', () => {
      Portfolio.symbolLookupStub(symbol => symbol === 'IBM' ? 42 : 0)

      portfolio = Portfolio.purchase(portfolio, 'IBM', 1)

      expect(Portfolio.value(portfolio)).to.equal(42)
    })
  })

  describe('portfolio value', () => {
    const lookup = sinon.stub()
    lookup.withArgs(IBM).returns(IBMPrice)
    lookup.withArgs(Bayer).returns(BayerPrice)

    let prodLookup

    beforeEach(() => {
      prodLookup = Portfolio.symbolLookup
      Portfolio.symbolLookupStub(lookup)
    })

    afterEach(() => {
      Portfolio.symbolLookupStub(prodLookup)
    })

    it('is 0 when created', () => {
      expect(Portfolio.value(portfolio)).to.equal(0)
    })

    it('is symbol price for single-share purchase', () => {
      portfolio = Portfolio.purchase(portfolio, IBM, 1)

      expect(Portfolio.value(portfolio)).to.equal(IBMPrice)
    })

    it('multiplies share price by number of shares', () => {
      portfolio = Portfolio.purchase(portfolio, IBM, 20)

      expect(Portfolio.value(portfolio)).to.equal(20 * IBMPrice)
    })

    it('sums values for all symbols', () => {
      portfolio = Portfolio.purchase(portfolio, IBM, 20)
      portfolio = Portfolio.purchase(portfolio, Bayer, 10)

      console.log('ortfolio', portfolio)
      expect(Portfolio.value(portfolio)).to.equal(20 * IBMPrice + 10 * BayerPrice)
    })
  })
})