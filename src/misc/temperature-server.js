export const temperatureService = _city => {
  throw Error('server down');
};

export const averageTemp = (cities, temperatureService)  => {
  return cities
    .map(city => temperatureService(city))
    .reduce((sum, temp) => sum + temp, 0) / cities.length;
}