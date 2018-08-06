import { statement } from './statement';
import { expect } from 'chai';

export const movies = {
  'NR01': {'title': 'Hereditary', 'code': 'new'},
  'NR02': {'title': 'Wonder Woman', 'code': 'new'},
  'CHILD01': {'title': 'How to Train Your Dragon', 'code': 'childrens'},
  'REG01': {'title': 'The Conversation', 'code': 'regular'}
};

describe('video store statements', () => {
  it('handles single new release', () => {
    const customer = { 'name': 'alma',
      'rentals': [{ 'movieID': 'NR01', 'days': 3 }]
    };

    expect(statement(customer, movies)).to.equal(
      'Rental Record for alma\n\tHereditary\t9\nAmount owed is 9\nYou earned 2 frequent renter points\n'
    );
  });

  it('handles multiple new releases', () => {
    const customer = { 'name': 'boris',
      'rentals': [
        { 'movieID': 'NR01', 'days': 3 },
        { 'movieID': 'NR02', 'days': 3 }
      ]
    };

    expect(statement(customer, movies)).to.equal(
      'Rental Record for boris\n\tHereditary\t9\n\tWonder Woman\t9\nAmount owed is 18\nYou earned 4 frequent renter points\n'
    );
  });

  it('handles childrens rental', () => {
    const customer = { 'name': 'Coco',
      'rentals': [{ 'movieID': 'CHILD01', 'days': 5 }]
    };

    expect(statement(customer, movies)).to.equal(
      'Rental Record for Coco\n\tHow to Train Your Dragon\t4.5\nAmount owed is 4.5\nYou earned 1 frequent renter points\n'
    );
  });

  it('handles single day childrens rental', () => {
    const customer = { 'name': 'Dot',
      'rentals': [{ 'movieID': 'CHILD01', 'days': 1 }]
    };

    expect(statement(customer, movies)).to.equal(
      'Rental Record for Dot\n\tHow to Train Your Dragon\t1.5\nAmount owed is 1.5\nYou earned 1 frequent renter points\n'
    );
  });

  it('handles up to two day regular rental', () => {
    const customer = { 'name': 'Edmund',
      'rentals': [{ 'movieID': 'REG01', 'days': 2 }]
    };

    expect(statement(customer, movies)).to.equal(
      'Rental Record for Edmund\n\tThe Conversation\t2\nAmount owed is 2\nYou earned 1 frequent renter points\n'
    );
  });

  it('handles longer regular rental', () => {
    const customer = { 'name': 'Francisco',
      'rentals': [{ 'movieID': 'REG01', 'days': 3 }]
    };

    expect(statement(customer, movies)).to.equal(
      'Rental Record for Francisco\n\tThe Conversation\t3.5\nAmount owed is 3.5\nYou earned 1 frequent renter points\n'
    );
  });
});

