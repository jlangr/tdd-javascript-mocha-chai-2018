import Generator from '../data/id-generator';
import ItemDatabase from '../data/item_database';

const checkouts = {};

export const itemDatabase = new ItemDatabase();

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
  const item = itemDatabase.retrieve(body.upc);
  if (!item) {
    response.status = 400;
    response.send({error: 'unrecognized UPC code'});
    return;
  }

  Object.assign(newCheckoutItem, item);

  const checkout = checkouts[checkoutId];
  if (!checkout) {
    response.status = 400;
    response.send({error: 'nonexistent checkout id'});
    return;
  }

  checkout.items.push(newCheckoutItem);

  response.status = 201;
  response.send(newCheckoutItem);
};
