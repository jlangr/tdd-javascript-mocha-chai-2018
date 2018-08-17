import Generator from '../data/id-generator';
import ItemDatabase from '../data/item_database';
import MemberDatabase from '../data/member_database';

const checkouts = {};

const itemDatabase = new ItemDatabase();
const memberDatabase = new MemberDatabase();

export const clearAllCheckouts = (request, response) => {
  for (var member in checkouts) delete checkouts[member];
};

export const getCheckout = (request, response) => {
  const checkout = checkouts[request.params.id];
  return response.send(checkout);
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

export const postMember = (request, response) => {
  const body = request.body;
  const member = memberDatabase.retrieve(body.id);
  if (!member) {
    response.status = 400;
    response.send({error: 'unrecognized member'});
    return;
  }

  const checkoutId = request.params.id;

  const checkout = checkouts[checkoutId];
  if (!checkout) {
    response.status = 400;
    response.send({error: 'invalid checkout'});
    return;
  }
  Object.assign(checkout, member);

  response.status = 200;
  response.send(checkouts[checkoutId]);
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
    response.send({error: 'nonexistent checkout'});
    return;
  }

  checkout.items.push(newCheckoutItem);

  response.status = 201;
  response.send(newCheckoutItem);
};

export const postCheckoutTotal = (request, response) => {
  const checkoutId = request.params.id;
  const checkout = checkouts[checkoutId];
  if (!checkout) {
    response.status = 400;
    response.send({error: 'nonexistent checkout'});
    return;
  }

  const discount = checkout.member ? checkout.discount : 0;

  let totalOfDiscountedItems = 0;
  let total = 0;
  checkout.items.forEach(item => {
    let price = item.price;
    const isExempt = item.exempt;
    if (!isExempt) {
      price = price - (discount * price);
      totalOfDiscountedItems += price;
    }
    total += price;
  });

  response.status = 200;
  response.send({ id: checkoutId, total, totalOfDiscountedItems  });
};
