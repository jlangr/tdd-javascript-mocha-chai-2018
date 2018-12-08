import Generator from '../data/id-generator'
import ItemDatabase from '../data/item_database'
import MemberDatabase from '../data/member_database'

const checkouts = {};

const itemDatabase = new ItemDatabase();
const memberDatabase = new MemberDatabase();

export const clearAllCheckouts = (_, __) => {
  for (var member in checkouts) delete checkouts[member];
};

export const getCheckout = (request, response) => {
  const checkout = checkouts[request.params.id];
  return response.send(checkout);
};

export const getCheckouts = (_, response) => {
  return response.send(Object.values(checkouts));
};

export const postCheckout = (_, response) => {
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

const addMessage = function (messages, text, amount) {
  const amountFormatted = parseFloat(round2(amount)).toFixed(2)
  const textWidth = LineWidth - amountFormatted.length
  messages.push(pad(text, textWidth) + amountFormatted)
}

const round2 = function (amount) {
  return Math.round(amount * 100) / 100
}

const errorResponse = function (response, message) {
  response.status = 400
  response.send({error: message})
}

const memberDiscountAmount = function (checkout) {
  return checkout.member ? checkout.discount : 0
}

const successResponse = function (response, body) {
  response.status = 200
  response.send(body)
}

let canBeDiscounted = function (item, checkout) {
  return !item.exempt && memberDiscountAmount(checkout) > 0
}

function calculateTotals(checkout) {
  const memberDiscount = memberDiscountAmount(checkout)

  let totalOfDiscountedItems = 0
  let total = 0
  let totalSaved = 0

  checkout.items.forEach(item => {
    total += item.price;

    if (canBeDiscounted(item, checkout)) {
      const discountAmount = memberDiscount * item.price;
      const discountedPrice = item.price * (1.0 - memberDiscount);
      totalOfDiscountedItems += discountedPrice;
      total -= discountAmount;
      totalSaved += discountAmount;
    }
  })
  return { totalOfDiscountedItems, total, totalSaved }
}

function formatMessages(checkout, totals) {
  const messages = []
  const memberDiscount = memberDiscountAmount(checkout)

  checkout.items.forEach(item => {
    addMessage(messages, item.description, item.price)
    if (canBeDiscounted(item, checkout)) {
      const discountAmount = memberDiscount * item.price;
      addMessage(messages, `   ${memberDiscount * 100}% mbr disc`, -discountAmount)
    }
  })

  addMessage(messages, 'TOTAL', totals.total)
  if (totals.totalSaved > 0)
    addMessage(messages, '*** You saved:', totals.totalSaved)

  return messages
}

export const postCheckoutTotal = (request, response) => {
  const checkoutId = request.params.id;
  const checkout = checkouts[checkoutId];
  if (!checkout) {
    errorResponse(response, 'nonexistent checkout')
    return
  }

  const totals = calculateTotals(checkout)

  successResponse(response,
    {id: checkoutId,
      total: round2(totals.total),
      totalOfDiscountedItems: round2(totals.totalOfDiscountedItems),
      messages: formatMessages(checkout, totals),
      totalSaved: round2(totals.totalSaved)
    })
}
