import { expect } from 'chai';

const arabicToRomanInDescendingOrder = [
  { arabicDigit: 1000, romanDigit: 'M' },
  { arabicDigit: 900, romanDigit: 'CM' },
  { arabicDigit: 500, romanDigit: 'D' },
  { arabicDigit: 400, romanDigit: 'CD' },
  { arabicDigit: 100, romanDigit: 'C' },
  { arabicDigit: 90, romanDigit: 'XC' },
  { arabicDigit: 50, romanDigit: 'L' },
  { arabicDigit: 40, romanDigit: 'XL' },
  { arabicDigit: 10, romanDigit: 'X' },
  { arabicDigit: 9, romanDigit: 'IX' },
  { arabicDigit: 5, romanDigit: 'V' },
  { arabicDigit: 4, romanDigit: 'IV' },
  { arabicDigit: 1, romanDigit: 'I' }
];

const convert = arabic => {
  let roman = '';
  arabicToRomanInDescendingOrder.forEach(({ arabicDigit, romanDigit}) => {
    while (arabic >= arabicDigit) {
      roman += romanDigit;
      arabic -= arabicDigit;
    }
  });
  return roman;
};

describe('a roman converter', () => {
  it('converts 1 to I', () => {
    expect(convert(1)).to.equal('I');
    expect(convert(2)).to.equal('II');
    expect(convert(3)).to.equal('III');
    expect(convert(4)).to.equal('IV');
    expect(convert(5)).to.equal('V');
    expect(convert(9)).to.equal('IX');
    expect(convert(10)).to.equal('X');
    expect(convert(11)).to.equal('XI');
    expect(convert(20)).to.equal('XX');
    expect(convert(30)).to.equal('XXX');
    expect(convert(40)).to.equal('XL');
    expect(convert(50)).to.equal('L');
    expect(convert(90)).to.equal('XC');
    expect(convert(100)).to.equal('C');
    expect(convert(400)).to.equal('CD');
    expect(convert(500)).to.equal('D');
    expect(convert(900)).to.equal('CM');
    expect(convert(1000)).to.equal('M');

    // Does it really work???
    expect(convert(3999)).to.equal('MMMCMXCIX');
    expect(convert(2888)).to.equal('MMDCCCLXXXVIII');
  });
});