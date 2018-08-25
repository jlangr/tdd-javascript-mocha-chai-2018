import * as ax from 'axios';

export class Portfolio {
  constructor() {
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

  retrievePrice(symbol) {
    return ax.get(`http://localhost:3001/price?symbol=${symbol}`)
      .then(r => ({ symbol: symbol, price: r.data.price }));
    // .catch(error => {
    //   return Promise.reject(error);
    // })
  }

  value() {
    if (this.size() === 0) return 0;

    const promises = Object.keys(this.sharesBySymbol)
      .map(this.retrievePrice.bind(this));

    return Promise.all(promises)
      .then(values => 
        values.reduce((sum, value) => 
          sum + (value.price * this.sharesOf(value.symbol)) , 0)
      );
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