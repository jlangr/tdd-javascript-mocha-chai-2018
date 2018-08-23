import express from 'express';
import bodyParser from 'body-parser';
import * as route from './routes/checkout';

export const app = express();

const port = 3101;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// TODO collapse checkouts route definitions?

app.route('/checkouts')
  .get(route.getCheckouts)
  .post(route.postCheckout);

app.route('checkout/:id')
  .get(route.getCheckout);

// DELETE checkout
// void item (delete)

app.route('/checkouts/:id/items')
  .get(route.getItems)
  .post(route.postItem);

// TODO how to test these directly
app.route('/checkouts/:id/member')
  .post(route.postMember);

app.route('/checkouts/:id/total')
  .post(route.postCheckoutTotal);

export const server = app.listen(port, err => {
  // eslint-disable-next-line no-console
  if (err) return console.log('ERROR: ', err);
  // eslint-disable-next-line no-console
  console.log(`server listening on ${port}`);
});
