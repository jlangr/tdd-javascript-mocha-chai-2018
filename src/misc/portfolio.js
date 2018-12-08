import * as StockService from './stock-service'

export const create = () => ({ holdings: {} })

export const isEmpty = portfolio => symbolCount(portfolio) === 0

function throwWhenSellingMoreSharesThanOwned(portfolio, symbol, shares) {
  if (sharesOf(portfolio, symbol) < shares)
    throw new RangeError()
}

export const purchase = (portfolio, symbol, shares) =>
  ({
    holdings: { ...portfolio.holdings,
      [symbol]: sharesOf(portfolio, symbol) + shares }
  })

export const sell = (portfolio, symbol, shares, auditor) => {
  throwWhenSellingMoreSharesThanOwned(portfolio, symbol, shares)

  if (auditor)
    auditor(`sold ${shares} share of ${symbol}`, new Date())
  portfolio = purchase(portfolio, symbol, -shares)
  return removeSymbolWhenAllSharesSold(portfolio, symbol)
}

const removeSymbol = (portfolio, symbol) => {
  const newHoldings = { ...portfolio.holdings }
  delete newHoldings[symbol]
  return { holdings: newHoldings }
}

const removeSymbolWhenAllSharesSold = (portfolio, symbol) =>
  sharesOf(portfolio, symbol) === 0
    ? removeSymbol(portfolio, symbol)
    : portfolio

export const symbolCount = portfolio => {
  return Object.keys(portfolio.holdings).length
}

export const sharesOf = (portfolio, symbol) => {
  if (!portfolio.holdings.hasOwnProperty(symbol))
    return 0
  return portfolio.holdings[symbol]
}

export const value = portfolio => {
  return Object.keys(portfolio.holdings).reduce((total, symbol) => {
    return total +
        sharesOf(portfolio, symbol) *
        StockService.symbolLookup(symbol)},
  0)
}

