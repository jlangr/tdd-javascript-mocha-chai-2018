import { expect } from 'chai';
import { normalize } from './name-normalizer';

describe('a name normalizer', () => {
  it('returns empty when passed empty string', () => {
    expect(normalize("")).to.equal("");
  });

  it('returns single word name', () => {
    expect(normalize("Plato")).to.equal("Plato");
  });

  it('trims spaces from single word name', () => {
    expect(normalize("  Plato  ")).to.equal("Plato");
  });

  it('swaps first and last names', () => {
      expect(normalize("Haruki Murakami")).to.equal("Murakami, Haruki");
  });

  it('trims leading and trailing whitespace', () => {
      expect(normalize("  Big Boi   ")).to.equal("Boi, Big");
  });

  it('initializes middle name', () => {
      expect(normalize("Henry David Thoreau")).to.equal("Thoreau, Henry D.");
  });

  it('does not initialize one letter middle name', () => {
      expect(normalize("Harry S Truman")).to.equal("Truman, Harry S");
  });

  it('initializes each of multiple middle names', () => {
      expect(normalize("Julia Scarlett Elizabeth Louis-Dreyfus")).to.equal("Louis-Dreyfus, Julia S. E.");
  });

  it('appends suffixes to end', () => {
      expect(normalize("Martin Luther King, Jr.")).to.equal("King, Martin L., Jr.");
  });

  it('throws when name contains two commas', () => {
    expect(() => { normalize("Thurston, Howell, III") }).to.throw();
  });

  it('trims spaces from single word name with suffix', () => {
    expect(normalize("  Madonna, Jr.  ")).to.equal("Madonna, Jr.");
  });
});


// Madonna JR?