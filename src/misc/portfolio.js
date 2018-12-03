import * as StockLookupService from './stock-lookup-service'

export const create = () => ({ holdings: new Set() })

export const isEmpty = portfolio => size(portfolio) === 0

export const shares = (portfolio, symbol) => {
  if (!portfolio.holdings.hasOwnProperty(symbol)) return 0
  return portfolio.holdings[symbol]
}

export const purchase = (portfolio, symbol, purchasedShares) => {
  if (purchasedShares < 1) throw new Error()
  const newPortfolio = { ...portfolio, holdings: portfolio.holdings }
  newPortfolio.holdings[symbol] = shares(portfolio, symbol) + purchasedShares
  return newPortfolio
}

export const size = portfolio => Object.keys(portfolio.holdings).length

export const value = portfolio => {
  if (isEmpty(portfolio)) return 0

  return StockLookupService.symbolLookup('BAYN')
}
