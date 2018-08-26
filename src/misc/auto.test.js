import { expect } from 'chai';
import sinon from 'sinon';
import { temperatureService, averageTemp } from './temperature-server';

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

describe('sinon', () => {
  it('does stuff', () => {
    const temperatureService = sinon.stub();
    temperatureService.withArgs('Miami').returns(96);
    temperatureService.withArgs('St. Louis').returns(88);

    const result = averageTemp(['Miami', 'St. Louis'], temperatureService);
  
    expect(result).to.equal(92);
  });
});
