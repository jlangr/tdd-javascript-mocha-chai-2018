import { expect } from 'chai'
import sinon from 'sinon'
import { createPortfolio, empty, purchase, sharesOf, size, value } from './portfolio'
import * as StockLookupService from './stock-lookup-service'

const Bayer = 'BAYN'
const BayerPrice = 42
const IBM = 'IBM'
const IBMPrice = 110

describe('a portfolio', () => {
  let portfolio

  beforeEach(() => {
    portfolio = createPortfolio()
  })

  it('is empty when created', () => {
    expect(empty(portfolio)).to.be.true
  })

  it('is not empty after purchase', () => {
    portfolio = purchase(portfolio, Bayer, 10)

    expect(empty(portfolio)).to.be.false
  })

  it('has size 0 when created', () => {
    expect(size(portfolio)).to.equal(0)
  })

  it('increases size after purchase', () => {
    portfolio = purchase(portfolio, Bayer, 10)

    expect(size(portfolio)).to.equal(1)
  })

  it('increments size with new symbol purchase', () => {
    portfolio = purchase(portfolio, Bayer, 1)
    portfolio = purchase(portfolio, 'IBM', 2)

    expect(size(portfolio)).to.equal(2)
  })

  it('does not increment the size with duplicate symbol purchase', () => {
    portfolio = purchase(portfolio, Bayer, 1)
    portfolio = purchase(portfolio, Bayer, 1)

    expect(size(portfolio)).to.equal(1)
  })

  it('answers 0 sharesOf for symbol not purchased', () => {
    expect(sharesOf(portfolio, Bayer)).to.equal(0)
  })

  it('answers the number of sharesOf for a purchase', () => {
    portfolio = purchase(portfolio, Bayer, 42)

    expect(sharesOf(portfolio, Bayer)).to.equal(42)
  })

  it('does not alter passed state on purchase', () => {
    purchase(portfolio, Bayer, 23)

    expect(sharesOf(portfolio, Bayer)).to.equal(0)
  })

  it('accumulates shares for multiple purchases', () => {
    portfolio = purchase(portfolio, Bayer, 23)
    portfolio = purchase(portfolio, Bayer, 19)

    expect(sharesOf(portfolio, Bayer)).to.equal(42)
  })

  describe('portfolio value with stub', () => {
    it('is symbol price for single-share purhcase', () => {
      StockLookupService.symbolLookupStub(symbol => symbol === 'IBM' ? 42 : 0)

      portfolio = purchase(portfolio, 'IBM', 1)

      expect(value(portfolio)).to.equal(42)
    })
  })

  describe('portfolio value', () => {
    const lookup = sinon.stub()
    lookup.withArgs(IBM).returns(IBMPrice)
    lookup.withArgs(Bayer).returns(BayerPrice)

    let prodLookup

    beforeEach(() => {
      prodLookup = StockLookupService.symbolLookup
      StockLookupService.symbolLookupStub(lookup)
    })

    afterEach(() => {
      StockLookupService.symbolLookupStub(prodLookup)
    })

    it('is 0 when created', () => {
      expect(value(portfolio)).to.equal(0)
    })

    it('is symbol price for single-share purchase', () => {
      portfolio = purchase(portfolio, IBM, 1)

      expect(value(portfolio)).to.equal(IBMPrice)
    })

    it('multiplies share price by number of shares', () => {
      portfolio = purchase(portfolio, IBM, 20)

      expect(value(portfolio)).to.equal(20 * IBMPrice)
    })

    it('sums values for all symbols', () => {
      portfolio = purchase(portfolio, IBM, 20)
      portfolio = purchase(portfolio, Bayer, 10)

      expect(value(portfolio)).to.equal(20 * IBMPrice + 10 * BayerPrice)
    })
  })
})