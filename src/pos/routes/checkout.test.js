import { expect } from 'chai';
import sinon from 'sinon';
import { postCheckout } from './checkout';
import Generator from '../data/id-generator';

describe('postCheckout', () => {
  it('creates a new checkout object', () => {
    sinon.stub(Generator, 'id').returns(2018);
    const response = {
      json: obj => JSON.stringify(obj),
      status: undefined
    };

    const json = postCheckout({}, response);

    expect(JSON.parse(json)).to.deep.equal({ id: 2018, items: []});
  });
});