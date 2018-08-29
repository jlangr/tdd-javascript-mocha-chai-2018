const calculateCost = (rental, movie) => {
  let cost = 0;
  switch (movie.code) {
  case 'regular':
    cost = 2;
    if (rental.days > 2) {
      cost += (rental.days - 2) * 1.5;
    }
    break;
  case 'new':
    cost = rental.days * 3;
    break;
  case 'childrens':
    cost = 1.5;
    if (rental.days > 3) {
      cost += (rental.days - 3) * 1.5;
    }
    break;
  }
  return cost;
};

const calculateFrequentRenterPoints = (rental, movie) => {
  let frequentRenterPoints = 0;
  frequentRenterPoints++;
  // bonus for a two day new release rental
  if (movie.code === 'new' && rental.days > 2) frequentRenterPoints++;
  return frequentRenterPoints;
};

const header = customer => `Rental Record for ${customer.name}\n`;

const detail = (rental, movie) => 
  `\t${movie.title}\t${calculateCost(rental, movie)}\n`;

const calculateTotalCost = (rentals, movies) =>
  rentals.reduce((total, rental) => 
    total + calculateCost(rental, movies[rental.movieID]),
  0);

const calculateTotalFrequentRenterPoints = (rentals, movies) =>
  rentals.reduce((total, rental) => 
    total + calculateFrequentRenterPoints(rental, movies[rental.movieID]),
  0);

const footer = (rentals, movies) => {
  return `Amount owed is ${calculateTotalCost(rentals, movies)}\n`
    + `You earned ${calculateTotalFrequentRenterPoints(rentals, movies)} frequent renter points\n`;
};

export function statement(customer, movies) {
  let result = header(customer);
  for (let rental of customer.rentals)
    result += detail(rental, movies[rental.movieID]);
  result += footer(customer.rentals, movies);
  return result;
}