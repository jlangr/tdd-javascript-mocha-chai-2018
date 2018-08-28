import { expect } from 'chai';
import sinon from 'sinon';
import { currentTemperature } from './temperature-server';
import TemperatureService from './temperature-service';


class Auto {
  depressBrake() {}
  pressStartButton() {}
  RPM() {
    return 1100;
  }
}

describe('an auto', () => {
  it('idles engine when started', () => {
    const auto = new Auto();
    auto.depressBrake();

    auto.pressStartButton();

    expect(auto.RPM()).to.be.within(950, 1100);
  });
});

export const averageTemp = (cities, currentTemperature)  => {
  return cities
    .map(city => currentTemperature(city))
    .reduce((sum, temp) => sum + temp, 0) / cities.length;
};

describe('sinon', () => {
  it('supports simple function stub', () => {
    const temperatureServerStub = sinon.stub();
    temperatureServerStub.withArgs('Miami').returns(96);
    temperatureServerStub.withArgs('St. Louis').returns(88);

    const result = averageTemp(['Miami', 'St. Louis'], temperatureServerStub);
  
    expect(result).to.equal(92);
  });

  const averageTemperature = (cities, temperatureService)  => {
    return cities
      .map(city => temperatureService.currentTemperature(city))
      .reduce((sum, temp) => sum + temp, 0) / cities.length;
  };

  it('supports stubbing object functions', () => {
    const temperatureService = new TemperatureService();
    const currentTemperatureStub = sinon.stub(temperatureService, 'currentTemperature');
    currentTemperatureStub.withArgs('St. Louis').returns(88);
    currentTemperatureStub.withArgs('Colorado Springs').returns(72);

    const result = averageTemperature(['Colorado Springs', 'St. Louis'], temperatureService);
  
    expect(result).to.equal(80);
  });

  const avgTemperature = (cities)  => {
    return cities
      .map(city => new TemperatureService().currentTemperature(city))
      .reduce((sum, temp) => sum + temp, 0) / cities.length;
  };

  const sandbox = sinon.createSandbox();

  describe('avg temp', () => {
    let stub;

    beforeEach(() => { 
      stub = sinon.stub();
    });

    it('is same as temp for 1 city', () => {
      sinon.replace(TemperatureService.prototype, 'currentTemperature', stub);
      stub.withArgs('Phoenix').returns(115);

      const result = avgTemperature(['Phoenix']);

      expect(result).to.equal(115);
    });

    xit('throws when currentTemperature not stubbed', () => {
      expect(() => {
        console.log('ct: ', new TemperatureService().currentTemperature('Phoenix'));
      }).to.throw();
    });
  });

  const funcReturningPromise = () => 
    new Promise((resolve, _reject) => setTimeout(resolve, 500, 41));

  describe('testing promises', async () => {
    it('works but needs an it func under older node', async () => {
      const x = await funcReturningPromise();
      expect(x).to.equal(41);
    });
  });
});
