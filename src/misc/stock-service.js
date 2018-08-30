import ax from 'axios';

export default (symbol) => {
  console.log('hitting prod service');
  return ax.get(`http://localhost:3001/price?symbol=${symbol}`)
    .then(r => ({ symbol: symbol, price: r.data.price }));
  // .catch(error => {
  //   return Promise.reject(error);
  // })
};