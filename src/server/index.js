import express from 'express';
import bodyParser from 'body-parser';

const app = express();

const port = 3001;
let nextId = 1001;

const branches = {};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/json' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/branches/:id', (request, response) => {
  const id = request.params.id;
  response.send(branches[id]);
});

app.get('/branches', (request, response) => { 
  response.send(Object.values(branches));
});

app.post('/branches', (request, response) => {
  const body = request.body;
  const newBranch = {
    id: nextId++, // TODO critical section
    name: body.name,
    address: body.address
  };

  branches[newBranch.id] = newBranch;

  response.status = 201;
  return response.json(newBranch);
});

// we use merge patch here for simplicity since these are simple data structures

app.patch('/branches/:id', (request, response) => {
  // disallow patching the id
  // validate other data
  const patch = request.body;
  const id = request.params.id;
  const branch = branches[id];
  // merge. Delete a key by setting it to null... does this have to be coded?
  Object.assign(branch, patch);
  return response.json(branches[id]);
});

//   fs.writeFileSync('song2.json', json);

app.listen(port, (err) => {
  if (err) return console.log('ERROR: ', err);
  console.log(`server listening on ${port}`);
})