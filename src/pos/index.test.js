import { expect } from 'chai';
import { app, server } from './index.js';
import request from 'supertest';
import async from 'async';

describe('', () => {
  afterEach(done => {
    server.close();
    done();
  });

  it('retrieves added checkout', done => {
    async.series([
      cb => request(app).post('/checkouts')
        .expect(200, cb),
      cb => request(app).get('/checkouts')
        .expect(response => {
          expect(response.body.length).to.equal(1);
        })
        .expect(200, cb)
    ], done);
  });
});

// what is the 'done'