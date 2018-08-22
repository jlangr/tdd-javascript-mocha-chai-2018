import express from 'express';
import bodyParser from 'body-parser';
import { 
  getCheckout,
  getCheckouts,
  postCheckout,
  postCheckoutTotal,
  getItems,
  postItem,
  postMember
} from './routes/checkout';

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
  .get(getCheckouts)
  .post(postCheckout);

app.route('checkout/:id')
  .get(getCheckout);

// DELETE checkout
// void item (delete)

app.route('/checkouts/:id/items')
  .get(getItems)
  .post(postItem);


// TODO how to test these directly
app.route('/checkouts/:id/member')
  .post(postMember);

app.route('/checkouts/:id/total')
  .post(postCheckoutTotal);

export const server = app.listen(port, err => {
  if (err) return console.log('ERROR: ', err);
  console.log(`server listening on ${port}`);
});
