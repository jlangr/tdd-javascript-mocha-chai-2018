import prodRetrievePrice from './stock-service';
import ax from 'axios';

export class Portfolio {
  constructor(retrievePrice = prodRetrievePrice) {
    this.sharesBySymbol = {};
    this.retrievePrice = retrievePrice;
    this.auditor = this.audit;
  }

  isEmpty() {
    return this.size() === 0;
  }

  size() {
    return Object.keys(this.sharesBySymbol).length;
  }

  purchase(symbol, shares) {
    this.updateShares(symbol, shares);
    this.auditor(`purchase ${shares} shares of ${symbol}`, new Date());
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

  valueViaRetrievePrice() {
    if (this.size() === 0) return 0;

    const promises = Object.keys(this.sharesBySymbol).map(this.retrievePrice);

    return Promise.all(promises)
      .then(values => 
        values.reduce((sum, value) => 
          sum + (value.price * this.sharesOf(value.symbol)) , 0)
      );
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
    if (this.size() === 0) return 0;
    return this.retrievePrice('IBM')
      .then(({_symbol, price}) => price);
  }

  valueViaLocalFunc() {
    if (this.size() === 0) return 0;

    const promises = Object.keys(this.sharesBySymbol).map(this.lookupPrice);

    return Promise.all(promises)
      .then(values => 
        values.reduce((sum, value) => 
          sum + (value.price * this.sharesOf(value.symbol)) , 0)
      );
  }

  useAuditor(auditor) {
    this.auditor = auditor;
  }

  audit(message) {
    console.log(message);
  }

  // const symbol = 'BAYN';
  // return axios(`http://localhost:3001/price?symbol=${symbol}`)
  //   .then(response => {
  //     return response.data.price * this.sharesOf(symbol);
  //   })
  //   .catch(error => {
  //     return Promise.reject(error);
  //   });
}