import { expect } from 'chai'
import * as Portfolio from './portfolio'

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
})