'use strict';

const serviceFake = (req, res) => res.json({ done: 'done' });

const { expect } = require('chai');
const sinon = require('sinon');
const _ = require('lodash');
const log = require('../../logger');

require('./../../envSetup');
const config = require('./../../config');

const { ServiceManager } = require('../../backend');

function hasUserPrototype(obj) {
  return obj.constructor !== Object;
}

const createFixture = () => {
  const { middleware, controllers } = new ServiceManager(config);

  const fixture = {
    start: () => {},
    stop: () => {},
    middleware: Object.keys(middleware).reduce((result, key) => {
      result[key] = sinon.stub().callsArg(2);
      return result;
    }, {}),
    controllers: Object.keys(controllers).reduce((result, key) => {
      const target = controllers[key];

      if (hasUserPrototype(target)) {
        result[key] = Object.getOwnPropertyNames(Object.getPrototypeOf(target))
          .filter((_key) => _key !== 'constructor')
          .reduce((_result, _key) => {
            _result[_key] = sinon.stub().callsFake(serviceFake);
            return _result;
          }, {});
      } else {
        result[key] = Object.keys(target).reduce((_result, _key) => {
          _result[_key] = sinon.stub().callsFake(serviceFake);
          return _result;
        }, {});
      }

      return result;
    }, {}),
  };

  return fixture;
};

const checkFixture = (fixture, expected, debug = false) => {
  const { middleware, controllers } = fixture;

  Object.keys(controllers).forEach((controller) =>
    Object.keys(controllers[controller]).forEach((method) => {
      const expectedValue = _.get(expected, `controllers.${controller}.${method}`);

      if (debug || (expectedValue || 0) !== controllers[controller][method].callCount) {
        log.warn(
          `Expect controllers.${controller}.${method} to be called ${expectedValue || 0}, actual: ${controllers[controller][method].callCount}`
        );
      }

      if (expectedValue) {
        expect(controllers[controller][method].callCount).to.eql(expectedValue);
      } else {
        expect(controllers[controller][method].callCount).to.eql(0);
      }
    })
  );

  Object.keys(middleware).forEach((method) => {
    const expectedValue = _.get(expected, `middleware.${method}`);

    if (debug || (expectedValue || 0) !== middleware[method].callCount) {
      log.warn(`Expect middleware.${method} to be called: ${expectedValue || 0}, actual: ${middleware[method].callCount}`);
    }

    if (expectedValue) {
      expect(middleware[method].callCount).to.eql(expectedValue);
    } else {
      expect(middleware[method].callCount).to.eql(0);
    }
  });
};

module.exports = {
  createFixture,
  checkFixture,
};
