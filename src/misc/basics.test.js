import { expect } from 'chai';

describe('some javascript fundamentals', () => {
  xit('supports basic math', () => {
    expect(4 * 8).to.equal(/* what? */);
  });

  xit('appends an item to an array using push', () => {
    const numbers = [12, 1, 1, 1, 2, 1, 3];

    numbers.push(1);

    expect(numbers).to.deep.equal(/* what? */);
  });

  xit('doubles each element an array of numbers ', () => {
    const numbers = [2, 5, 10, 105];

    const result = undefined // fill this out!

    expect(result).to.deep.equal([4, 10, 20, 210]);
  });

  xit('handles interesting float-point number results', () => {
    const result = 0.1 + 0.2;

    // expect(result).to what?
  });
});