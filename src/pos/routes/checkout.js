let nextId = 1001;

const checkouts = {};

const items = { 
  '2001': { upc: '2001', description: 'Milk', price: 3.09 },
  '2002': { upc: '2002', description: 'Eggs, dz', price: 3.29 },
  '2003': { upc: '2003', description: 'Rice Krispies 16oz', price: 3.79 },
  '2004': { upc: '2004', description: 'Red bell pepper, ea', price: 0.99 },
};

export const getCheckouts = (request, response) => {
  response.send(Object.values(checkouts));
};

export const postCheckout = (request, response) => {
  const newCheckout = { id: nextId++, items: [] };
  checkouts[newCheckout.id] = newCheckout;
  response.status = 201;
  return response.json(newCheckout);
};

export const getItems = (request, response) => {
  const id = request.params.id;
  const checkout = checkouts[id];
  return response.json(checkout.items);
};

export const postItem = (request, response) => {
  const body = request.body;
  const checkoutId = request.params.id;
  const newCheckoutItem = { id: nextId++ };
  const item = items[body.upc]; // not found?
  Object.assign(newCheckoutItem, item);

  const checkout = checkouts[checkoutId]; // not found
  checkout.items.push(newCheckoutItem);

  response.status = 201;
  return response.json(newCheckoutItem);
};
