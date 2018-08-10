import express from 'express';
import bodyParser from 'body-parser';
import { 
  getCheckouts,
  postCheckout,
  getItems,
  postItem
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

app.route('/checkouts')
  .get(getCheckouts)
  .post(postCheckout);

// DELETE checkout
// void item (delete)

app.route('/checkouts/:id/items')
  .get(getItems)
  .post(postItem);

export const server = app.listen(port, err => {
  if (err) return console.log('ERROR: ', err);
  console.log(`server listening on ${port}`);
});
