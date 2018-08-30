import prodRetrievePrice from './stock-service';
import ax from 'axios';

export class Portfolio {
  constructor(retrievePrice = prodRetrievePrice) {
    this.sharesBySymbol = {};
  }

  isEmpty() {
    return this.size() === 0;
  }

  size() {
    return Object.keys(this.sharesBySymbol).length;
  }

  purchase(symbol, shares) {
    this.updateShares(symbol, shares);
  }

  throwWhenSellingTooMany(symbol, shares) { 
    if (shares > this.sharesOf(symbol))
      throw new RangeError();
  }

  sell(symbol, shares) {
    this.throwWhenSellingTooMany(symbol, shares);
    this.updateShares(symbol, -shares);
  }

  updateShares(symbol, delta) {
    this.sharesBySymbol[symbol] = this.sharesOf(symbol) + delta;
  }

  sharesOf(symbol) {
    if (!(symbol in this.sharesBySymbol)) return 0;
    return this.sharesBySymbol[symbol];
  }


  // but should this be in this class at all.
  lookupPrice(symbol) {
    return ax.get(`http://localhost:3001/price?symbol=${symbol}`)
      .then(r => ({ symbol: symbol, price: r.data.price }));
    // .catch(error => {
    //   return Promise.reject(error);
    // })  
  }

  value() {
  }

}
