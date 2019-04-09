import { expect } from 'chai'
import { normalize } from './name-normalizer'

describe('a name normalizer', () => {
  it('returns empty when passed empty string', () => {
    expect(normalize('')).to.equal('')
  })

  it('returns single word name', () => {
    expect(normalize('Plato')).to.equal('Plato')
  })

  it('swaps first and last names', () => {
    expect(normalize('Haruki Murakami')).to.equal('Murakami, Haruki')
  })

  xit('trims leading and trailing whitespace', () => {
    expect(normalize('  Big Boi   ')).to.equal('Boi, Big')
  })

  xit('initializes middle name', () => {
    expect(normalize('Henry David Thoreau')).to.equal('Thoreau, Henry D.')
  })

  xit('does not initialize one letter middle name', () => {
    expect(normalize('Harry S Truman')).to.equal('Truman, Harry S')
  })

  xit('initializes each of multiple middle names', () => {
    expect(normalize('Julia Scarlett Elizabeth Louis-Dreyfus')).to.equal('Louis-Dreyfus, Julia S. E.')
  })

  xit('appends suffixes to end', () => {
    expect(normalize('Martin Luther King, Jr.')).to.equal('King, Martin L., Jr.')
  })

  xit('throws when name contains two commas', () => {
    expect(() => { normalize('Thurston, Howell, III'); }).to.throw()
  })
})

// Extra Credit:
//  salutations, e.g. Mr. Edmund Langr. U.S. Salutations are recognized as
//     one of Mr., Mrs., Ms., and Dr.--either with or without the period.
//     Anything else should be recognized as a first name

// What other tests should you write? Not new features but things you know as a programmer
// that you probably needed? (Or do you need them? Discuss.)
