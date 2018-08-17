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

const pad = (s, length) => s + ' '.repeat(length - s.length);

const LineWidth = 45;
const MaxTextWidth = 40;

export const postCheckoutTotal = (request, response) => {
  const checkoutId = request.params.id;
  const checkout = checkouts[checkoutId];
  if (!checkout) {
    response.status = 400;
    response.send({error: 'nonexistent checkout'});
    return;
  }

  const messages = [];
  const discount = checkout.member ? checkout.discount : 0;

  let totalOfDiscountedItems = 0;
  let total = 0;

  checkout.items.forEach(item => {
    let price = item.price;
    const isExempt = item.exempt;
    if (!isExempt && discount > 0) {  // TODO discounted item total is 0 if discount is 0
      const discountedPrice = price - (discount * price);
      totalOfDiscountedItems += discountedPrice;
      total += discountedPrice;
    }
    else {
      total += price;
      const text = item.description;
      const amount = formatAmount(price);
      const amountWidth = amount.length;

      const textWidth = LineWidth - amountWidth;
      messages.push(pad(text, textWidth) + amount);
    }
  });

  // append total line
  const formattedTotal = formatAmount(total);
  const formattedTotalWidth = formattedTotal.length;
  const textWidth = LineWidth - formattedTotalWidth;
  messages.push(pad('TOTAL', textWidth) + formattedTotal);

  response.status = 200;
  // send total saved instead
  response.send({ id: checkoutId, total, totalOfDiscountedItems, messages });
};

const formatAmount = amount => parseFloat(Math.round(amount * 100) / 100).toFixed(2);
