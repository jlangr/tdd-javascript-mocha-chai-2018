import { expect } from 'chai'
import * as Portfolio from './portfolio'
import * as StockLookupService from './stock-lookup-service'

describe('a portfolio', () => {
  let portfolio

  beforeEach(() => {
    portfolio = Portfolio.create()
  })

  it('is empty by default', () => {
    expect(Portfolio.isEmpty(portfolio)).to.be.true
  })

  it('is not empty after purchase', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 10)

    expect(Portfolio.isEmpty(portfolio)).to.be.false
  })

  it('has size 0 by default', () => {
    expect(Portfolio.size(portfolio)).to.equal(0)
  })

  it('has size 1 after purchase', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 10)

    expect(Portfolio.size(portfolio)).to.equal(1)
  })

  it('increments size on purchase of unique symbol', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 10)
    portfolio = Portfolio.purchase(portfolio, 'IBM', 20)

    expect(Portfolio.size(portfolio)).to.equal(2)
  })

  it('does not increment size on purchase of duplicate symbol', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 10)
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 20)

    expect(Portfolio.size(portfolio)).to.equal(1)
  })

  it('returns shares for purchase', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 10)

    expect(Portfolio.shares(portfolio, 'BAYN')).to.equal(10)
  })

  it('answers zero for shares of unpurchased symbol', () => {
    expect(Portfolio.shares(portfolio, 'BAYN')).to.equal(0)
  })

  it('accumulates shares for multiple purchases', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 10)
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 20)

    expect(Portfolio.shares(portfolio, 'BAYN')).to.equal(30)
  })

  it('throws when purchasing non positive shares', () => {
    expect(() => { Portfolio.purchase(portfolio, 'BAYN', -1 )}).to.throw()
  })

  it('has no value before purchase', () => {
    expect(Portfolio.value(portfolio)).to.equal(0)
  })

  it('is worth stock price for single share purchase', () => {
    const BayerValue = 65
    const priceStub = () => BayerValue
    StockLookupService.symbolLookupStub(priceStub)

    portfolio = Portfolio.purchase(portfolio, 'BAYN', 1)

    expect(Portfolio.value(portfolio)).to.equal(BayerValue)
  })

  it('is worth stock price for single share purchase', () => {
    const BayerValue = 65
    const IbmValue = 130
    const priceStub = () => BayerValue
    StockLookupService.symbolLookupStub(priceStub)

    portfolio = Portfolio.purchase(portfolio, 'BAYN', 1)

    expect(Portfolio.value(portfolio)).to.equal(BayerValue)
  })

})