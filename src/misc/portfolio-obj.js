import ax from 'axios';

function PortfolioObj() { this.sharesBySymbol = {}; }

PortfolioObj.prototype.isEmpty = function() { return this.size() === 0; };

PortfolioObj.prototype.size = function() { return Object.keys(this.sharesBySymbol).length; }

PortfolioObj.prototype.purchase = function(symbol, shares) { this.updateShares(symbol, shares); }

PortfolioObj.prototype.throwWhenSellingTooMany = function(symbol, shares) { 
  if (shares > this.sharesOf(symbol))
    throw new RangeError();
};

PortfolioObj.prototype.sell = function(symbol, shares) {
  this.throwWhenSellingTooMany(symbol, shares);
  this.updateShares(symbol, -shares);
};

PortfolioObj.prototype.updateShares = function(symbol, delta) {
  this.sharesBySymbol[symbol] = this.sharesOf(symbol) + delta;
};

PortfolioObj.prototype.sharesOf = function(symbol) {
  if (!(symbol in this.sharesBySymbol)) return 0;
  return this.sharesBySymbol[symbol];
};

PortfolioObj.prototype.value = function() {
};

PortfolioObj.prototype.lookupPrice = function(symbol) {
  return ax.get(`http://localhost:3001/price?symbol=${symbol}`)
    .then(function(response) { 
      return { symbol: symbol, price: response.data.price }; 
    });
};

export default PortfolioObj;
