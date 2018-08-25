import { expect } from 'chai';

const conversions = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'], 
  [10, 'X'], 
  [9, 'IX'], 
  [5, 'V'], 
  [4, 'IV'], 
  [1, 'I']];

const convert = arabic => {
  let s = '';

  for (let i = 0; i < conversions.length; i++) {
    const arabicDigit = conversions[i][0];
    const romanDigit = conversions[i][1];
    while (arabic >= arabicDigit) {
      s += romanDigit;
      arabic -= arabicDigit;
    }
  }
  return s;
};

describe('an arabic-to-roman converter', () => {
  it('converts positive arabic numbers to roman symbol equivalents', () => {
    expect(convert(1)).to.equal('I');
    expect(convert(2)).to.equal('II');
    expect(convert(3)).to.equal('III');
    expect(convert(4)).to.equal('IV');
    expect(convert(5)).to.equal('V');
    expect(convert(9)).to.equal('IX');
    expect(convert(10)).to.equal('X');
    expect(convert(11)).to.equal('XI');
    expect(convert(20)).to.equal('XX');
    expect(convert(40)).to.equal('XL');
    expect(convert(50)).to.equal('L');
    expect(convert(90)).to.equal('XC');
    expect(convert(100)).to.equal('C');
    expect(convert(400)).to.equal('CD');
    expect(convert(500)).to.equal('D');
    expect(convert(900)).to.equal('CM');
    expect(convert(1000)).to.equal('M');

    expect(convert(3874)).to.equal('MMMDCCCLXXIV');
  });
});