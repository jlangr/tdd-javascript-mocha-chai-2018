import { expect } from 'chai';

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
