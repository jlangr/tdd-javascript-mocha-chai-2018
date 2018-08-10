import Generator from '../data/id-generator';

const checkouts = {};

const items = { 
  '2001': { upc: '2001', description: 'Milk', price: 3.09 },
  '2002': { upc: '2002', description: 'Eggs, dz', price: 3.29 },
  '2003': { upc: '2003', description: 'Rice Krispies 16oz', price: 3.79 },
  '2004': { upc: '2004', description: 'Red bell pepper, ea', price: 0.99 },
};

export const clearAllCheckouts = (request, response) => {
  for (var member in checkouts) delete checkouts[member];
};

export const getCheckouts = (request, response) => {
  return response.send(Object.values(checkouts));
};

export const postCheckout = (request, response) => {
  const newCheckout = { id: Generator.id(), items: [] };
  checkouts[newCheckout.id] = newCheckout;
  response.status = 201;
  response.send(newCheckout);
};

export const getItems = (request, response) => {
  const id = request.params.id;
  const checkout = checkouts[id];
  response.send(checkout.items);
};

export const postItem = (request, response) => {
  const body = request.body;
  const checkoutId = request.params.id;
  const newCheckoutItem = { id: Generator.id() };
  const item = items[body.upc]; // not found?
  Object.assign(newCheckoutItem, item);

  const checkout = checkouts[checkoutId]; // not found
  checkout.items.push(newCheckoutItem);

  response.status = 201;
  return response.send(newCheckoutItem);
};
