import { symbolLookup } from './stock-lookup-service'

export const createPortfolio = () => ({ holdings: {} })

export const empty = portfolio => size(portfolio) === 0

export const size = portfolio => Object.keys(portfolio.holdings).length

export const value = portfolio => empty(portfolio) ? 0 :
  Object.keys(portfolio.holdings).reduce(
    (totalValue, symbol) => totalValue + symbolLookup(symbol) * sharesOf(portfolio, symbol),
    0)

export const sharesOf = (portfolio, symbol) =>
  !portfolio.holdings[symbol] ? 0 : portfolio.holdings[symbol]

export const purchase = (portfolio, symbol, shares) =>
  ({ ...portfolio,
    holdings: {
      ...portfolio.holdings,
      [symbol]: sharesOf(portfolio, symbol) + shares
    }
  })
